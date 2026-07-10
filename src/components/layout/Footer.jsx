import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../../styles/layout/footer.css'

export default function Footer() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <footer className="app-footer">
      <nav className="bottom-nav">
        <Link
          to="/"
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          title="Рецепты"
        >
          <span className="nav-icon">📖</span>
          <span className="nav-label">Рецепты</span>
        </Link>

        <Link
          to="/shops"
          className={`nav-item ${isActive('/shops') ? 'active' : ''}`}
          title="Магазины"
        >
          <span className="nav-icon">📍</span>
          <span className="nav-label">Магазины</span>
        </Link>

        <Link
          to="/favorites"
          className={`nav-item ${isActive('/favorites') ? 'active' : ''}`}
          title="Избранное"
        >
          <span className="nav-icon">❤️</span>
          <span className="nav-label">Избранное</span>
        </Link>

        <Link
          to="/profile"
          className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
          title="Профиль"
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Профиль</span>
        </Link>
      </nav>
    </footer>
  )
}
