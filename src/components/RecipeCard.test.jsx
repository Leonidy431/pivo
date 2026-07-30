import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RecipeCard from './RecipeCard'

const recipe = {
  id: 1,
  name: 'Классическое лопуховое',
  base_botanical: 'Одуванчик',
  origin_region: 'Appalachia',
  gout_safe: true,
  diabetes_safe: true,
  category: 'root_elixir',
  rating: 4.5,
}

describe('RecipeCard', () => {
  it('renders recipe name, botanical, origin, category and rating', () => {
    render(<RecipeCard recipe={recipe} isFavorite={false} onToggleFavorite={vi.fn()} />)

    expect(screen.getByText('Классическое лопуховое')).toBeInTheDocument()
    expect(screen.getByText(/Одуванчик/)).toBeInTheDocument()
    expect(screen.getByText(/Appalachia/)).toBeInTheDocument()
    expect(screen.getByText('root_elixir')).toBeInTheDocument()
    expect(screen.getByText(/4.5/)).toBeInTheDocument()
  })

  it('shows safety badges when gout_safe and diabetes_safe are true', () => {
    render(<RecipeCard recipe={recipe} isFavorite={false} onToggleFavorite={vi.fn()} />)

    expect(screen.getByText('Подагра✓')).toBeInTheDocument()
    expect(screen.getByText('Диабет✓')).toBeInTheDocument()
  })

  it('hides safety badges when gout_safe and diabetes_safe are false', () => {
    render(
      <RecipeCard
        recipe={{ ...recipe, gout_safe: false, diabetes_safe: false }}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
      />
    )

    expect(screen.queryByText('Подагра✓')).not.toBeInTheDocument()
    expect(screen.queryByText('Диабет✓')).not.toBeInTheDocument()
  })

  it('shows filled heart and active class when favorite', () => {
    render(<RecipeCard recipe={recipe} isFavorite={true} onToggleFavorite={vi.fn()} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('❤️')
    expect(button).toHaveClass('active')
    expect(button).toHaveAttribute('title', 'Удалить из избранного')
  })

  it('shows empty heart and no active class when not favorite', () => {
    render(<RecipeCard recipe={recipe} isFavorite={false} onToggleFavorite={vi.fn()} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('🤍')
    expect(button).not.toHaveClass('active')
    expect(button).toHaveAttribute('title', 'Добавить в избранное')
  })

  it('calls onToggleFavorite and prevents default when button clicked', () => {
    const onToggleFavorite = vi.fn()
    render(<RecipeCard recipe={recipe} isFavorite={false} onToggleFavorite={onToggleFavorite} />)

    fireEvent.click(screen.getByRole('button'))

    expect(onToggleFavorite).toHaveBeenCalledTimes(1)
  })
})
