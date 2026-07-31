import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from './Footer'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Footer />
    </MemoryRouter>
  )
}

describe('Footer', () => {
  it('renders all five navigation links', () => {
    renderAt('/')

    expect(screen.getByText('Рецепты')).toBeInTheDocument()
    expect(screen.getByText('Магазины')).toBeInTheDocument()
    expect(screen.getByText('Избранное')).toBeInTheDocument()
    expect(screen.getByText('Профиль')).toBeInTheDocument()
    expect(screen.getByText('KosmoScout')).toBeInTheDocument()
  })

  it('marks the recipes tab active at "/"', () => {
    renderAt('/')
    expect(screen.getByTitle('Рецепты')).toHaveClass('active')
    expect(screen.getByTitle('Магазины')).not.toHaveClass('active')
  })

  it('marks the shops tab active at "/shops"', () => {
    renderAt('/shops')
    expect(screen.getByTitle('Магазины')).toHaveClass('active')
    expect(screen.getByTitle('Рецепты')).not.toHaveClass('active')
  })

  it('marks the favorites tab active at "/favorites"', () => {
    renderAt('/favorites')
    expect(screen.getByTitle('Избранное')).toHaveClass('active')
  })

  it('marks the profile tab active at "/profile"', () => {
    renderAt('/profile')
    expect(screen.getByTitle('Профиль')).toHaveClass('active')
  })

  it('marks the KosmoScout tab active at "/kosmoscout"', () => {
    renderAt('/kosmoscout')
    expect(screen.getByTitle('KosmoScout')).toHaveClass('active')
  })

  it('marks no tab active on an unrelated route', () => {
    renderAt('/recipes/42')
    expect(screen.getByTitle('Рецепты')).not.toHaveClass('active')
    expect(screen.getByTitle('Магазины')).not.toHaveClass('active')
    expect(screen.getByTitle('Избранное')).not.toHaveClass('active')
    expect(screen.getByTitle('Профиль')).not.toHaveClass('active')
    expect(screen.getByTitle('KosmoScout')).not.toHaveClass('active')
  })
})
