import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { LocaleCode } from '@/config/languages'
import { LANGUAGE_CATALOGUE } from '@/config/languages'
import './LanguageSlide.css'

interface Props {
  locale: LocaleCode
  /** Which content slot to render */
  slot: 'headline' | 'subheading'
}

export function LanguageSlide({ locale, slot }: Props) {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    void i18n.changeLanguage(locale)
    const entry = LANGUAGE_CATALOGUE.find((l) => l.code === locale)
    document.documentElement.dir = entry?.direction ?? 'ltr'
    document.documentElement.lang = locale
  }, [locale, i18n])

  if (slot === 'headline') {
    return <h1 className="display-headline language-slide-in">{t('headline')}</h1>
  }
  return <p className="display-subheading language-slide-in">{t('subheading')}</p>
}
