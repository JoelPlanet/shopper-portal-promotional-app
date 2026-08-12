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
    const { container } = render(<ScreenPreservationMode isActive={false} />)

    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
  })
})