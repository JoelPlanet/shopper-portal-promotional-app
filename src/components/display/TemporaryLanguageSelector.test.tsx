// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LANGUAGE_CATALOGUE } from '@/config/languages'
import { TemporaryLanguageSelector } from './TemporaryLanguageSelector'

describe('TemporaryLanguageSelector', () => {
  afterEach(cleanup)

  it('opens from the globe icon, selects from the full catalogue, and emits analytics events', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const analyticsEvents: CustomEvent[] = []
    const handleAnalytics = (event: Event) => analyticsEvents.push(event as CustomEvent)
    window.addEventListener('shopper-portal-display-analytics', handleAnalytics)

    render(<TemporaryLanguageSelector activeLocale="en" onSelect={onSelect} />)

    const trigger = screen.getByRole('button', { name: 'Choose display language' })
    await user.click(trigger.querySelector('svg path')!)

    expect(screen.getByRole('dialog', { name: 'Choose language' })).toBeTruthy()
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    for (const { label } of LANGUAGE_CATALOGUE) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy()
    }
    expect(analyticsEvents[0].detail).toEqual({
      eventName: 'temporary_language_picker_opened',
    })

    await user.click(screen.getByRole('button', { name: 'Italiano' }))

    expect(onSelect).toHaveBeenCalledWith('it')
    expect(screen.queryByRole('dialog', { name: 'Choose language' })).toBeNull()
    expect(document.activeElement).toBe(trigger)
    expect(analyticsEvents.map(({ detail }) => detail)).toEqual([
      { eventName: 'temporary_language_picker_opened' },
      { eventName: 'temporary_language_selected', locale: 'it' },
    ])

    window.removeEventListener('shopper-portal-display-analytics', handleAnalytics)
  })

  it('opens from the keyboard and restores focus on Escape', async () => {
    const user = userEvent.setup()
    render(<TemporaryLanguageSelector activeLocale="en" onSelect={vi.fn()} />)
    const trigger = screen.getByRole('button', { name: 'Choose display language' })

    await user.tab()
    expect(document.activeElement).toBe(trigger)
    await user.keyboard('{Enter}')
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'English' }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', { name: 'Choose language' })).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('closes on a second globe click and still dismisses on outside clicks after reopening', async () => {
    const user = userEvent.setup()
    render(
      <>
        <TemporaryLanguageSelector activeLocale="en" onSelect={vi.fn()} />
        <button type="button">Outside</button>
      </>,
    )

    const trigger = screen.getByRole('button', { name: 'Choose display language' })
    await user.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Choose language' })).toBeTruthy()

    await user.click(trigger)
    expect(screen.queryByRole('dialog', { name: 'Choose language' })).toBeNull()

    await user.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Choose language' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Outside' }))
    expect(screen.queryByRole('dialog', { name: 'Choose language' })).toBeNull()
  })
})