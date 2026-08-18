import { useEffect, useRef, useState } from 'react'
import type { ScreenPreservationTrigger } from '@/config/languages'

export const PRESERVATION_DURATION_MS = 15 * 1000
export const INITIAL_PRESERVATION_DURATION_MS = 3 * 1000

const DISMISS_EVENTS = ['click', 'mousemove', 'pointerdown', 'touchstart', 'keydown'] as const

interface Options {
  initialDurationMs?: number
  trigger?: ScreenPreservationTrigger
  completedCycles?: number
  durationSeconds?: number
}

interface PreservationState {
  isActive: boolean
  durationMs: number
  isPeriodic: boolean
}

export function useScreenPreservation({
  initialDurationMs = 0,
  trigger = { type: 'minutes', value: 5 },
  completedCycles = 0,
  durationSeconds = PRESERVATION_DURATION_MS / 1000,
}: Options = {}) {
  const [preservation, setPreservation] = useState<PreservationState>(() => ({
    isActive: initialDurationMs > 0,
    durationMs: initialDurationMs,
    isPeriodic: false,
  }))
  const previousCompletedCycles = useRef(completedCycles)
  const countedCycles = useRef(0)

  useEffect(() => {
    previousCompletedCycles.current = completedCycles
    countedCycles.current = 0
  }, [trigger.type, trigger.value])

  useEffect(() => {
    if (!preservation.isActive && trigger.type === 'minutes') {
      const activationTimer = window.setTimeout(
        () => setPreservation({
          isActive: true,
          durationMs: durationSeconds * 1000,
          isPeriodic: true,
        }),
        trigger.value * 60 * 1000,
      )
      return () => window.clearTimeout(activationTimer)
    }

    if (!preservation.isActive) return

    const dismiss = () => setPreservation({
      isActive: false,
      durationMs: 0,
      isPeriodic: false,
    })
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
  }, [durationSeconds, preservation, trigger])

  useEffect(() => {
    const previous = previousCompletedCycles.current
    previousCompletedCycles.current = completedCycles

    if (preservation.isActive || trigger.type !== 'cycles') return

    const newCycles = Math.max(0, completedCycles - previous)
    countedCycles.current += newCycles
    if (countedCycles.current >= trigger.value) {
      countedCycles.current = 0
      setPreservation({
        isActive: true,
        durationMs: durationSeconds * 1000,
        isPeriodic: true,
      })
    }
  }, [completedCycles, durationSeconds, preservation.isActive, trigger])

  return preservation
}