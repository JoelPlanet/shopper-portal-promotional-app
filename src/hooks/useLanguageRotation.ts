import { useEffect, useRef, useState } from 'react'
import type { LocaleCode } from '@/config/languages'

const MINIMUM_INTERVAL_SECONDS = 5

interface Options {
  selectedLocales: LocaleCode[]
  rotationIntervalSeconds: number
}

export function useLanguageRotation({ selectedLocales, rotationIntervalSeconds }: Options) {
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  // Reset to index 0 whenever the locale list changes
  useEffect(() => {
    setActiveIndex(0)
  }, [selectedLocales])

  // Start/restart the rotation timer
  useEffect(() => {
    clearInterval(intervalRef.current)

    if (selectedLocales.length <= 1) return

    const ms =
      Math.max(MINIMUM_INTERVAL_SECONDS, rotationIntervalSeconds) * 1000

    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % selectedLocales.length)
    }, ms)

    return () => clearInterval(intervalRef.current)
  }, [selectedLocales, rotationIntervalSeconds])

  const activeLocale = selectedLocales[Math.min(activeIndex, selectedLocales.length - 1)]

  return { activeLocale, activeIndex }
}
