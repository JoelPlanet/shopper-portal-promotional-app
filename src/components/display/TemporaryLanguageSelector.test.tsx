// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LANGUAGE_CATALOGUE } from '@/config/languages'
import { TemporaryLanguageSelector } from './TemporaryLanguageSelector'

describe('TemporaryLanguageSelector', () => {
  afterEach(cleanup)

  it('opens the full language catalogue, selects a language, and emits analytics events', () => {
    const onSelect = vi.fn()
    const analyticsEvents: CustomEvent[] = []
    const handleAnalytics = (event: Event) => analyticsEvents.push(event as CustomEvent)
    window.addEventListener('shopper-portal-display-analytics', handleAnalytics)

    render(<TemporaryLanguageSelector activeLocale="en" onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button', { name: 'Choose display language' }))

    expect(screen.getByRole('dialog', { name: 'Choose language' })).toBeTruthy()
    for (const { label } of LANGUAGE_CATALOGUE) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy()
    }
    expect(analyticsEvents[0].detail).toEqual({
      eventName: 'temporary_language_picker_opened',
    })

    fireEvent.click(screen.getByRole('button', { name: 'Italiano' }))

    expect(onSelect).toHaveBeenCalledWith('it')
    expect(screen.queryByRole('dialog', { name: 'Choose language' })).toBeNull()
    expect(analyticsEvents[1].detail).toEqual({
      eventName: 'temporary_language_selected',
      locale: 'it',
    })

    window.removeEventListener('shopper-portal-display-analytics', handleAnalytics)
  })

  it('closes the picker from the keyboard', () => {
    render(<TemporaryLanguageSelector activeLocale="en" onSelect={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Choose display language' }))
    fireEvent.keyDown(window, { key: 'Escape' })

    expect(screen.queryByRole('dialog', { name: 'Choose language' })).toBeNull()
  })
})