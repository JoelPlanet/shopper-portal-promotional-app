// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { LocaleCode } from '@/config/languages'
import { useScreenPreservationLocale } from './useScreenPreservationLocale'

describe('useScreenPreservationLocale', () => {
  it('advances through selected languages once for each preservation activation', () => {
    const selectedLocales: LocaleCode[] = ['en', 'fr']
    const { result, rerender } = renderHook(
      ({ isActive }) => useScreenPreservationLocale({ selectedLocales, isActive }),
      { initialProps: { isActive: false } },
    )

    rerender({ isActive: true })
    expect(result.current).toBe('en')

    rerender({ isActive: false })
    rerender({ isActive: true })
    expect(result.current).toBe('fr')

    rerender({ isActive: false })
    rerender({ isActive: true })
    expect(result.current).toBe('en')
  })
})