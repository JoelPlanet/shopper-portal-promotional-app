// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { useLocation, MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { SettingsView } from './SettingsView'

function DisplayRouteState() {
  const location = useLocation()
  const state = location.state as { showInitialPreservation?: boolean } | null
  return <p>Replay preservation: {String(state?.showInitialPreservation)}</p>
}

describe('SettingsView', () => {
  beforeEach(() => {
    localStorage.setItem('ndsk:config', JSON.stringify({
      selectedLocales: ['en'],
      rotationIntervalSeconds: 30,
    }))
  })

  it('restores defaults and requests the startup preservation screen', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/" element={<DisplayRouteState />} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Restore defaults' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm reset?' }))

    expect(localStorage.getItem('ndsk:config')).toBeNull()
    expect(screen.getByText('Replay preservation: true')).toBeTruthy()
  })
})