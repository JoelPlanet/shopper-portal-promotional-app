import { useEffect, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { LocaleCode } from '@/config/languages'
import { LANGUAGE_CATALOGUE } from '@/config/languages'
import './LanguageSlide.css'

interface Props {
  locale: LocaleCode
  /** Which content slot to render */
  slot: 'headline' | 'subheading'
}

const MAX_LINES = 3
const MIN_FONT_SIZE_PX = 1
const FONT_SIZE_STEP_PX = 0.5

export function LanguageSlide({ locale, slot }: Props) {
  const { t, i18n } = useTranslation()
  const textRef = useRef<HTMLHeadingElement | HTMLParagraphElement>(null)
  const text = t(slot)

  useEffect(() => {
    void i18n.changeLanguage(locale)
    const entry = LANGUAGE_CATALOGUE.find((l) => l.code === locale)
    document.documentElement.dir = entry?.direction ?? 'ltr'
    document.documentElement.lang = locale
  }, [locale, i18n])

  useLayoutEffect(() => {
    const element = textRef.current
    if (!element) return

    const fitText = () => {
      element.classList.remove('display-text--full-width')
      element.style.removeProperty('--fitted-font-size')

      const baseFontSize = Number.parseFloat(getComputedStyle(element).fontSize)
      const exceedsThreeLines = () => {
        const textRange = document.createRange()
        textRange.selectNodeContents(element)
        const lineTops = new Set(
          Array.from(textRange.getClientRects(), (rect) => Math.round(rect.top)),
        )
        return lineTops.size > MAX_LINES
      }

      if (!exceedsThreeLines()) return

      element.classList.add('display-text--full-width')
      if (!exceedsThreeLines()) return

      for (let fontSize = baseFontSize - FONT_SIZE_STEP_PX; fontSize >= MIN_FONT_SIZE_PX; fontSize -= FONT_SIZE_STEP_PX) {
        element.style.setProperty('--fitted-font-size', `${fontSize}px`)
        if (!exceedsThreeLines()) return
      }
    }

    fitText()
    const resizeObserver = new ResizeObserver(fitText)
    resizeObserver.observe(element.parentElement ?? element)
    void document.fonts.ready.then(fitText)

    return () => resizeObserver.disconnect()
  }, [text])

  if (slot === 'headline') {
    return <h1 ref={textRef} className="display-headline language-slide-in">{text}</h1>
  }
  return <p ref={textRef} className="display-subheading language-slide-in">{text}</p>
}
