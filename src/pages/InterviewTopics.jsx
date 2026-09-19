import { useState, useEffect } from 'react'
import { Link, useSearchParams, Navigate } from 'react-router-dom'
import { apiGet } from '../lib/api'
import { plainTextPreview } from '../lib/htmlToPlain'
import {
  mapInterviewCategoriesApi,
  findCategoryBySlug,
  findSubBySlug,
  mapQuestionsFromApi,
} from '../lib/interviewMappers'

function subCountLabel(sub) {
  const n = sub.questions_count
  if (n != null && n !== '') return Number(n)
  return '—'
}

export default function InterviewTopics() {
  const [params] = useSearchParams()
  const catSlug = params.get('cat') || ''
  const subSlug = params.get('sub') || ''

  const [categories, setCategories] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [openCat, setOpenCat] = useState(catSlug)
  const [openQ, setOpenQ] = useState(null)

  const currentCat = categories.length ? findCategoryBySlug(categories, catSlug) : null
  const currentSub = currentCat ? findSubBySlug(currentCat, subSlug) : null

  useEffect(() => {
    if (catSlug) setOpenCat(catSlug)
  }, [catSlug])

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

  useEffect(() => {
    if (!currentSub?.id) {
      setQuestions([])
      setQuestionsLoading(false)
      return
    }
    let cancelled = false
    setQuestionsLoading(true)
    apiGet(`web/interview-categories/${currentSub.id}/questions`)
      .then(data => {
        if (!cancelled) setQuestions(mapQuestionsFromApi(data?.questions))
      })
      .catch(() => {
        if (!cancelled) setQuestions([])
      })
      .finally(() => {
        if (!cancelled) setQuestionsLoading(false)
      })
    return () => { cancelled = true }
  }, [currentSub?.id])

  if (loading && !categories.length) {
    return (
      <div className="itopics-wrap">
        <p className="api-state" style={{ gridColumn: '1 / -1' }}>Loading…</p>
      </div>
    )
  }

  if (error && !categories.length) {
    return (
      <div className="itopics-wrap">
        <p className="api-state api-state--error" style={{ gridColumn: '1 / -1' }}>{error}</p>
      </div>
    )
  }

  if (!categories.length) {
    return <Navigate to="/interview" replace />
  }

  if (!currentCat) {
    const first = categories[0]
    const firstSub = first.subs[0]
    if (firstSub) {
      return (
        <Navigate
          to={`/interview/topics?cat=${encodeURIComponent(first.slug)}&sub=${encodeURIComponent(firstSub.slug)}`}
          replace
        />
      )
    }
    return <Navigate to="/interview" replace />
  }

  if (!currentSub) {
    const sub = currentCat.subs[0]
    if (sub) {
      return (
        <Navigate
          to={`/interview/topics?cat=${encodeURIComponent(currentCat.slug)}&sub=${encodeURIComponent(sub.slug)}`}
          replace
        />
      )
    }
    return <Navigate to="/interview" replace />
  }

  const subIndex = currentCat.subs.findIndex(s => s.slug === currentSub.slug)
  const prevSub = subIndex > 0 ? currentCat.subs[subIndex - 1] : null
  const nextSub = subIndex < currentCat.subs.length - 1 ? currentCat.subs[subIndex + 1] : null

  return (
    <div className="itopics-wrap">
      <aside className="itopics-sidebar">
        <div className="itopics-sidebar-inner">
          <h3 className="itopics-sidebar-heading">Categories</h3>
          {categories.map(cat => {
            const isActiveCat = cat.slug === catSlug
            const isOpen = openCat === cat.slug
            return (
              <div className={`itopics-cat${isOpen ? ' is-open' : ''}`} key={cat.id}>
                <button
                  className={`itopics-cat-header${isActiveCat ? ' is-active' : ''}`}
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenCat(isOpen ? '' : cat.slug)}
                >
                  <span>{cat.title}</span>
                  <i className="fa-solid fa-chevron-down itopics-chevron" />
                </button>
                {isOpen && (
                  <ul className="itopics-sub-list">
                    {cat.subs.map(sub => {
                      const isActiveSub = isActiveCat && sub.slug === subSlug
                      return (
                        <li key={sub.id}>
                          <Link
                            to={`/interview/topics?cat=${encodeURIComponent(cat.slug)}&sub=${encodeURIComponent(sub.slug)}`}
                            className={`itopics-sub-link${isActiveSub ? ' is-active' : ''}`}
                          >
                            {sub.label}
                            <span className="itopics-count">{subCountLabel(sub)}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </aside>

      <div className="itopics-main">
        <div className="itopics-topbar">
          <nav className="itopics-breadcrumb" aria-label="Breadcrumb">
            <Link to="/interview">Interview</Link>
            <i className="fa-solid fa-chevron-right" />
            <Link to={`/interview/topics?cat=${encodeURIComponent(catSlug)}`}>{currentCat.title}</Link>
            <i className="fa-solid fa-chevron-right" />
            <span>{currentSub.label}</span>
          </nav>
          <h1 className="itopics-heading">
            {currentSub.label}
            <span className="itopics-heading-count">{questions.length} Questions</span>
          </h1>
        </div>

        <div className="itopics-question-list">
          {questionsLoading && (
            <p className="api-state" style={{ padding: '24px 0' }}>Loading questions…</p>
          )}
          {!questionsLoading && questions.length === 0 && (
            <p className="api-state" style={{ padding: '24px 0' }}>No questions in this topic yet.</p>
          )}
          {!questionsLoading && questions.map((item, qi) => (
            <div className={`itopics-question${openQ === qi ? ' is-open' : ''}`} key={item.id}>
              <div className="itopics-question-headrow">
                <button
                  className="itopics-question-toggle"
                  type="button"
                  aria-expanded={openQ === qi}
                  onClick={() => setOpenQ(openQ === qi ? null : qi)}
                >
                  <span className="itopics-q-num">{String(qi + 1).padStart(2, '0')}</span>
                  <span className="itopics-q-text">{item.q}</span>
                  <i className="fa-solid fa-chevron-down itopics-q-chevron" />
                </button>
                <Link
                  to={`/interview/detail?cat=${encodeURIComponent(currentCat.slug)}&sub=${encodeURIComponent(currentSub.slug)}&q=${qi}&question_id=${encodeURIComponent(item.id)}`}
                  className="itopics-detail-link"
                  aria-label="View full answer"
                >
                  <i className="fa-solid fa-arrow-up-right" />
                </Link>
              </div>
              {openQ === qi && (
                <div className="itopics-answer">
                  <p className="itopics-answer-preview">{plainTextPreview(item.a, 250)}</p>
                  <Link
                    to={`/interview/detail?cat=${encodeURIComponent(currentCat.slug)}&sub=${encodeURIComponent(currentSub.slug)}&q=${qi}&question_id=${encodeURIComponent(item.id)}`}
                    className="itopics-read-more"
                  >
                    Read full answer <i className="fa-solid fa-arrow-up-right" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="itopics-subnav">
          {prevSub
            ? (
              <Link
                to={`/interview/topics?cat=${encodeURIComponent(catSlug)}&sub=${encodeURIComponent(prevSub.slug)}`}
                className="itopics-subnav-item itopics-subnav-item--prev"
              >
                <span className="itopics-subnav-label"><i className="fa-solid fa-arrow-left" /> Previous Topic</span>
                <span className="itopics-subnav-title">{prevSub.label}</span>
              </Link>
            )
            : <div />}
          {nextSub
            ? (
              <Link
                to={`/interview/topics?cat=${encodeURIComponent(catSlug)}&sub=${encodeURIComponent(nextSub.slug)}`}
                className="itopics-subnav-item itopics-subnav-item--next"
              >
                <span className="itopics-subnav-label">Next Topic <i className="fa-solid fa-arrow-right" /></span>
                <span className="itopics-subnav-title">{nextSub.label}</span>
              </Link>
            )
            : <div />}
        </div>
      </div>
    </div>
  )
}
