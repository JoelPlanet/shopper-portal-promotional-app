import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LocaleCode } from '@/config/languages'
import type { DisplayConfiguration } from '@/config/languages'
import { DEFAULT_CONFIGURATION } from '@/config/defaults'
import { useConfiguration } from '@/hooks/useConfiguration'
import { LanguageSelector } from './LanguageSelector'
import { RotationIntervalPicker } from './RotationIntervalPicker'
import './SettingsView.css'

export function SettingsView() {
  const navigate = useNavigate()
  const { config, save, restoreDefaults } = useConfiguration()

  const [pending, setPending] = useState<DisplayConfiguration>({ ...config })
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleSave = () => {
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
    navigate('/')
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
          disabled={saved}
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>

        <button
          type="button"
          className={`settings-btn settings-btn--danger${confirmReset ? ' settings-btn--confirm' : ''}`}
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

        {!confirmReset && (
          <button
            type="button"
            className="settings-btn settings-btn--secondary"
            onClick={handleBack}
          >
            ← Back
          </button>
        )}
      </footer>
    </div>
  )
}
