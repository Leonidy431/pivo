import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/pages/kosmoscout.css'

export default function KosmoScoutPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch from KosmoScout API when available
      // const response = await axios.get('https://api.kosmoscout.com/projects')
      // setProjects(response.data)
      
      // Placeholder data
      setProjects([
        {
          id: 1,
          name: 'KosmoScout Explorer',
          description: 'Advanced space exploration toolkit',
          stars: 2500,
          language: 'C++',
        },
        {
          id: 2,
          name: 'Orbital Mechanics',
          description: 'Orbital calculation and visualization',
          stars: 1800,
          language: 'Python',
        },
        {
          id: 3,
          name: 'Satellite Tracking',
          description: 'Real-time satellite position tracking',
          stars: 3200,
          language: 'JavaScript',
        },
      ])
    } catch (err) {
      setError('Ошибка при загрузке проектов KosmoScout')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="kosmoscout-page">
      <div className="kosmoscout-header">
        <h1>🚀 KosmoScout</h1>
        <p>Инновационные проекты для исследования космоса</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Загрузка проектов...</div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <p>Проекты не найдены</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h3>{project.name}</h3>
                <span className="stars">⭐ {project.stars}</span>
              </div>
              <p className="description">{project.description}</p>
              <div className="project-footer">
                <span className="language">{project.language}</span>
                <a href="#" className="explore-link">
                  Подробнее →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
