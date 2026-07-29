import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ShopCard from '../components/ShopCard'
import SearchBar from '../components/SearchBar'
import '../styles/pages/shops.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1'

export default function ShopsPage({ userLocation, getUserLocation }) {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [city, setCity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [nearbyMode, setNearbyMode] = useState(false)

  useEffect(() => {
    if (nearbyMode && userLocation) {
      fetchNearbyShops()
    }
  }, [nearbyMode, userLocation])

  const fetchNearbyShops = async () => {
    if (!userLocation) return

    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(
        `${API_BASE}/herbal/shops/near?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius_km=50&limit=20`
      )
      setShops(response.data.shops)
    } catch (err) {
      setError('Ошибка при загрузке магазинов')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    setNearbyMode(false)

    if (!query.trim()) {
      setShops([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_BASE}/herbal/shops/search?q=${query}`)
      setShops(response.data)
    } catch (err) {
      setError('Ошибка при поиске')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCitySearch = async () => {
    if (!city.trim()) return

    setLoading(true)
    setError(null)
    setNearbyMode(false)
    try {
      const response = await axios.get(`${API_BASE}/herbal/shops/city/${city}`)
      setShops(response.data.shops)
    } catch (err) {
      setError('Город не найден')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleNearby = () => {
    setNearbyMode(true)
    setCity('')
    setSearchQuery('')
    if (!userLocation) {
      getUserLocation()
    }
  }

  return (
    <div className="shops-page">
      <SearchBar onSearch={handleSearch} placeholder="Поиск магазина..." />

      <div className="shop-controls">
        <div className="city-search">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Введите город"
            className="city-input"
            onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
          />
          <button onClick={handleCitySearch} className="search-button">
            Найти
          </button>
        </div>

        <button
          onClick={handleNearby}
          className={`nearby-button ${nearbyMode ? 'active' : ''}`}
        >
          📍 Рядом со мной
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Загрузка магазинов...</div>
      ) : shops.length === 0 ? (
        <div className="empty-state">
          <p>Магазины не найдены</p>
          <p className="hint">Используйте поиск или выберите город</p>
        </div>
      ) : (
        <div className="shops-list">
          {shops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              showDistance={nearbyMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}
