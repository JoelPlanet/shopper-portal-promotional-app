// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  INITIAL_PRESERVATION_DURATION_MS,
  PRESERVATION_DURATION_MS,
  useScreenPreservation,
} from './useScreenPreservation'

describe('useScreenPreservation', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('starts in preservation mode for three seconds and allows immediate dismissal', () => {
    const { result } = renderHook(() => useScreenPreservation({
      initialDurationMs: INITIAL_PRESERVATION_DURATION_MS,
    }))

    expect(result.current.isActive).toBe(true)
    expect(result.current.isPeriodic).toBe(false)

    act(() => vi.advanceTimersByTime(INITIAL_PRESERVATION_DURATION_MS - 1))
    expect(result.current.isActive).toBe(true)

    act(() => window.dispatchEvent(new Event('click')))
    expect(result.current.isActive).toBe(false)
  })

  it('activates after the configured number of minutes and restores after the configured duration', () => {
    const { result } = renderHook(() => useScreenPreservation({
      trigger: { type: 'minutes', value: 2 },
      durationSeconds: 5,
    }))

    act(() => vi.advanceTimersByTime(2 * 60 * 1000))
    expect(result.current.isActive).toBe(true)
    expect(result.current.isPeriodic).toBe(true)

    act(() => vi.advanceTimersByTime(5 * 1000))
    expect(result.current.isActive).toBe(false)
  })

  it('still allows click dismissal before the configured duration elapses', () => {
    const { result } = renderHook(() => useScreenPreservation({
      trigger: { type: 'minutes', value: 2 },
      durationSeconds: 30,
    }))

    act(() => vi.advanceTimersByTime(2 * 60 * 1000))
    expect(result.current.isActive).toBe(true)

    act(() => window.dispatchEvent(new Event('click')))
    expect(result.current.isActive).toBe(false)
  })

  it.each(['click', 'mousemove', 'touchstart', 'keydown'] as const)(
    'dismisses on %s and restarts the configured interval',
    (eventName) => {
      const { result } = renderHook(() => useScreenPreservation({
        trigger: { type: 'minutes', value: 2 },
      }))

      act(() => vi.advanceTimersByTime(2 * 60 * 1000))
      act(() => window.dispatchEvent(new Event(eventName)))
      expect(result.current.isActive).toBe(false)

      act(() => vi.advanceTimersByTime(2 * 60 * 1000 - 1))
      expect(result.current.isActive).toBe(false)

      act(() => vi.advanceTimersByTime(1))
      expect(result.current.isActive).toBe(true)
      expect(result.current.isPeriodic).toBe(true)
    },
  )

  it('activates after the configured number of completed content cycles', () => {
    const { result, rerender } = renderHook(
      ({ completedCycles }) => useScreenPreservation({
        trigger: { type: 'cycles', value: 2 },
        completedCycles,
      }),
      { initialProps: { completedCycles: 0 } },
    )

    rerender({ completedCycles: 1 })
    expect(result.current.isActive).toBe(false)

    rerender({ completedCycles: 2 })
    expect(result.current.isActive).toBe(true)
    expect(result.current.isPeriodic).toBe(true)

    act(() => vi.advanceTimersByTime(PRESERVATION_DURATION_MS))
    expect(result.current.isActive).toBe(false)

    rerender({ completedCycles: 3 })
    expect(result.current.isActive).toBe(false)

    rerender({ completedCycles: 4 })
    expect(result.current.isActive).toBe(true)
  })
})