// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  INITIAL_PRESERVATION_DURATION_MS,
  PRESERVATION_DURATION_MS,
  PRESERVATION_INTERVAL_MS,
  useScreenPreservation,
} from './useScreenPreservation'

describe('useScreenPreservation', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('starts in preservation mode for three seconds and allows immediate dismissal', () => {
    const { result } = renderHook(() => useScreenPreservation({
      initialDurationMs: INITIAL_PRESERVATION_DURATION_MS,
    }))

    expect(result.current).toBe(true)

    act(() => vi.advanceTimersByTime(INITIAL_PRESERVATION_DURATION_MS - 1))
    expect(result.current).toBe(true)

    act(() => window.dispatchEvent(new Event('click')))
    expect(result.current).toBe(false)
  })

  it('activates after five minutes and restores the display after 15 seconds', () => {
    const { result } = renderHook(() => useScreenPreservation())

    act(() => vi.advanceTimersByTime(PRESERVATION_INTERVAL_MS))
    expect(result.current).toBe(true)

    act(() => vi.advanceTimersByTime(PRESERVATION_DURATION_MS))
    expect(result.current).toBe(false)
  })

  it.each(['click', 'mousemove', 'touchstart', 'keydown'] as const)(
    'dismisses on %s and restarts the five-minute interval',
    (eventName) => {
      const { result } = renderHook(() => useScreenPreservation())

      act(() => vi.advanceTimersByTime(PRESERVATION_INTERVAL_MS))
      act(() => window.dispatchEvent(new Event(eventName)))
      expect(result.current).toBe(false)

      act(() => vi.advanceTimersByTime(PRESERVATION_INTERVAL_MS - 1))
      expect(result.current).toBe(false)

      act(() => vi.advanceTimersByTime(1))
      expect(result.current).toBe(true)
    },
  )
})