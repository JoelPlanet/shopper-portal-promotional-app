// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/config/env', () => ({ ENV: { pinHash: 'test-hash' } }))

import { PinGate } from './PinGate'

describe('PinGate', () => {
  afterEach(cleanup)

  it('closes on backdrop click but stays open when the dialog is clicked', () => {
    render(<PinGate onUnlock={vi.fn()} />)

    const settingsButton = screen.getByRole('button', { name: 'Open settings' })
    for (let tap = 0; tap < 5; tap += 1) {
      fireEvent.click(settingsButton)
    }

    const dialog = screen.getByRole('dialog', { name: 'Enter PIN' })
    fireEvent.click(dialog)
    expect(screen.getByRole('dialog', { name: 'Enter PIN' })).toBeTruthy()

    fireEvent.click(dialog.parentElement!)
    expect(screen.queryByRole('dialog', { name: 'Enter PIN' })).toBeNull()
  })
})