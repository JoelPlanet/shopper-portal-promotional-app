import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SettingsView } from '@/components/settings/SettingsView'

export default function SettingsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // Only allow access via the PIN gate on the display; direct URL → back to display
  const pinVerified =
    (location.state as { pinVerified?: boolean } | null)?.pinVerified === true

  useEffect(() => {
    if (!pinVerified) navigate('/', { replace: true })
    // Reset document direction to LTR for the admin settings page
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = 'en'
  }, [pinVerified, navigate])

  if (!pinVerified) return null

  return <SettingsView />
}
