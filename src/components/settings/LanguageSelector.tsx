import type { LocaleCode } from '@/config/languages'
import { LANGUAGE_CATALOGUE } from '@/config/languages'

interface Props {
  selectedLocales: LocaleCode[]
  onChange: (locales: LocaleCode[]) => void
}

export function LanguageSelector({ selectedLocales, onChange }: Props) {
  const toggle = (code: LocaleCode) => {
    if (selectedLocales.includes(code)) {
      // Prevent deselecting the last active language
      if (selectedLocales.length === 1) return
      onChange(selectedLocales.filter((l) => l !== code))
    } else {
      onChange([...selectedLocales, code])
    }
  }

  return (
    <fieldset className="language-selector">
      <legend className="settings-field-label">Display languages</legend>
      <div className="language-grid">
        {LANGUAGE_CATALOGUE.map(({ code, label }) => {
          const active = selectedLocales.includes(code)
          const isLast = active && selectedLocales.length === 1
          return (
            <button
              key={code}
              type="button"
              role="checkbox"
              aria-checked={active}
              aria-disabled={isLast || undefined}
              onClick={() => toggle(code)}
              className={`lang-btn${active ? ' lang-btn--active' : ''}${isLast ? ' lang-btn--locked' : ''}`}
              title={isLast ? 'At least one language must be active' : undefined}
            >
              {label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
