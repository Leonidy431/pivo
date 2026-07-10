import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import RecipesPage from './pages/RecipesPage'
import ShopsPage from './pages/ShopsPage'
import FavoritesPage from './pages/FavoritesPage'
import ProfilePage from './pages/ProfilePage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import './styles/App.css'

function AppContent() {
  const [favorites, setFavorites] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const location = useLocation()

  const toggleFavorite = (recipe) => {
    setFavorites(prev => {
      const exists = prev.find(r => r.id === recipe.id)
      if (exists) {
        return prev.filter(r => r.id !== recipe.id)
      }
      return [...prev, recipe]
    })
  }

  const isFavorite = (recipeId) => favorites.some(r => r.id === recipeId)

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => console.error('Geolocation error:', error)
      )
    }
  }

  return (
    <div className="app-container">
      <Header />
      <main className="app-content">
        <Routes>
          <Route
            path="/"
            element={
              <RecipesPage
                favorites={favorites}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/recipes/:id"
            element={
              <RecipeDetailPage
                favorites={favorites}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/shops"
            element={
              <ShopsPage
                userLocation={userLocation}
                getUserLocation={getUserLocation}
              />
            }
          />
          <Route
            path="/favorites"
            element={<FavoritesPage favorites={favorites} />}
          />
          <Route
            path="/profile"
            element={<ProfilePage />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
