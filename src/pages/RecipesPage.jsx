import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import RecipeCard from '../components/RecipeCard'
import SearchBar from '../components/SearchBar'
import '../styles/pages/recipes.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1'

export default function RecipesPage({ favorites, isFavorite, toggleFavorite }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState(null)
  const [focus, setFocus] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchRecipes()
  }, [category, focus])

  const fetchRecipes = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (focus) params.append('therapeutic_focus', focus)
      params.append('limit', '50')

      const response = await axios.get(`${API_BASE}/herbal/recipes?${params}`)
      setRecipes(response.data.recipes)
    } catch (err) {
      setError('Ошибка при загрузке рецептов')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      fetchRecipes()
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_BASE}/herbal/recipes/search?q=${query}`)
      setRecipes(response.data)
    } catch (err) {
      setError('Ошибка при поиске')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="recipes-page">
      <SearchBar onSearch={handleSearch} />

      <div className="filters">
        <select
          value={category || ''}
          onChange={(e) => setCategory(e.target.value || null)}
          className="filter-select"
        >
          <option value="">Все категории</option>
          <option value="root_elixir">Корневые эликсиры</option>
          <option value="herbal_floral">Травяные профили</option>
          <option value="forest_woody">Лесные и древесные</option>
          <option value="tropical_exotic">Тропические</option>
          <option value="functional_blend">Функциональные смеси</option>
        </select>

        <select
          value={focus || ''}
          onChange={(e) => setFocus(e.target.value || null)}
          className="filter-select"
        >
          <option value="">Все показания</option>
          <option value="gout_prevention">Профилактика подагры</option>
          <option value="kidney_support">Поддержка почек</option>
          <option value="liver_support">Поддержка печени</option>
          <option value="joint_health">Здоровье суставов</option>
          <option value="immune_boost">Иммунитет</option>
          <option value="anti_inflammatory">Противовоспалительное</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Загрузка рецептов...</div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <p>Рецепты не найдены</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="recipe-link"
            >
              <RecipeCard
                recipe={recipe}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={() => toggleFavorite(recipe)}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
