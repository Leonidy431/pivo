import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfilePage from './ProfilePage'

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders default profile info when nothing is in localStorage', () => {
    render(<ProfilePage />)

    expect(screen.getByRole('heading', { name: 'Пользователь' })).toBeInTheDocument()
    expect(screen.getByText('user@example.com')).toBeInTheDocument()
    expect(screen.getByText('Москва')).toBeInTheDocument()
    expect(screen.getByText('Не указаны')).toBeInTheDocument()
    expect(screen.getAllByText(/Да/)).toHaveLength(2)
  })

  it('loads a saved profile from localStorage', () => {
    localStorage.setItem(
      'userProfile',
      JSON.stringify({
        name: 'Иван',
        email: 'ivan@example.com',
        location: 'СПб',
        allergens: ['Орехи'],
        preferences: {
          showGoutSafeOnly: false,
          showDiabetesSafeOnly: false,
          favoriteCategory: 'all',
        },
      })
    )

    render(<ProfilePage />)

    expect(screen.getByRole('heading', { name: 'Иван' })).toBeInTheDocument()
    expect(screen.getByText('ivan@example.com')).toBeInTheDocument()
    expect(screen.getByText('Орехи')).toBeInTheDocument()
  })

  it('enters edit mode and updates name/email/location', async () => {
    const user = userEvent.setup()
    render(<ProfilePage />)

    await user.click(screen.getByText('✏️ Редактировать'))

    const nameInput = screen.getByDisplayValue('Пользователь')
    await user.clear(nameInput)
    await user.type(nameInput, 'Новое Имя')
    expect(nameInput).toHaveValue('Новое Имя')

    const emailInput = screen.getByDisplayValue('user@example.com')
    await user.clear(emailInput)
    await user.type(emailInput, 'new@example.com')
    expect(emailInput).toHaveValue('new@example.com')

    const locationInput = screen.getByDisplayValue('Москва')
    await user.clear(locationInput)
    await user.type(locationInput, 'Казань')
    expect(locationInput).toHaveValue('Казань')
  })

  it('adds and removes an allergen via checkboxes', async () => {
    const user = userEvent.setup()
    render(<ProfilePage />)

    await user.click(screen.getByText('✏️ Редактировать'))
    const nutsCheckbox = screen.getByLabelText('Орехи')

    await user.click(nutsCheckbox)
    expect(nutsCheckbox).toBeChecked()

    await user.click(nutsCheckbox)
    expect(nutsCheckbox).not.toBeChecked()
  })

  it('toggles the gout-safe and diabetes-safe preference checkboxes', async () => {
    const user = userEvent.setup()
    render(<ProfilePage />)

    await user.click(screen.getByText('✏️ Редактировать'))
    const [goutCheckbox, diabetesCheckbox] = screen.getAllByRole('checkbox').slice(-2)

    expect(goutCheckbox).toBeChecked()
    await user.click(goutCheckbox)
    expect(goutCheckbox).not.toBeChecked()

    expect(diabetesCheckbox).toBeChecked()
    await user.click(diabetesCheckbox)
    expect(diabetesCheckbox).not.toBeChecked()
  })

  it('exits edit mode via the save button', async () => {
    const user = userEvent.setup()
    render(<ProfilePage />)

    await user.click(screen.getByText('✏️ Редактировать'))
    await user.click(screen.getByText('Сохранить'))

    expect(screen.getByText('✏️ Редактировать')).toBeInTheDocument()
  })

  it('exits edit mode via the cancel button', async () => {
    const user = userEvent.setup()
    render(<ProfilePage />)

    await user.click(screen.getByText('✏️ Редактировать'))
    await user.click(screen.getByText('Отмена'))

    expect(screen.getByText('✏️ Редактировать')).toBeInTheDocument()
  })

  it('persists profile changes to localStorage', async () => {
    const user = userEvent.setup()
    render(<ProfilePage />)

    await user.click(screen.getByText('✏️ Редактировать'))
    const nameInput = screen.getByDisplayValue('Пользователь')
    fireEvent.change(nameInput, { target: { value: 'Мария' } })

    const saved = JSON.parse(localStorage.getItem('userProfile'))
    expect(saved.name).toBe('Мария')
  })
})
