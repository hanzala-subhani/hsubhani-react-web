import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../lib/api'
import { mapInterviewCategoriesApi } from '../lib/interviewMappers'

export default function Interview() {
  const [openIdx, setOpenIdx] = useState(0)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    apiGet('web/interview-categories')
      .then(data => {
        if (!cancelled) setCategories(mapInterviewCategoriesApi(data))
      })
      .catch(e => {
        if (!cancelled) setError(e.message || 'Failed to load categories')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <section className="interview-page">
        <div className="container"><p className="api-state">Loading interview categories…</p></div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="interview-page">
        <div className="container"><p className="api-state api-state--error">{error}</p></div>
      </section>
    )
  }

  if (!categories.length) {
    return (
      <section className="interview-page">
        <div className="container"><p className="api-state">No interview categories yet.</p></div>
      </section>
    )
  }

  return (
    <section className="interview-page">
      <div className="container">
        <div className="interview-list">
          {categories.map((cat, ci) => {
            const isOpen = openIdx === ci
            return (
              <div className={`interview-category${isOpen ? ' is-open' : ''}`} key={cat.id}>
                <button
                  className="interview-category-header"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx(isOpen ? -1 : ci)}
                >
                  <span className="interview-category-title">
                    <span className="interview-category-ico"><i className={`fa-solid ${cat.icon}`} /></span>
                    {cat.title}
                  </span>
                  <span className="interview-toggle-btn">
                    <span className="toggle-label-show">Show Subcategories</span>
                    <span className="toggle-label-hide">Hide Subcategories</span>
                    <i className="fa-solid fa-chevron-down toggle-chevron" />
                  </span>
                </button>

                {isOpen && (
                  <div className="interview-subcategories">
                    <div className="interview-sub-grid">
                      {cat.subs.map(sub => {
                        const topicsUrl = `/interview/topics?cat=${encodeURIComponent(cat.slug)}&sub=${encodeURIComponent(sub.slug)}`
                        return (
                        <article className="interview-sub-card" key={sub.id}>
                          <Link
                            to={topicsUrl}
                            className="interview-sub-icon interview-sub-icon-link"
                            aria-label={`View ${sub.label} questions`}
                          >
                            <i className={`fa-solid ${sub.icon}`} aria-hidden="true" />
                          </Link>
                          <h4>{sub.label}</h4>
                          {sub.questions_count != null && (
                            <Link
                              to={topicsUrl}
                              className="interview-sub-count interview-sub-count-link"
                            >
                              {Number(sub.questions_count)} questions
                            </Link>
                          )}
                        </article>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
