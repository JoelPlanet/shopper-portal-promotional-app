import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LocaleCode } from '@/config/languages'
import type { DisplayConfiguration } from '@/config/languages'
import { DEFAULT_CONFIGURATION } from '@/config/defaults'
import { useConfiguration } from '@/hooks/useConfiguration'
import { LanguageSelector } from './LanguageSelector'
import { RotationIntervalPicker } from './RotationIntervalPicker'
import { ScreenPreservationTriggerPicker } from './ScreenPreservationTriggerPicker'
import './SettingsView.css'

export function SettingsView() {
  const navigate = useNavigate()
  const { config, save, restoreDefaults } = useConfiguration()

  const [pending, setPending] = useState<DisplayConfiguration>({ ...config })
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [isTriggerValueValid, setIsTriggerValueValid] = useState(true)

  const handleSave = () => {
    if (!isTriggerValueValid) return
    save(pending)
    setSaved(true)
    setTimeout(() => navigate('/'), 800)
  }

  const handleRestoreDefaults = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    restoreDefaults()
    navigate('/', { state: { showInitialPreservation: true } })
  }

  const handleBack = () => navigate('/')

  return (
    <div className="settings-view">
      <header className="settings-header">
        <img src="/assets/planet-logo.svg" alt="Planet" className="settings-logo" />
        <h1 className="settings-title">Display Settings</h1>
      </header>

      <div className="settings-body">
        <LanguageSelector
          selectedLocales={pending.selectedLocales as LocaleCode[]}
          onChange={(locales) =>
            setPending((p) => ({ ...p, selectedLocales: locales }))
          }
        />

        {pending.selectedLocales.length > 1 && (
          <RotationIntervalPicker
            value={pending.rotationIntervalSeconds}
            onChange={(seconds) =>
              setPending((p) => ({ ...p, rotationIntervalSeconds: seconds }))
            }
          />
        )}

        <ScreenPreservationTriggerPicker
          value={pending.screenPreservationTrigger}
          onChange={(screenPreservationTrigger) =>
            setPending((current) => ({ ...current, screenPreservationTrigger }))
          }
          onValidityChange={setIsTriggerValueValid}
        />

        <RotationIntervalPicker
          value={pending.screenPreservationDurationSeconds}
          onChange={(screenPreservationDurationSeconds) =>
            setPending((current) => ({ ...current, screenPreservationDurationSeconds }))
          }
          label="Rest screen duration"
          inputLabel="Screen preservation duration in seconds"
          decreaseLabel="Decrease screen preservation duration"
          increaseLabel="Increase screen preservation duration"
          minSeconds={5}
          maxSeconds={30}
        />

        {/* Show defaults hint when only one language is active */}
        {pending.selectedLocales.length === 1 && (
          <p className="settings-note">
            Select more than one language to enable rotation.
          </p>
        )}

        {/* Current defaults reference */}
        <p className="settings-note settings-note--muted">
          Default: {DEFAULT_CONFIGURATION.selectedLocales.join(', ')} ·{' '}
          {DEFAULT_CONFIGURATION.rotationIntervalSeconds}s interval
        </p>
      </div>

      <footer className="settings-footer">
        <button
          type="button"
          className="settings-btn settings-btn--primary"
          onClick={handleSave}
          disabled={saved || !isTriggerValueValid}
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>

        {!confirmReset && (
          <button
            type="button"
            className="settings-btn settings-btn--secondary"
            onClick={handleBack}
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          className={`settings-btn settings-btn--restore settings-btn--danger${confirmReset ? ' settings-btn--confirm' : ''}`}
          onClick={handleRestoreDefaults}
        >
          {confirmReset ? 'Confirm reset?' : 'Restore defaults'}
        </button>

        {confirmReset && (
          <button
            type="button"
            className="settings-btn settings-btn--secondary"
            onClick={() => setConfirmReset(false)}
          >
            Cancel
          </button>
        )}
      </footer>
    </div>
  )
}
