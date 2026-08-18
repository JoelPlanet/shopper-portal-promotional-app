// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_CONFIGURATION } from '@/config/defaults'
import { useConfiguration } from './useConfiguration'

describe('useConfiguration', () => {
  beforeEach(() => localStorage.clear())

  it('migrates existing saved settings to the five-minute trigger default', () => {
    localStorage.setItem('ndsk:config', JSON.stringify({
      selectedLocales: ['en'],
      rotationIntervalSeconds: 15,
    }))

    const { result } = renderHook(useConfiguration)

    expect(result.current.config.screenPreservationTrigger).toEqual({
      type: 'minutes',
      value: 5,
    })
    expect(result.current.config.screenPreservationDurationSeconds).toBe(15)
  })

  it('persists a valid cycle trigger and rejects an invalid value', () => {
    const { result } = renderHook(useConfiguration)
    const next = {
      ...DEFAULT_CONFIGURATION,
      screenPreservationTrigger: { type: 'cycles' as const, value: 3 },
    }

    act(() => result.current.save(next))
    expect(JSON.parse(localStorage.getItem('ndsk:config') ?? '{}')).toMatchObject(next)

    act(() => result.current.save({
      ...next,
      screenPreservationTrigger: { type: 'cycles', value: 1.5 },
    }))
    expect(result.current.config.screenPreservationTrigger).toEqual({
      type: 'cycles',
      value: 3,
    })
  })

  it('persists a duration from 5 to 30 seconds and rejects values outside that range', () => {
    const { result } = renderHook(useConfiguration)
    const next = {
      ...DEFAULT_CONFIGURATION,
      screenPreservationDurationSeconds: 30,
    }

    act(() => result.current.save(next))
    expect(result.current.config.screenPreservationDurationSeconds).toBe(30)

    act(() => result.current.save({
      ...next,
      screenPreservationDurationSeconds: 35,
    }))
    expect(result.current.config.screenPreservationDurationSeconds).toBe(30)
  })
})