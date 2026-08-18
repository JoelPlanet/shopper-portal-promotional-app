// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScreenPreservationMode } from './ScreenPreservationMode'

describe('ScreenPreservationMode', () => {
  it('shows the supplied logo in the active full-screen overlay', () => {
    const { container } = render(<ScreenPreservationMode isActive />)

    expect(container.firstElementChild?.classList).toContain('screen-preservation--active')
    expect(screen.getByAltText('Tax Free from Planet').getAttribute('src')).toBe(
      '/assets/tax-free-from-planet.svg',
    )
  })

  it('is hidden from assistive technology when inactive', () => {
    const { container } = render(<ScreenPreservationMode isActive={false} locale="en" />)

    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
  })

  it('shows the supplied locale message beneath the logo', () => {
    render(<ScreenPreservationMode isActive locale="fr" />)

    expect(screen.getByText('Obtenez votre remboursement de détaxe ici')).toBeTruthy()
  })

  it('marks the Arabic message for a right-to-left wipe', () => {
    render(<ScreenPreservationMode isActive locale="ar" />)

    expect(screen.getByText('احصل على استرداد الضريبة هنا').classList).toContain(
      'screen-preservation__message--rtl',
    )
  })
})