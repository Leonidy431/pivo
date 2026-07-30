import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FavoritesPage from './FavoritesPage'

const recipe = {
  id: 1,
  name: 'Классическое лопуховое',
  base_botanical: 'Лопух',
  origin_region: 'США',
  gout_safe: true,
  diabetes_safe: true,
  category: 'root_elixir',
  rating: 4.5,
}

function renderPage(props) {
  return render(
    <MemoryRouter>
      <FavoritesPage {...props} />
    </MemoryRouter>
  )
}

describe('FavoritesPage', () => {
  it('shows the empty state with a link back to recipes', () => {
    renderPage({ favorites: [], toggleFavorite: vi.fn() })

    expect(screen.getByText('У вас нет избранных рецептов')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Перейти к рецептам' })).toHaveAttribute(
      'href',
      '/'
    )
  })

  it('renders a card for each favorite recipe', () => {
    renderPage({ favorites: [recipe], toggleFavorite: vi.fn() })

    expect(screen.getByText('Классическое лопуховое')).toBeInTheDocument()
    expect(
      screen.queryByText('У вас нет избранных рецептов')
    ).not.toBeInTheDocument()
  })

  it('calls toggleFavorite with the recipe when its heart button is clicked', () => {
    const toggleFavorite = vi.fn()
    renderPage({ favorites: [recipe], toggleFavorite })

    fireEvent.click(screen.getByRole('button'))

    expect(toggleFavorite).toHaveBeenCalledWith(recipe)
  })
})
