import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/pages/recipe-detail.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1'

export default function RecipeDetailPage({ isFavorite, toggleFavorite }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shops, setShops] = useState([])
  const [showShops, setShowShops] = useState(false)

  useEffect(() => {
    fetchRecipe()
  }, [id])

  const fetchRecipe = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_BASE}/herbal/recipes/${id}`)
      setRecipe(response.data)
    } catch (err) {
      setError('Рецепт не найден')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchShops = async () => {
    try {
      const response = await axios.get(`${API_BASE}/herbal/recipes/${id}/available?radius_km=50`)
      setShops(response.data.shops)
      setShowShops(true)
    } catch (err) {
      setError('Ошибка при загрузке магазинов')
      console.error(err)
    }
  }

  if (loading) return <div className="loading">Загрузка рецепта...</div>
  if (error) return <div className="error-message">{error}</div>
  if (!recipe) return <div className="error-message">Рецепт не найден</div>

  const ingredients = typeof recipe.ingredients === 'string'
    ? JSON.parse(recipe.ingredients)
    : recipe.ingredients

  const compounds = typeof recipe.anti_inflammatory_compounds === 'string'
    ? JSON.parse(recipe.anti_inflammatory_compounds)
    : recipe.anti_inflammatory_compounds

  return (
    <div className="recipe-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Назад
      </button>

      <div className="recipe-header">
        <h1>{recipe.name}</h1>
        <div className="recipe-meta">
          <span className="origin">📍 {recipe.origin_region}</span>
          <span className="category">🏷️ {recipe.category}</span>
          <span className="difficulty">⭐ {recipe.difficulty_level}</span>
        </div>
      </div>

      <div className="safety-badges">
        {recipe.gout_safe && <span className="badge gout-safe">✓ Безопасно при подагре</span>}
        {recipe.diabetes_safe && <span className="badge diabetes-safe">✓ Безопасно при диабете</span>}
        <span className="badge purine-level">Пурины: {recipe.purine_level}</span>
      </div>

      <div className="recipe-content">
        <section className="section">
          <h3>Описание</h3>
          <p>{recipe.description}</p>
        </section>

        <section className="section">
          <h3>Основной ингредиент</h3>
          <p className="botanical">{recipe.base_botanical}</p>
        </section>

        <section className="section">
          <h3>Ингредиенты</h3>
          <ul className="ingredients-list">
            {Array.isArray(ingredients) ? (
              ingredients.map((ing, idx) => (
                <li key={idx}>
                  <strong>{ing.name}</strong> - {ing.amount} {ing.unit}
                </li>
              ))
            ) : (
              <li>{ingredients}</li>
            )}
          </ul>
        </section>

        <section className="section">
          <h3>Приготовление</h3>
          <div className="instructions">
            {recipe.preparation_instructions.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
          <div className="cooking-info">
            <span>⏱️ Время: {recipe.preparation_time_minutes} минут</span>
            <span>👥 Порций: {recipe.servings}</span>
          </div>
        </section>

        <section className="section">
          <h3>Метод приготовления</h3>
          <div className="methods">
            <p>
              <strong>Экстракция:</strong> {recipe.extraction_method}
            </p>
            <p>
              <strong>Газация:</strong> {recipe.carbonation_method}
            </p>
          </div>
        </section>

        <section className="section">
          <h3>Терапевтический эффект</h3>
          <p className="focus"><strong>{recipe.therapeutic_focus}</strong></p>
          <p>
            <strong>Противовоспалительные соединения:</strong><br />
            {Array.isArray(compounds) ? compounds.join(', ') : compounds}
          </p>
        </section>

        <section className="section">
          <h3>Параметры</h3>
          <div className="parameters">
            <p>🍬 Сахара: {recipe.sugar_content_g || 0}g</p>
            <p>☕ Кофеин: {recipe.caffeine_mg}mg</p>
            <p>🍺 Алкоголь: {recipe.alcohol_percent}%</p>
            <p>😋 Горечь: {recipe.bitterness_level}/10</p>
            <p>💰 Сложность: {recipe.cost_level}</p>
          </div>
        </section>
      </div>

      <div className="recipe-actions">
        <button
          onClick={() => toggleFavorite(recipe)}
          className={`favorite-button ${isFavorite(recipe.id) ? 'active' : ''}`}
        >
          {isFavorite(recipe.id) ? '❤️ В избранном' : '🤍 Добавить в избранное'}
        </button>

        <button
          onClick={fetchShops}
          className="shops-button"
        >
          🏪 Где купить
        </button>
      </div>

      {showShops && shops.length > 0 && (
        <section className="shops-section">
          <h3>Где найти этот рецепт</h3>
          <div className="shops-list">
            {shops.map(shop => (
              <div key={shop.shop_id} className="shop-item">
                <h4>{shop.shop_name}</h4>
                <p>{shop.address}, {shop.city}</p>
                <p>📞 {shop.phone}</p>
                {shop.distance_km && <p>📍 {shop.distance_km}км от вас</p>}
                <div className="shop-pricing">
                  <span className="price">💰 {shop.price}₽</span>
                  {shop.special_offer_price && (
                    <span className="special-price">⚡ {shop.special_offer_price}₽</span>
                  )}
                </div>
                {shop.preparation_available && (
                  <p className="preparation">✓ Доступна подготовка на месте</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
