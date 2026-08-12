import type { DisplayConfiguration } from './languages'
import { LANGUAGE_CATALOGUE } from './languages'

export const DEFAULT_CONFIGURATION: DisplayConfiguration = {
  selectedLocales: LANGUAGE_CATALOGUE.map(({ code }) => code),
  rotationIntervalSeconds: 15,
}
