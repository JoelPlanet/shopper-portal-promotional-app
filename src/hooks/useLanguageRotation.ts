import { useEffect, useRef, useState } from 'react'
import type { LocaleCode } from '@/config/languages'

const MINIMUM_INTERVAL_SECONDS = 5

interface Options {
  selectedLocales: LocaleCode[]
  rotationIntervalSeconds: number
  isPaused?: boolean
  startLocale?: LocaleCode
  onCycleComplete?: () => void
}

export function useLanguageRotation({
  selectedLocales,
  rotationIntervalSeconds,
  isPaused = false,
  startLocale = selectedLocales[0],
  onCycleComplete,
}: Options) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [completedCycles, setCompletedCycles] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const onCycleCompleteRef = useRef(onCycleComplete)

  useEffect(() => {
    onCycleCompleteRef.current = onCycleComplete
  }, [onCycleComplete])

  const startIndex = Math.max(0, selectedLocales.indexOf(startLocale))

  // Restart from the requested locale when the active language set or anchor changes.
  useEffect(() => {
    setActiveIndex(startIndex)
    setCompletedCycles(0)
  }, [selectedLocales, startIndex])

  // Start/restart the rotation timer
  useEffect(() => {
    clearInterval(intervalRef.current)

    if (isPaused || selectedLocales.length <= 1) return

    const ms =
      Math.max(MINIMUM_INTERVAL_SECONDS, rotationIntervalSeconds) * 1000

    intervalRef.current = setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % selectedLocales.length
        if (nextIndex === startIndex) {
          setCompletedCycles((currentCycles) => currentCycles + 1)
          onCycleCompleteRef.current?.()
        }
        return nextIndex
      })
    }, ms)

    return () => clearInterval(intervalRef.current)
  }, [selectedLocales, rotationIntervalSeconds, isPaused, startIndex])

  const activeLocale = selectedLocales[Math.min(activeIndex, selectedLocales.length - 1)]

  return { activeLocale, activeIndex, completedCycles }
}
