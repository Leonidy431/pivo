import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('renders default placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} />)
    expect(screen.getByPlaceholderText('Поиск рецепта...')).toBeInTheDocument()
  })

  it('renders custom placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} placeholder="Поиск магазина..." />)
    expect(screen.getByPlaceholderText('Поиск магазина...')).toBeInTheDocument()
  })

  it('calls onSearch with query on submit', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('Поиск рецепта...')
    fireEvent.change(input, { target: { value: 'ginger' } })
    fireEvent.submit(input.closest('form'))

    expect(onSearch).toHaveBeenCalledWith('ginger')
  })

  it('calls onSearch with empty string as soon as input is cleared', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('Поиск рецепта...')
    fireEvent.change(input, { target: { value: 'ginger' } })
    fireEvent.change(input, { target: { value: '' } })

    expect(onSearch).toHaveBeenLastCalledWith('')
  })

  it('does not call onSearch while typing non-empty text', () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('Поиск рецепта...')
    fireEvent.change(input, { target: { value: 'g' } })

    expect(onSearch).not.toHaveBeenCalled()
  })
})
