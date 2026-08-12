import { useState } from 'react'
import type { DisplayConfiguration } from '@/config/languages'
import { DEFAULT_CONFIGURATION } from '@/config/defaults'

const STORAGE_KEY = 'ndsk:config'

function readConfig(): DisplayConfiguration {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIGURATION
    const parsed = JSON.parse(raw) as DisplayConfiguration
    // Validate minimum shape before trusting stored data
    if (!Array.isArray(parsed.selectedLocales) || parsed.selectedLocales.length === 0) {
      return DEFAULT_CONFIGURATION
    }
    if (typeof parsed.rotationIntervalSeconds !== 'number') {
      return DEFAULT_CONFIGURATION
    }
    return parsed
  } catch {
    return DEFAULT_CONFIGURATION
  }
}

export function useConfiguration() {
  const [config, setConfig] = useState<DisplayConfiguration>(readConfig)

  function save(next: DisplayConfiguration): void {
    if (!Array.isArray(next.selectedLocales) || next.selectedLocales.length === 0) return
    if (next.rotationIntervalSeconds < 5) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setConfig(next)
  }

  function restoreDefaults(): void {
    localStorage.removeItem(STORAGE_KEY)
    setConfig(DEFAULT_CONFIGURATION)
  }

  return { config, save, restoreDefaults }
}
