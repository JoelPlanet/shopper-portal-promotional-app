// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useLocation, MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SettingsView } from './SettingsView'

function DisplayRouteState() {
  const location = useLocation()
  const state = location.state as { showInitialPreservation?: boolean } | null
  return <p>Replay preservation: {String(state?.showInitialPreservation)}</p>
}

describe('SettingsView', () => {
  afterEach(cleanup)

  beforeEach(() => {
    localStorage.setItem('ndsk:config', JSON.stringify({
      selectedLocales: ['en'],
      rotationIntervalSeconds: 30,
    }))
  })

  it('restores defaults and requests the startup preservation screen', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/" element={<DisplayRouteState />} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Restore defaults' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm reset?' }))

    expect(localStorage.getItem('ndsk:config')).toBeNull()
    expect(screen.getByText('Replay preservation: true')).toBeTruthy()
  })

  it('switches between exclusive trigger methods and blocks an invalid trigger value', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('radio', { name: 'After X cycles' }))
    expect(screen.getByLabelText('Cycles before activation')).toBeTruthy()
    expect(screen.queryByLabelText('Minutes before activation')).toBeNull()

    fireEvent.change(screen.getByLabelText('Cycles before activation'), {
      target: { value: '1.5' },
    })
    expect(screen.getByRole('button', { name: 'Save' })).toHaveProperty('disabled', true)
  })

  it('configures preservation duration with five-second steps from 5 to 30 seconds', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </MemoryRouter>,
    )

    const input = screen.getByRole('spinbutton', {
      name: 'Screen preservation duration in seconds',
    })
    expect(input).toHaveProperty('value', '15')

    fireEvent.click(screen.getByRole('button', { name: 'Increase screen preservation duration' }))
    expect(input).toHaveProperty('value', '20')

    fireEvent.change(input, { target: { value: '35' } })
    expect(input).toHaveProperty('value', '30')
  })
})