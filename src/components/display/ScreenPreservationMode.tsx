import i18n from '@/i18n'
import type { LocaleCode } from '@/config/languages'
import './ScreenPreservationMode.css'

interface Props {
  isActive: boolean
  isPeriodic?: boolean
  locale?: LocaleCode
}

export function ScreenPreservationMode({ isActive, isPeriodic = false, locale = 'en' }: Props) {
  const preservationText = i18n.getFixedT(locale)('screenPreservationText')

  return (
    <div
      className={`screen-preservation${isActive ? ' screen-preservation--active' : ''}${isPeriodic ? ' screen-preservation--periodic' : ''}`}
      aria-hidden={!isActive}
    >
      <div className="screen-preservation__content">
        <img
          className="screen-preservation__logo"
          src="/assets/tax-free-from-planet.svg"
          alt="Tax Free from Planet"
        />
        <p
          className={`screen-preservation__message${locale === 'ar' ? ' screen-preservation__message--rtl' : ''}`}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          {preservationText}
        </p>
      </div>
    </div>
  )
}