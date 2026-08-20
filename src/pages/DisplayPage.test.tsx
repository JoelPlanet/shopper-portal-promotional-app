// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { LocaleCode } from '@/config/languages'

vi.mock('@/components/display/DisplayView', () => ({
  DisplayView: ({
    activeLocale,
    onTemporaryLanguageSelect,
  }: {
    activeLocale: LocaleCode
    onTemporaryLanguageSelect: (locale: LocaleCode) => void
  }) => (
    <div>
      <p data-testid="display-locale">{activeLocale}</p>
      <button type="button" onClick={() => onTemporaryLanguageSelect('it')}>
        Choose temporary Italian
      </button>
    </div>
  ),
}))

vi.mock('@/components/settings/PinGate', () => ({
  PinGate: () => null,
}))

vi.mock('@/components/display/ScreenPreservationMode', () => ({
  ScreenPreservationMode: () => null,
}))

vi.mock('@/hooks/useScreenPreservation', () => ({
  INITIAL_PRESERVATION_DURATION_MS: 3000,
  useScreenPreservation: () => ({ isActive: false, isPeriodic: false }),
}))

vi.mock('@/hooks/useScreenPreservationLocale', () => ({
  useScreenPreservationLocale: () => 'en',
}))

import DisplayPage from './DisplayPage'

describe('DisplayPage temporary language override', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.setItem('ndsk:config', JSON.stringify({
      selectedLocales: ['en', 'fr'],
      rotationIntervalSeconds: 5,
      screenPreservationTrigger: { type: 'minutes', value: 5 },
      screenPreservationDurationSeconds: 15,
    }))
  })

  afterEach(() => {
    cleanup()
    localStorage.clear()
    vi.useRealTimers()
  })

  it('pauses rotation for a temporary selection and restarts configured rotation from the beginning', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <DisplayPage />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('display-locale').textContent).toBe('en')

    act(() => vi.advanceTimersByTime(5000))
    expect(screen.getByTestId('display-locale').textContent).toBe('fr')

    fireEvent.click(screen.getByRole('button', { name: 'Choose temporary Italian' }))
    expect(screen.getByTestId('display-locale').textContent).toBe('it')

    act(() => vi.advanceTimersByTime(10000))
    expect(screen.getByTestId('display-locale').textContent).toBe('it')

    act(() => vi.advanceTimersByTime(10000))
    expect(screen.getByTestId('display-locale').textContent).toBe('en')

    expect(JSON.parse(localStorage.getItem('ndsk:config') ?? '{}').selectedLocales).toEqual(['en', 'fr'])
  })
})