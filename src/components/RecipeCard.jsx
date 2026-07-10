import React from 'react'
import '../styles/components/recipe-card.css'

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <h3>{recipe.name}</h3>
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            onToggleFavorite()
          }}
          title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="recipe-info">
        <p className="botanical">🌿 {recipe.base_botanical}</p>
        <p className="origin">📍 {recipe.origin_region}</p>
      </div>

      <div className="recipe-badges">
        {recipe.gout_safe && <span className="badge">Подагра✓</span>}
        {recipe.diabetes_safe && <span className="badge">Диабет✓</span>}
      </div>

      <div className="recipe-footer">
        <span className="category">{recipe.category}</span>
        <span className="rating">⭐ {recipe.rating}</span>
      </div>
    </div>
  )
}
