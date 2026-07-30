import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import App from './App'

vi.mock('axios')

function renderAt(path) {
  window.history.pushState({}, '', path)
  return render(<App />)
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
    axios.get.mockResolvedValue({ data: { recipes: [] } })
  })

  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('renders the recipes page at "/" by default', async () => {
    renderAt('/')

    expect(screen.getByPlaceholderText('Поиск рецепта...')).toBeInTheDocument()
    await waitFor(() => expect(axios.get).toHaveBeenCalled())
  })

  it('renders the shops page at "/shops"', () => {
    renderAt('/shops')
    expect(screen.getByPlaceholderText('Поиск магазина...')).toBeInTheDocument()
  })

  it('renders the favorites page at "/favorites"', () => {
    renderAt('/favorites')
    expect(screen.getByText('❤️ Избранные рецепты')).toBeInTheDocument()
  })

  it('renders the profile page at "/profile"', () => {
    renderAt('/profile')
    expect(screen.getByRole('heading', { name: 'Пользователь' })).toBeInTheDocument()
  })

  it('renders the KosmoScout page at "/kosmoscout"', () => {
    renderAt('/kosmoscout')
    expect(screen.getByRole('heading', { name: /🚀 KosmoScout/ })).toBeInTheDocument()
  })

  it('navigates between tabs via the footer', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await user.click(screen.getByTitle('Магазины'))
    expect(screen.getByPlaceholderText('Поиск магазина...')).toBeInTheDocument()

    await user.click(screen.getByTitle('Профиль'))
    expect(screen.getByRole('heading', { name: 'Пользователь' })).toBeInTheDocument()
  })

  it('loads favorites from localStorage on mount', () => {
    const savedRecipe = {
      id: 1,
      name: 'Классическое лопуховое',
      base_botanical: 'Лопух',
      origin_region: 'США',
      gout_safe: true,
      diabetes_safe: true,
      category: 'root_elixir',
      rating: 4.5,
    }
    localStorage.setItem('favorites', JSON.stringify([savedRecipe]))

    renderAt('/favorites')

    expect(screen.getByText('Классическое лопуховое')).toBeInTheDocument()
  })

  it('adding and removing a favorite persists to localStorage', async () => {
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
    axios.get.mockResolvedValueOnce({ data: { recipes: [recipe] } })
    const user = userEvent.setup()

    renderAt('/')
    await waitFor(() =>
      expect(screen.getByText('Классическое лопуховое')).toBeInTheDocument()
    )

    await user.click(screen.getByRole('button', { name: /🤍/ }))

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('favorites'))
      expect(saved).toEqual([recipe])
    })

    // Toggling again removes it.
    await user.click(screen.getByRole('button', { name: /❤️/ }))
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('favorites'))
      expect(saved).toEqual([])
    })
  })

  it('requests geolocation and updates location on success', async () => {
    const getCurrentPosition = vi.fn((success) =>
      success({ coords: { latitude: 45.5, longitude: -122.6 } })
    )
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
    axios.get.mockResolvedValue({ data: { shops: [] } })
    const user = userEvent.setup()

    renderAt('/shops')
    await user.click(screen.getByRole('button', { name: /Рядом со мной/ }))

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/shops/near?'))
    )

    vi.unstubAllGlobals()
  })

  it('logs an error when geolocation fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const getCurrentPosition = vi.fn((_success, error) => error(new Error('denied')))
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
    const user = userEvent.setup()

    renderAt('/shops')
    await user.click(screen.getByRole('button', { name: /Рядом со мной/ }))

    expect(consoleError).toHaveBeenCalledWith(
      'Geolocation error:',
      expect.any(Error)
    )

    consoleError.mockRestore()
    vi.unstubAllGlobals()
  })

  it('does nothing when geolocation is unavailable', async () => {
    vi.stubGlobal('navigator', {})
    const user = userEvent.setup()

    renderAt('/shops')
    // Must not throw when navigator.geolocation is undefined.
    await user.click(screen.getByRole('button', { name: /Рядом со мной/ }))

    vi.unstubAllGlobals()
  })
})
