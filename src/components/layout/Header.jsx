import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/layout/header.css'

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🌿</span>
          <h1>Терапия</h1>
        </Link>
      </div>
    </header>
  )
}
