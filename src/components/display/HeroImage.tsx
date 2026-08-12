import { useTranslation } from 'react-i18next'

export function HeroImage() {
  const { t } = useTranslation()
  return (
    <img
      src="/assets/hero-image.png"
      alt={t('heroImageAltText')}
      className="hero-image"
    />
  )
}
