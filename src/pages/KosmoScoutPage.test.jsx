import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import KosmoScoutPage from './KosmoScoutPage'

describe('KosmoScoutPage', () => {
  it('shows a loading state then the placeholder project list', async () => {
    render(<KosmoScoutPage />)

    await waitFor(() =>
      expect(screen.getByText('KosmoScout Explorer')).toBeInTheDocument()
    )
    expect(screen.getByText('Orbital Mechanics')).toBeInTheDocument()
    expect(screen.getByText('Satellite Tracking')).toBeInTheDocument()
    expect(screen.getByText(/2500/)).toBeInTheDocument()
  })

  it('renders the page header', async () => {
    render(<KosmoScoutPage />)

    expect(screen.getByRole('heading', { name: /🚀 KosmoScout/ })).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByText('KosmoScout Explorer')).toBeInTheDocument()
    )
  })
})
