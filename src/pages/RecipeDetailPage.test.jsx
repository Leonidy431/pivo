import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import RecipeDetailPage from './RecipeDetailPage'

vi.mock('axios')

const baseRecipe = {
  id: 1,
  name: 'Классическое лопуховое',
  origin_region: 'США',
  category: 'root_elixir',
  difficulty_level: 'easy',
  gout_safe: true,
  diabetes_safe: true,
  purine_level: 'none',
  description: 'Терапевтический напиток.',
  base_botanical: 'Лопух',
  ingredients: JSON.stringify([{ name: 'Корень лопуха', amount: 2, unit: 'ст.л.' }]),
  preparation_instructions: 'Вскипятить.\nОстудить.',
  preparation_time_minutes: 30,
  servings: 2,
  extraction_method: 'decoction',
  carbonation_method: 'forced_siphon',
  therapeutic_focus: 'gout_prevention',
  anti_inflammatory_compounds: JSON.stringify(['curcumin', 'gingerol']),
  sugar_content_g: 0,
  caffeine_mg: 0,
  alcohol_percent: 0,
  bitterness_level: 5,
  cost_level: 'budget',
}

function renderPage({ isFavorite = () => false, toggleFavorite = vi.fn() } = {}) {
  return render(
    <MemoryRouter initialEntries={['/recipes/1']}>
      <Routes>
        <Route
          path="/recipes/:id"
          element={
            <RecipeDetailPage isFavorite={isFavorite} toggleFavorite={toggleFavorite} />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('RecipeDetailPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows a loading state before the fetch resolves', () => {
    axios.get.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText('Загрузка рецепта...')).toBeInTheDocument()
  })

  it('renders full recipe detail on success', async () => {
    axios.get.mockResolvedValueOnce({ data: baseRecipe })

    renderPage()

    await waitFor(() =>
      expect(screen.getByText('Классическое лопуховое')).toBeInTheDocument()
    )
    expect(screen.getByText('✓ Безопасно при подагре')).toBeInTheDocument()
    expect(screen.getByText('✓ Безопасно при диабете')).toBeInTheDocument()
    expect(screen.getByText('Корень лопуха', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('curcumin, gingerol')).toBeInTheDocument()
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/herbal/recipes/1')
    )
  })

  it('shows a not-found message when the API returns no recipe', async () => {
    axios.get.mockResolvedValueOnce({ data: null })

    renderPage()

    await waitFor(() =>
      expect(screen.getByText('Рецепт не найден')).toBeInTheDocument()
    )
  })

  it('shows an error message when the fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('not found'))

    renderPage()

    await waitFor(() =>
      expect(screen.getByText('Рецепт не найден')).toBeInTheDocument()
    )
  })

  it('hides safety badges when unsafe', async () => {
    axios.get.mockResolvedValueOnce({
      data: { ...baseRecipe, gout_safe: false, diabetes_safe: false },
    })

    renderPage()

    await waitFor(() =>
      expect(screen.getByText('Классическое лопуховое')).toBeInTheDocument()
    )
    expect(screen.queryByText('✓ Безопасно при подагре')).not.toBeInTheDocument()
    expect(screen.queryByText('✓ Безопасно при диабете')).not.toBeInTheDocument()
  })

  it('renders a plain-string ingredients/compounds fallback', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        ...baseRecipe,
        ingredients: 'просто строка',
        anti_inflammatory_compounds: 'куркумин',
      },
    })

    renderPage()

    await waitFor(() =>
      expect(screen.getByText('просто строка')).toBeInTheDocument()
    )
    expect(screen.getByText('куркумин')).toBeInTheDocument()
  })

  it('accepts ingredients/compounds already given as arrays', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        ...baseRecipe,
        ingredients: [{ name: 'Имбирь', amount: 1, unit: 'ст.л.' }],
        anti_inflammatory_compounds: ['gingerol'],
      },
    })

    renderPage()

    await waitFor(() =>
      expect(screen.getByText('Имбирь', { exact: false })).toBeInTheDocument()
    )
    expect(screen.getByText('gingerol')).toBeInTheDocument()
  })

  it('toggles favorite state when the favorite button is clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: baseRecipe })
    const toggleFavorite = vi.fn()
    const user = userEvent.setup()

    renderPage({ isFavorite: () => false, toggleFavorite })
    await waitFor(() =>
      expect(screen.getByText('🤍 Добавить в избранное')).toBeInTheDocument()
    )

    await user.click(screen.getByText('🤍 Добавить в избранное'))

    expect(toggleFavorite).toHaveBeenCalledWith(baseRecipe)
  })

  it('shows the active favorite label when already a favorite', async () => {
    axios.get.mockResolvedValueOnce({ data: baseRecipe })

    renderPage({ isFavorite: () => true })

    await waitFor(() =>
      expect(screen.getByText('❤️ В избранном')).toBeInTheDocument()
    )
  })

  it('loads and displays shop availability when "Где купить" is clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: baseRecipe })
    axios.get.mockResolvedValueOnce({
      data: {
        shops: [
          {
            shop_id: 1,
            shop_name: 'Herbal Roots Market',
            address: '123 Main St',
            city: 'Portland',
            phone: '+1-555-0100',
            price: 500,
            distance_km: 2.5,
            special_offer_price: 400,
            preparation_available: true,
          },
        ],
      },
    })
    const user = userEvent.setup()

    renderPage()
    await waitFor(() =>
      expect(screen.getByText('Классическое лопуховое')).toBeInTheDocument()
    )

    await user.click(screen.getByText('🏪 Где купить'))

    await waitFor(() =>
      expect(screen.getByText('Herbal Roots Market')).toBeInTheDocument()
    )
    expect(screen.getByText(/2.5км от вас/)).toBeInTheDocument()
    expect(screen.getByText(/400₽/)).toBeInTheDocument()
    expect(screen.getByText('✓ Доступна подготовка на месте')).toBeInTheDocument()
  })

  it('shows an error message when loading shop availability fails', async () => {
    axios.get.mockResolvedValueOnce({ data: baseRecipe })
    axios.get.mockRejectedValueOnce(new Error('boom'))
    const user = userEvent.setup()

    renderPage()
    await waitFor(() =>
      expect(screen.getByText('Классическое лопуховое')).toBeInTheDocument()
    )

    await user.click(screen.getByText('🏪 Где купить'))

    await waitFor(() =>
      expect(screen.getByText('Ошибка при загрузке магазинов')).toBeInTheDocument()
    )
  })

  it('navigates back when the back button is clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: baseRecipe })
    const user = userEvent.setup()

    renderPage()
    await waitFor(() =>
      expect(screen.getByText('Классическое лопуховое')).toBeInTheDocument()
    )

    // Smoke-tests the navigate(-1) wiring; MemoryRouter has nowhere to
    // go back to from the initial entry, so it just must not throw.
    await user.click(screen.getByText('← Назад'))
  })
})
