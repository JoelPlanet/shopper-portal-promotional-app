import type { LocaleCode } from '@/config/languages'

type DisplayAnalyticsEventName =
  | 'temporary_language_picker_opened'
  | 'temporary_language_selected'

type DisplayAnalyticsPayload = {
  locale?: LocaleCode
}

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export function trackDisplayAnalyticsEvent(
  eventName: DisplayAnalyticsEventName,
  payload: DisplayAnalyticsPayload = {},
) {
  const detail = {
    eventName,
    ...payload,
  }

  window.dispatchEvent(new CustomEvent('shopper-portal-display-analytics', { detail }))
  window.dataLayer?.push({ event: eventName, ...payload })
}