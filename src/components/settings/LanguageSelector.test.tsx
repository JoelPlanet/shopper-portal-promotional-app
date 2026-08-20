// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LanguageSelector } from './LanguageSelector'

describe('LanguageSelector', () => {
  afterEach(cleanup)

  it('shows Italian as an active language option and toggles it like other locales', () => {
    const onChange = vi.fn()

    render(<LanguageSelector selectedLocales={['en']} onChange={onChange} />)

    const italianOption = screen.getByRole('checkbox', { name: 'Italiano' })
    expect(italianOption.getAttribute('aria-checked')).toBe('false')

    fireEvent.click(italianOption)

    expect(onChange).toHaveBeenCalledWith(['en', 'it'])
  })
})