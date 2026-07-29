import React, { useState } from 'react'
import '../styles/components/search-bar.css'

export default function SearchBar({ onSearch, placeholder = 'Поиск рецепта...' }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    if (value.length === 0) {
      onSearch('')
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input"
      />
      <button type="submit" className="search-button">
        🔍
      </button>
    </form>
  )
}
