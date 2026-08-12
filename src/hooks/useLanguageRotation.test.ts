// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { LocaleCode } from '@/config/languages'
import { useLanguageRotation } from './useLanguageRotation'

describe('useLanguageRotation', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('pauses rotation while screen preservation is active and resumes afterward', () => {
    const selectedLocales: LocaleCode[] = ['en', 'fr']
    const { result, rerender } = renderHook(
      ({ isPaused }) => useLanguageRotation({
        selectedLocales,
        rotationIntervalSeconds: 5,
        isPaused,
      }),
      { initialProps: { isPaused: false } },
    )

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.activeLocale).toBe('fr')

    rerender({ isPaused: true })
    act(() => vi.advanceTimersByTime(10000))
    expect(result.current.activeLocale).toBe('fr')

    rerender({ isPaused: false })
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.activeLocale).toBe('en')
  })
})