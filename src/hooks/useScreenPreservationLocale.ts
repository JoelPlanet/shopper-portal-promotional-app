import { useEffect, useRef, useState } from 'react'
import type { LocaleCode } from '@/config/languages'

interface Options {
  selectedLocales: LocaleCode[]
  isActive: boolean
}

export function useScreenPreservationLocale({ selectedLocales, isActive }: Options) {
  const [locale, setLocale] = useState<LocaleCode>(selectedLocales[0])
  const nextLocaleIndex = useRef(0)
  const wasActive = useRef(false)

  useEffect(() => {
    nextLocaleIndex.current = 0
    setLocale(selectedLocales[0])
  }, [selectedLocales])

  useEffect(() => {
    if (isActive && !wasActive.current) {
      const index = nextLocaleIndex.current % selectedLocales.length
      setLocale(selectedLocales[index])
      nextLocaleIndex.current = (index + 1) % selectedLocales.length
    }
    wasActive.current = isActive
  }, [isActive, selectedLocales])

  return locale
}