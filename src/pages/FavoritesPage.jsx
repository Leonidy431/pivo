import React from 'react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import '../styles/pages/favorites.css'

export default function FavoritesPage({ favorites }) {
  return (
    <div className="favorites-page">
      <h2>❤️ Избранные рецепты</h2>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>У вас нет избранных рецептов</p>
          <Link to="/" className="button">
            Перейти к рецептам
          </Link>
        </div>
      ) : (
        <div className="recipes-grid">
          {favorites.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className="recipe-link"
            >
              <RecipeCard recipe={recipe} isFavorite={true} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
