export type LocaleCode = 'en' | 'zh-CN' | 'ar' | 'fr' | 'es' | 'pt' | 'it'

export interface ScreenPreservationTrigger {
  type: 'cycles' | 'minutes'
  value: number
}

export interface DisplayConfiguration {
  selectedLocales: LocaleCode[]
  rotationIntervalSeconds: number
  screenPreservationTrigger: ScreenPreservationTrigger
  screenPreservationDurationSeconds: number
}

export interface LanguageCatalogueEntry {
  code: LocaleCode
  label: string
  direction: 'ltr' | 'rtl'
}

export const LANGUAGE_CATALOGUE: LanguageCatalogueEntry[] = [
  { code: 'en',    label: 'English',    direction: 'ltr' },
  { code: 'zh-CN', label: '中文',        direction: 'ltr' },
  { code: 'ar',    label: 'العربية',    direction: 'rtl' },
  { code: 'fr',    label: 'Français',   direction: 'ltr' },
  { code: 'es',    label: 'Español',    direction: 'ltr' },
  { code: 'pt',    label: 'Português',  direction: 'ltr' },
  { code: 'it',    label: 'Italiano',   direction: 'ltr' },
]
