import { useEffect, useRef, useState } from 'react'
import type { LocaleCode } from '@/config/languages'
import { LANGUAGE_CATALOGUE } from '@/config/languages'
import { trackDisplayAnalyticsEvent } from '@/analytics/displayAnalytics'

interface Props {
  activeLocale: LocaleCode
  onSelect: (locale: LocaleCode) => void
}

export function TemporaryLanguageSelector({ activeLocale, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const firstOptionRef = useRef<HTMLButtonElement>(null)

  const openPicker = () => {
    setIsOpen(true)
    trackDisplayAnalyticsEvent('temporary_language_picker_opened')
  }

  const closePicker = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const selectLocale = (locale: LocaleCode) => {
    trackDisplayAnalyticsEvent('temporary_language_selected', { locale })
    onSelect(locale)
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) return
    firstOptionRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePicker()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <div className="temporary-language">
      <button
        ref={triggerRef}
        type="button"
        className="temporary-language__trigger"
        aria-label="Choose display language"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={openPicker}
      >
        <svg
          className="temporary-language__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          <path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.1 2.5 3.2 5.5 3.2 9s-1.1 6.5-3.2 9M12 3c-2.1 2.5-3.2 5.5-3.2 9s1.1 6.5 3.2 9" />
        </svg>
      </button>

      {isOpen && (
        <section
          className="temporary-language__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="temporary-language-title"
        >
          <div className="temporary-language__header">
            <h2 id="temporary-language-title">Choose language</h2>
            <button
              type="button"
              className="temporary-language__close"
              aria-label="Close language picker"
              onClick={closePicker}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div className="temporary-language__options">
            {LANGUAGE_CATALOGUE.map(({ code, label, direction }, index) => (
              <button
                ref={index === 0 ? firstOptionRef : undefined}
                key={code}
                type="button"
                className={`temporary-language__option${activeLocale === code ? ' temporary-language__option--active' : ''}`}
                aria-pressed={activeLocale === code}
                dir={direction}
                onClick={() => selectLocale(code)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}