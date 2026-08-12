import { useNavigate } from 'react-router-dom'
import { useConfiguration } from '@/hooks/useConfiguration'
import { useLanguageRotation } from '@/hooks/useLanguageRotation'
import { DisplayView } from '@/components/display/DisplayView'
import { PinGate } from '@/components/settings/PinGate'

export default function DisplayPage() {
  const { config } = useConfiguration()
  const navigate = useNavigate()

  const { activeLocale } = useLanguageRotation({
    selectedLocales: config.selectedLocales,
    rotationIntervalSeconds: config.rotationIntervalSeconds,
  })

  return (
    <>
      <DisplayView activeLocale={activeLocale} />
      <PinGate
        onUnlock={() => navigate('/settings', { state: { pinVerified: true } })}
      />
    </>
  )
}
