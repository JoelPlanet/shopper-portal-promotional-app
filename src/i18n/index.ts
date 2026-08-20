import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'
import ar from './locales/ar.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import pt from './locales/pt.json'
import it from './locales/it.json'

i18n.use(initReactI18next).init({
  resources: {
    en:    { translation: en },
    'zh-CN': { translation: zhCN },
    ar:    { translation: ar },
    fr:    { translation: fr },
    es:    { translation: es },
    pt:    { translation: pt },
    it:    { translation: it },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
