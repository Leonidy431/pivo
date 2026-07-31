import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import axios from 'axios'
import RecipesPage from './RecipesPage'

vi.mock('axios')

const recipes = [
  {
    id: 1,
    name: 'Классическое лопуховое',
    base_botanical: 'Лопух',
    origin_region: 'США',
    gout_safe: true,
    diabetes_safe: true,
    category: 'root_elixir',
    rating: 4.5,
  },
]

function renderPage(props = {}) {
  return render(
    <MemoryRouter>
      <RecipesPage
        favorites={[]}
        isFavorite={() => false}
        toggleFavorite={vi.fn()}
        {...props}
      />
    </MemoryRouter>
  )
}

describe('RecipesPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows the loading state, then the recipes grid on success', async () => {
    axios.get.mockResolvedValueOnce({ data: { recipes } })

    renderPage()

    expect(screen.getByText('Загрузка рецептов...')).toBeInTheDocument()

    await waitFor(() =>
      expect(screen.getByText('Классическое лопуховое')).toBeInTheDocument()
    )
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/herbal/recipes?')
    )
  })

  it('shows the empty state when no recipes are returned', async () => {
    axios.get.mockResolvedValueOnce({ data: { recipes: [] } })

    renderPage()

    await waitFor(() =>
      expect(screen.getByText('Рецепты не найдены')).toBeInTheDocument()
    )
  })

  it('shows an error message when the initial fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('network down'))

    renderPage()

    await waitFor(() =>
      expect(screen.getByText('Ошибка при загрузке рецептов')).toBeInTheDocument()
    )
  })

  it('refetches with the category filter when a category is selected', async () => {
    axios.get.mockResolvedValue({ data: { recipes } })
    const user = userEvent.setup()

    renderPage()
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))

    const [categorySelect] = screen.getAllByRole('combobox')
    await user.selectOptions(categorySelect, 'root_elixir')

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2))
    expect(axios.get).toHaveBeenLastCalledWith(
      expect.stringContaining('category=root_elixir')
    )
  })

  it('refetches with the therapeutic focus filter when selected', async () => {
    axios.get.mockResolvedValue({ data: { recipes } })
    const user = userEvent.setup()

    renderPage()
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))

    const [, focusSelect] = screen.getAllByRole('combobox')
    await user.selectOptions(focusSelect, 'gout_prevention')

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2))
    expect(axios.get).toHaveBeenLastCalledWith(
      expect.stringContaining('therapeutic_focus=gout_prevention')
    )
  })

  it('resets the category filter back to "all" when re-selected', async () => {
    axios.get.mockResolvedValue({ data: { recipes } })
    const user = userEvent.setup()

    renderPage()
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))

    const [categorySelect] = screen.getAllByRole('combobox')
    await user.selectOptions(categorySelect, 'root_elixir')
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2))

    await user.selectOptions(categorySelect, '')
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3))
    expect(axios.get).toHaveBeenLastCalledWith(
      expect.not.stringContaining('category=')
    )
  })

  it('resets the therapeutic focus filter back to "all" when re-selected', async () => {
    axios.get.mockResolvedValue({ data: { recipes } })
    const user = userEvent.setup()

    renderPage()
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))

    const [, focusSelect] = screen.getAllByRole('combobox')
    await user.selectOptions(focusSelect, 'gout_prevention')
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2))

    await user.selectOptions(focusSelect, '')
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3))
    expect(axios.get).toHaveBeenLastCalledWith(
      expect.not.stringContaining('therapeutic_focus=')
    )
  })

  it('searches recipes and shows results on success', async () => {
    axios.get.mockResolvedValueOnce({ data: { recipes: [] } })
    axios.get.mockResolvedValueOnce({ data: recipes })
    const user = userEvent.setup()

    renderPage()
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))

    await user.type(screen.getByPlaceholderText('Поиск рецепта...'), 'лопух')
    await user.click(screen.getByRole('button', { name: '🔍' }))

    await waitFor(() =>
      expect(screen.getByText('Классическое лопуховое')).toBeInTheDocument()
    )
    expect(axios.get).toHaveBeenLastCalledWith(
      expect.stringContaining('/herbal/recipes/search?q=')
    )
  })

  it('shows a search error message when search fails', async () => {
    axios.get.mockResolvedValueOnce({ data: { recipes: [] } })
    axios.get.mockRejectedValueOnce(new Error('search failed'))
    const user = userEvent.setup()

    renderPage()
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))

    await user.type(screen.getByPlaceholderText('Поиск рецепта...'), 'лопух')
    await user.click(screen.getByRole('button', { name: '🔍' }))

    await waitFor(() =>
      expect(screen.getByText('Ошибка при поиске')).toBeInTheDocument()
    )
  })

  it('clearing the search box refetches the unfiltered recipe list', async () => {
    axios.get.mockResolvedValue({ data: { recipes } })
    const user = userEvent.setup()

    renderPage()
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))

    const input = screen.getByPlaceholderText('Поиск рецепта...')
    await user.type(input, 'a')
    await user.clear(input)

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2))
    expect(axios.get).toHaveBeenLastCalledWith(
      expect.stringContaining('/herbal/recipes?')
    )
  })
})
