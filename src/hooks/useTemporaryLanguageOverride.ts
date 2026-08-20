import { useEffect, useRef, useState } from 'react'
import type { LocaleCode } from '@/config/languages'

const TEMPORARY_LANGUAGE_OVERRIDE_MS = 20_000

export function useTemporaryLanguageOverride(rotationLocale?: LocaleCode) {
  const [overrideLocale, setOverrideLocale] = useState<LocaleCode | null>(null)
  const timeoutRef = useRef<number>()

  const clearOverrideTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }

  const startOverride = (locale: LocaleCode) => {
    clearOverrideTimer()
    setOverrideLocale(locale)
    timeoutRef.current = window.setTimeout(() => {
      setOverrideLocale(null)
      timeoutRef.current = undefined
    }, TEMPORARY_LANGUAGE_OVERRIDE_MS)
  }

  useEffect(() => clearOverrideTimer, [])

  return {
    activeLocale: overrideLocale ?? rotationLocale,
    overrideLocale,
    isOverrideActive: overrideLocale !== null,
    startOverride,
  }
}