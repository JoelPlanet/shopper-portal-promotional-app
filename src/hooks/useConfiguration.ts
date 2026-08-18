import { useState } from 'react'
import type { DisplayConfiguration, ScreenPreservationTrigger } from '@/config/languages'
import { DEFAULT_CONFIGURATION } from '@/config/defaults'

const STORAGE_KEY = 'ndsk:config'
const MIN_PRESERVATION_DURATION_SECONDS = 5
const MAX_PRESERVATION_DURATION_SECONDS = 30

function isValidTrigger(trigger: unknown): trigger is ScreenPreservationTrigger {
  if (!trigger || typeof trigger !== 'object') return false
  const { type, value } = trigger as ScreenPreservationTrigger
  return (type === 'cycles' || type === 'minutes') && Number.isInteger(value) && value > 0
}

function isValidPreservationDuration(value: unknown): value is number {
  return typeof value === 'number'
    && Number.isInteger(value)
    && value >= MIN_PRESERVATION_DURATION_SECONDS
    && value <= MAX_PRESERVATION_DURATION_SECONDS
    && value % 5 === 0
}

function readConfig(): DisplayConfiguration {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIGURATION
    const parsed = JSON.parse(raw) as Partial<DisplayConfiguration>
    // Validate minimum shape before trusting stored data
    if (!Array.isArray(parsed.selectedLocales) || parsed.selectedLocales.length === 0) {
      return DEFAULT_CONFIGURATION
    }
    if (typeof parsed.rotationIntervalSeconds !== 'number') {
      return DEFAULT_CONFIGURATION
    }
    return {
      selectedLocales: parsed.selectedLocales,
      rotationIntervalSeconds: parsed.rotationIntervalSeconds,
      screenPreservationTrigger: isValidTrigger(parsed.screenPreservationTrigger)
        ? parsed.screenPreservationTrigger
        : DEFAULT_CONFIGURATION.screenPreservationTrigger,
      screenPreservationDurationSeconds: isValidPreservationDuration(
        parsed.screenPreservationDurationSeconds,
      )
        ? parsed.screenPreservationDurationSeconds
        : DEFAULT_CONFIGURATION.screenPreservationDurationSeconds,
    }
  } catch {
    return DEFAULT_CONFIGURATION
  }
}

export function useConfiguration() {
  const [config, setConfig] = useState<DisplayConfiguration>(readConfig)

  function save(next: DisplayConfiguration): void {
    if (!Array.isArray(next.selectedLocales) || next.selectedLocales.length === 0) return
    if (!Number.isInteger(next.rotationIntervalSeconds) || next.rotationIntervalSeconds < 5) return
    if (!isValidTrigger(next.screenPreservationTrigger)) return
    if (!isValidPreservationDuration(next.screenPreservationDurationSeconds)) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setConfig(next)
  }

  function restoreDefaults(): void {
    localStorage.removeItem(STORAGE_KEY)
    setConfig(DEFAULT_CONFIGURATION)
  }

  return { config, save, restoreDefaults }
}
