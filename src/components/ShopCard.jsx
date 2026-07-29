import React from 'react'
import '../styles/components/shop-card.css'

export default function ShopCard({ shop, showDistance }) {
  return (
    <div className="shop-card">
      <div className="shop-header">
        <h3>{shop.name}</h3>
        {showDistance && shop.distance_km && (
          <span className="distance">📍 {shop.distance_km} км</span>
        )}
      </div>

      <div className="shop-info">
        <p className="address">📍 {shop.address}</p>
        <p className="city">{shop.city}, {shop.country}</p>
      </div>

      <div className="shop-contact">
        {shop.phone && <p>📞 {shop.phone}</p>}
        {shop.email && <p>✉️ {shop.email}</p>}
      </div>

      <div className="shop-features">
        {shop.has_online_ordering && <span className="feature">🛒 Online</span>}
        {shop.has_delivery && <span className="feature">🚚 Доставка</span>}
        {shop.offers_consultation && <span className="feature">💬 Консультация</span>}
      </div>

      {shop.rating && (
        <div className="shop-rating">
          <span className="rating">⭐ {shop.rating}</span>
          <span className="review-count">({shop.review_count})</span>
        </div>
      )}
    </div>
  )
}
