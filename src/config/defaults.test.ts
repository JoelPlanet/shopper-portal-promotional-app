import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIGURATION } from './defaults'
import { LANGUAGE_CATALOGUE } from './languages'

describe('DEFAULT_CONFIGURATION', () => {
  it('enables every language with a 15-second rotation interval', () => {
    expect(DEFAULT_CONFIGURATION).toEqual({
      selectedLocales: LANGUAGE_CATALOGUE.map(({ code }) => code),
      rotationIntervalSeconds: 15,
    })
  })
})