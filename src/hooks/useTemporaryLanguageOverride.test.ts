// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { LocaleCode } from '@/config/languages'
import { useTemporaryLanguageOverride } from './useTemporaryLanguageOverride'

describe('useTemporaryLanguageOverride', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('holds a selected temporary language for 20 seconds before returning to rotation', () => {
    const { result, rerender } = renderHook(
      ({ rotationLocale }) => useTemporaryLanguageOverride(rotationLocale),
      { initialProps: { rotationLocale: 'en' as LocaleCode } },
    )

    act(() => result.current.startOverride('it'))
    expect(result.current.activeLocale).toBe('it')
    expect(result.current.isOverrideActive).toBe(true)

    rerender({ rotationLocale: 'fr' as const })
    act(() => vi.advanceTimersByTime(19999))
    expect(result.current.activeLocale).toBe('it')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current.activeLocale).toBe('fr')
    expect(result.current.isOverrideActive).toBe(false)
  })

  it('lets the most recent temporary selection win and resets the timer', () => {
    const { result } = renderHook(() => useTemporaryLanguageOverride('en'))

    act(() => result.current.startOverride('it'))
    act(() => vi.advanceTimersByTime(10000))
    act(() => result.current.startOverride('ar'))

    expect(result.current.activeLocale).toBe('ar')


    act(() => vi.advanceTimersByTime(19999))
    expect(result.current.activeLocale).toBe('ar')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current.activeLocale).toBe('en')
    expect(result.current.isOverrideActive).toBe(false)
  })

  it('cleans up the active override timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    const { result, unmount } = renderHook(() => useTemporaryLanguageOverride('en'))

    act(() => result.current.startOverride('it'))
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})