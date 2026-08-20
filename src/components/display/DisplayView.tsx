import type { LocaleCode } from '@/config/languages'
import { LanguageSlide } from './LanguageSlide'
import { HeroImage } from './HeroImage'
import { TemporaryLanguageSelector } from './TemporaryLanguageSelector'
import './DisplayView.css'

interface Props {
  activeLocale: LocaleCode
  onTemporaryLanguageSelect: (locale: LocaleCode) => void
}

export function DisplayView({ activeLocale, onTemporaryLanguageSelect }: Props) {
  return (
    <main className="display-view">
      {/* Planet logo — language-invariant, centred at top */}
      <header className="display-logo-section">
        <img
          src="/assets/planet-logo.svg"
          alt="Planet"
          className="planet-logo"
        />
      </header>

      {/* Localised headline above the hero image */}
      <LanguageSlide key={`${activeLocale}-headline`} locale={activeLocale} slot="headline" />

      {/* Hero image — language-invariant, contains QR code managed by Planet */}
      <div className="display-hero-section">
        <HeroImage />
      </div>

      {/* Localised supporting text below the hero image */}
      <LanguageSlide key={`${activeLocale}-subheading`} locale={activeLocale} slot="subheading" />

      <TemporaryLanguageSelector
        activeLocale={activeLocale}
        onSelect={onTemporaryLanguageSelect}
      />
    </main>
  )
}
