import { useEffect, useState } from 'react'

export const PRESERVATION_INTERVAL_MS = 5 * 60 * 1000
export const PRESERVATION_DURATION_MS = 15 * 1000
export const INITIAL_PRESERVATION_DURATION_MS = 3 * 1000

const DISMISS_EVENTS = ['click', 'mousemove', 'pointerdown', 'touchstart', 'keydown'] as const

interface Options {
  initialDurationMs?: number
}

interface PreservationState {
  isActive: boolean
  durationMs: number
}

export function useScreenPreservation({ initialDurationMs = 0 }: Options = {}) {
  const [preservation, setPreservation] = useState<PreservationState>(() => ({
    isActive: initialDurationMs > 0,
    durationMs: initialDurationMs,
  }))

  useEffect(() => {
    if (!preservation.isActive) {
      const activationTimer = window.setTimeout(
        () => setPreservation({
          isActive: true,
          durationMs: PRESERVATION_DURATION_MS,
        }),
        PRESERVATION_INTERVAL_MS,
      )
      return () => window.clearTimeout(activationTimer)
    }

    const dismiss = () => setPreservation({ isActive: false, durationMs: 0 })
    const durationTimer = window.setTimeout(dismiss, preservation.durationMs)

    for (const eventName of DISMISS_EVENTS) {
      window.addEventListener(eventName, dismiss, { passive: true })
    }

    return () => {
      window.clearTimeout(durationTimer)
      for (const eventName of DISMISS_EVENTS) {
        window.removeEventListener(eventName, dismiss)
      }
    }
  }, [preservation])

  return preservation.isActive
}