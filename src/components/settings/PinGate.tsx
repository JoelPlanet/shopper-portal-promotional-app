import { useCallback, useEffect, useRef, useState } from 'react'
import { ENV } from '@/config/env'
import './PinGate.css'

interface Props {
  onUnlock: () => void
}

async function sha256Hex(text: string): Promise<string> {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  )
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function PinGate({ onUnlock }: Props) {
  const tapCount = useRef(0)
  const lastTap = useRef(0)
  const resetTimer = useRef<ReturnType<typeof setTimeout>>()
  const [showPin, setShowPin] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  // Focus input when dialog opens
  useEffect(() => {
    if (showPin) inputRef.current?.focus()
  }, [showPin])

  const handleIconClick = useCallback(() => {
    const now = Date.now()
    if (now - lastTap.current > 5000) tapCount.current = 0
    lastTap.current = now
    tapCount.current += 1

    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => {
      tapCount.current = 0
    }, 5000)

    if (tapCount.current >= 5) {
      tapCount.current = 0
      clearTimeout(resetTimer.current)
      setShowPin(true)
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const hex = await sha256Hex(pin)
      if (hex === ENV.pinHash) {
        setShowPin(false)
        setPin('')
        setError(false)
        onUnlock()
      } else {
        setError(true)
        setPin('')
        inputRef.current?.focus()
      }
    },
    [pin, onUnlock],
  )

  const handleCancel = useCallback(() => {
    setShowPin(false)
    setPin('')
    setError(false)
  }, [])

  return (
    <>
      <button
        className="settings-icon-btn"
        onClick={handleIconClick}
        aria-label="Open settings"
        aria-haspopup="dialog"
      >
        ⚙
      </button>

      {showPin && (
        <div className="pin-overlay">
          <div
            className="pin-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Enter PIN"
          >
            <p className="pin-prompt">Enter PIN to access settings</p>
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ''))
                  setError(false)
                }}
                aria-label="PIN"
                aria-describedby={error ? 'pin-error' : undefined}
                autoComplete="off"
                className="pin-input"
              />
              {error && (
                <p id="pin-error" className="pin-error" role="alert">
                  Incorrect PIN. Please try again.
                </p>
              )}
              <div className="pin-actions">
                <button
                  type="submit"
                  className="pin-btn pin-btn--primary"
                  disabled={pin.length === 0}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="pin-btn pin-btn--secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
