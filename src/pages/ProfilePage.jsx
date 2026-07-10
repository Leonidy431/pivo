import React, { useState } from 'react'
import '../styles/pages/profile.css'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Пользователь',
    email: 'user@example.com',
    location: 'Москва',
    allergens: [],
    preferences: {
      showGoutSafeOnly: true,
      showDiabetesSafeOnly: true,
      favoriteCategory: 'all',
    },
  })

  const [editing, setEditing] = useState(false)

  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePreferenceChange = (pref, value) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [pref]: value,
      },
    }))
  }

  const allergens = ['Орехи', 'Молоко', 'Глютен', 'Соя']

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">👤</div>
        <h2>{profile.name}</h2>
      </div>

      {editing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Имя</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Город</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Аллергены (выберите)</label>
            <div className="allergen-list">
              {allergens.map(allergen => (
                <label key={allergen} className="checkbox">
                  <input
                    type="checkbox"
                    checked={profile.allergens.includes(allergen)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProfile(prev => ({
                          ...prev,
                          allergens: [...prev.allergens, allergen],
                        }))
                      } else {
                        setProfile(prev => ({
                          ...prev,
                          allergens: prev.allergens.filter(a => a !== allergen),
                        }))
                      }
                    }}
                  />
                  {allergen}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={profile.preferences.showGoutSafeOnly}
                onChange={(e) =>
                  handlePreferenceChange('showGoutSafeOnly', e.target.checked)
                }
              />
              Показывать только безопасные при подагре
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={profile.preferences.showDiabetesSafeOnly}
                onChange={(e) =>
                  handlePreferenceChange('showDiabetesSafeOnly', e.target.checked)
                }
              />
              Показывать только безопасные при диабете
            </label>
          </div>

          <div className="form-buttons">
            <button onClick={() => setEditing(false)} className="save-button">
              Сохранить
            </button>
            <button onClick={() => setEditing(false)} className="cancel-button">
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-info">
          <div className="info-group">
            <label>Email</label>
            <p>{profile.email}</p>
          </div>

          <div className="info-group">
            <label>Город</label>
            <p>{profile.location}</p>
          </div>

          <div className="info-group">
            <label>Аллергены</label>
            <p>
              {profile.allergens.length === 0
                ? 'Не указаны'
                : profile.allergens.join(', ')}
            </p>
          </div>

          <div className="info-group">
            <label>Предпочтения</label>
            <div className="preferences">
              <p>
                🤕 Подагра-безопасные:{' '}
                {profile.preferences.showGoutSafeOnly ? 'Да' : 'Нет'}
              </p>
              <p>
                🩺 Диабет-безопасные:{' '}
                {profile.preferences.showDiabetesSafeOnly ? 'Да' : 'Нет'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="edit-button"
          >
            ✏️ Редактировать
          </button>
        </div>
      )}
    </div>
  )
}
