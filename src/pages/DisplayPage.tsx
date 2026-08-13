import { useLocation, useNavigate } from 'react-router-dom'
import { useConfiguration } from '@/hooks/useConfiguration'
import { useLanguageRotation } from '@/hooks/useLanguageRotation'
import {
  INITIAL_PRESERVATION_DURATION_MS,
  useScreenPreservation,
} from '@/hooks/useScreenPreservation'
import { DisplayView } from '@/components/display/DisplayView'
import { ScreenPreservationMode } from '@/components/display/ScreenPreservationMode'
import { PinGate } from '@/components/settings/PinGate'

export default function DisplayPage() {
  const { config } = useConfiguration()
  const location = useLocation()
  const navigate = useNavigate()
  const routeState = location.state as { showInitialPreservation?: boolean } | null
  const shouldShowInitialPreservation =
    location.key === 'default' || routeState?.showInitialPreservation === true
  const preservation = useScreenPreservation({
    initialDurationMs: shouldShowInitialPreservation
      ? INITIAL_PRESERVATION_DURATION_MS
      : 0,
  })

  const { activeLocale } = useLanguageRotation({
    selectedLocales: config.selectedLocales,
    rotationIntervalSeconds: config.rotationIntervalSeconds,
    isPaused: preservation.isActive,
  })

  return (
    <>
      <DisplayView activeLocale={activeLocale} />
      <PinGate
        onUnlock={() => navigate('/settings', { state: { pinVerified: true } })}
      />
      <ScreenPreservationMode
        isActive={preservation.isActive}
        isPeriodic={preservation.isPeriodic}
      />
    </>
  )
}
