import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { LocaleCode } from '@/config/languages'
import { useConfiguration } from '@/hooks/useConfiguration'
import { useLanguageRotation } from '@/hooks/useLanguageRotation'
import { useTemporaryLanguageOverride } from '@/hooks/useTemporaryLanguageOverride'
import { useScreenPreservationLocale } from '@/hooks/useScreenPreservationLocale'
import {
  INITIAL_PRESERVATION_DURATION_MS,
  useScreenPreservation,
} from '@/hooks/useScreenPreservation'
import { DisplayView } from '@/components/display/DisplayView'
import { ScreenPreservationMode } from '@/components/display/ScreenPreservationMode'
import { PinGate } from '@/components/settings/PinGate'

export default function DisplayPage() {
  const { config } = useConfiguration()
  const [completedCycles, setCompletedCycles] = useState(0)
  const [rotationResetKey, setRotationResetKey] = useState(0)
  const [normalStartLocale, setNormalStartLocale] = useState<LocaleCode>(
    config.selectedLocales[0],
  )
  const temporaryLanguage = useTemporaryLanguageOverride()
  const location = useLocation()
  const navigate = useNavigate()
  const routeState = location.state as { showInitialPreservation?: boolean } | null
  const shouldShowInitialPreservation =
    location.key === 'default' || routeState?.showInitialPreservation === true
  const preservation = useScreenPreservation({
    initialDurationMs: shouldShowInitialPreservation
      ? INITIAL_PRESERVATION_DURATION_MS
      : 0,
    trigger: config.screenPreservationTrigger,
    completedCycles,
    durationSeconds: config.screenPreservationDurationSeconds,
  })

  const { activeLocale } = useLanguageRotation({
    selectedLocales: config.selectedLocales,
    rotationIntervalSeconds: config.rotationIntervalSeconds,
    isPaused: preservation.isActive || temporaryLanguage.isOverrideActive,
    startLocale: normalStartLocale,
    resetKey: rotationResetKey,
    onCycleComplete: () => setCompletedCycles((currentCycles) => currentCycles + 1),
  })
  const displayLocale = temporaryLanguage.overrideLocale ?? activeLocale
  const preservationLocale = useScreenPreservationLocale({
    selectedLocales: config.selectedLocales,
    isActive: preservation.isActive,
  })
  const wasPreservationActive = useRef(preservation.isActive)
  const wasOverrideActive = useRef(temporaryLanguage.isOverrideActive)

  useEffect(() => {
    if (wasPreservationActive.current && !preservation.isActive) {
      setNormalStartLocale(preservationLocale)
    }
    wasPreservationActive.current = preservation.isActive
  }, [preservation.isActive, preservationLocale])

  useEffect(() => {
    if (wasOverrideActive.current && !temporaryLanguage.isOverrideActive) {
      setCompletedCycles(0)
      setNormalStartLocale(config.selectedLocales[0])
      setRotationResetKey((currentKey) => currentKey + 1)
    }
    wasOverrideActive.current = temporaryLanguage.isOverrideActive
  }, [config.selectedLocales, temporaryLanguage.isOverrideActive])

  useEffect(() => {
    setNormalStartLocale((currentLocale) => (
      config.selectedLocales.includes(currentLocale)
        ? currentLocale
        : config.selectedLocales[0]
    ))
  }, [config.selectedLocales])

  return (
    <>
      <DisplayView
        activeLocale={displayLocale}
        onTemporaryLanguageSelect={temporaryLanguage.startOverride}
      />
      <PinGate
        onUnlock={() => navigate('/settings', { state: { pinVerified: true } })}
      />
      <ScreenPreservationMode
        isActive={preservation.isActive}
        isPeriodic={preservation.isPeriodic}
        locale={temporaryLanguage.overrideLocale ?? preservationLocale}
      />
    </>
  )
}
