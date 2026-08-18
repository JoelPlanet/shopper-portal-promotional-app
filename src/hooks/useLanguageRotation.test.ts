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

  it('counts a completed cycle when rotation returns to the first language', () => {
    const selectedLocales: LocaleCode[] = ['en', 'fr']
    const { result } = renderHook(() => useLanguageRotation({
      selectedLocales,
      rotationIntervalSeconds: 5,
    }))

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.completedCycles).toBe(0)

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.completedCycles).toBe(1)
    expect(result.current.activeLocale).toBe('en')
  })

  it('restarts from the preservation locale and completes a cycle after every active language', () => {
    const selectedLocales: LocaleCode[] = ['en', 'fr', 'es']
    const { result, rerender } = renderHook(
      ({ startLocale }) => useLanguageRotation({
        selectedLocales,
        rotationIntervalSeconds: 5,
        startLocale,
      }),
      { initialProps: { startLocale: 'en' as LocaleCode } },
    )

    rerender({ startLocale: 'fr' })
    expect(result.current.activeLocale).toBe('fr')

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.activeLocale).toBe('es')

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.activeLocale).toBe('en')
    expect(result.current.completedCycles).toBe(0)

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.activeLocale).toBe('fr')
    expect(result.current.completedCycles).toBe(1)
  })
})