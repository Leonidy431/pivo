import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import ShopsPage from './ShopsPage'

vi.mock('axios')

const shops = [
  {
    id: 1,
    name: 'Herbal Roots Market',
    address: '123 Main St',
    city: 'Portland',
    country: 'USA',
  },
]

function renderPage(props = {}) {
  return render(
    <ShopsPage userLocation={null} getUserLocation={vi.fn()} {...props} />
  )
}

describe('ShopsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows the initial empty state without fetching', () => {
    renderPage()
    expect(screen.getByText('Магазины не найдены')).toBeInTheDocument()
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('searches shops and displays results on success', async () => {
    axios.get.mockResolvedValueOnce({ data: shops })
    const user = userEvent.setup()

    renderPage()
    await user.type(screen.getByPlaceholderText('Поиск магазина...'), 'root')
    await user.click(screen.getByRole('button', { name: '🔍' }))

    await waitFor(() =>
      expect(screen.getByText('Herbal Roots Market')).toBeInTheDocument()
    )
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/herbal/shops/search?q=')
    )
  })

  it('shows a search error message on failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('boom'))
    const user = userEvent.setup()

    renderPage()
    await user.type(screen.getByPlaceholderText('Поиск магазина...'), 'root')
    await user.click(screen.getByRole('button', { name: '🔍' }))

    await waitFor(() =>
      expect(screen.getByText('Ошибка при поиске')).toBeInTheDocument()
    )
  })

  it('clearing the search box clears the shop list', async () => {
    axios.get.mockResolvedValueOnce({ data: shops })
    const user = userEvent.setup()

    renderPage()
    const input = screen.getByPlaceholderText('Поиск магазина...')
    await user.type(input, 'root')
    await user.click(screen.getByRole('button', { name: '🔍' }))
    await waitFor(() =>
      expect(screen.getByText('Herbal Roots Market')).toBeInTheDocument()
    )

    await user.clear(input)

    await waitFor(() =>
      expect(screen.getByText('Магазины не найдены')).toBeInTheDocument()
    )
  })

  it('searches by city on button click and shows results', async () => {
    axios.get.mockResolvedValueOnce({ data: { shops } })
    const user = userEvent.setup()

    renderPage()
    await user.type(screen.getByPlaceholderText('Введите город'), 'Portland')
    await user.click(screen.getByRole('button', { name: 'Найти' }))

    await waitFor(() =>
      expect(screen.getByText('Herbal Roots Market')).toBeInTheDocument()
    )
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/herbal/shops/city/Portland')
    )
  })

  it('does not search by city when the input is blank', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Найти' }))

    expect(axios.get).not.toHaveBeenCalled()
  })

  it('searches by city on Enter key press', async () => {
    axios.get.mockResolvedValueOnce({ data: { shops } })
    const user = userEvent.setup()

    renderPage()
    await user.type(screen.getByPlaceholderText('Введите город'), 'Portland{Enter}')

    await waitFor(() =>
      expect(screen.getByText('Herbal Roots Market')).toBeInTheDocument()
    )
  })

  it('shows a "city not found" message when the city search fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('nope'))
    const user = userEvent.setup()

    renderPage()
    await user.type(screen.getByPlaceholderText('Введите город'), 'Nowhere')
    await user.click(screen.getByRole('button', { name: 'Найти' }))

    await waitFor(() =>
      expect(screen.getByText('Город не найден')).toBeInTheDocument()
    )
  })

  it('requests geolocation when "nearby" is clicked without a location yet', async () => {
    const getUserLocation = vi.fn()
    const user = userEvent.setup()

    renderPage({ getUserLocation })
    await user.click(screen.getByRole('button', { name: /Рядом со мной/ }))

    expect(getUserLocation).toHaveBeenCalledTimes(1)
  })

  it('fetches nearby shops once a location is available and nearby mode is active', async () => {
    axios.get.mockResolvedValueOnce({ data: { shops } })
    const user = userEvent.setup()

    const { rerender } = render(
      <ShopsPage userLocation={null} getUserLocation={vi.fn()} />
    )
    await user.click(screen.getByRole('button', { name: /Рядом со мной/ }))

    rerender(
      <ShopsPage
        userLocation={{ latitude: 45.5, longitude: -122.6 }}
        getUserLocation={vi.fn()}
      />
    )

    await waitFor(() =>
      expect(screen.getByText('Herbal Roots Market')).toBeInTheDocument()
    )
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/herbal/shops/near?latitude=45.5&longitude=-122.6')
    )
    expect(screen.getByRole('button', { name: /Рядом со мной/ })).toHaveClass('active')
  })

  it('shows an error message when the nearby fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('boom'))

    render(
      <ShopsPage
        userLocation={{ latitude: 45.5, longitude: -122.6 }}
        getUserLocation={vi.fn()}
      />
    )
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Рядом со мной/ }))

    await waitFor(() =>
      expect(screen.getByText('Ошибка при загрузке магазинов')).toBeInTheDocument()
    )
  })

  it('shows the distance-aware shop list when nearby mode is active', async () => {
    const shopsWithDistance = [{ ...shops[0], distance_km: 2.1 }]
    axios.get.mockResolvedValueOnce({ data: { shops: shopsWithDistance } })

    render(
      <ShopsPage
        userLocation={{ latitude: 45.5, longitude: -122.6 }}
        getUserLocation={vi.fn()}
      />
    )
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Рядом со мной/ }))

    await waitFor(() => expect(screen.getByText(/2.1 км/)).toBeInTheDocument())
  })
})
