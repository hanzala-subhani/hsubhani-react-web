import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { getPublicCourseCatalog } from '../lib/courseApi'
import {
  formatCoursePrice,
  publicCourseExcerpt,
  publicCourseThumbnailUrl,
} from '../lib/publicCourseUtils'

const ROOT_ICONS = ['fa-layer-group', 'fa-graduation-cap', 'fa-book', 'fa-compass', 'fa-star']
const TOPICS_BASE = '/courses/topics'
const SUB_ALL = 'all'

/** @param {{ cat?: string, sub?: string, course?: string, course_id?: string|number, lesson?: string|number }} p */
function buildTopicsQuery(p) {
  const u = new URLSearchParams()
  if (String(p.sub) === SUB_ALL) {
    u.set('sub', SUB_ALL)
    if (p.cat) u.set('cat', String(p.cat))
  } else {
    if (p.sub) u.set('sub', String(p.sub))
    if (p.cat) u.set('cat', String(p.cat))
  }
  if (p.course) u.set('course', String(p.course))
  if (p.course_id != null && p.course_id !== '') u.set('course_id', String(p.course_id))
  if (p.lesson != null && p.lesson !== '') u.set('lesson', String(p.lesson))
  return u.toString()
}

/** All courses under a category node (own + subcategories), deduped by id. */
function collectCoursesFromCategoryNode(node) {
  const byId = new Map()
  function walk(n) {
    for (const c of n.courses || []) {
      if (c?.id != null) byId.set(c.id, c)
    }
    for (const sub of n.subcategories || []) walk(sub)
  }
  walk(node)
  return [...byId.values()]
}

function flattenCatalogCourses(catalog) {
  const byId = new Map()
  for (const root of catalog || []) {
    for (const c of collectCoursesFromCategoryNode(root)) {
      if (c?.id != null) byId.set(c.id, c)
    }
  }
  return [...byId.values()]
}

function ExpandedCoursePanel({ courses, getCourseTo, fromCoursesState, footerLink }) {
  return (
    <div className="interview-subcategories">
      <div className="interview-sub-grid">
        {courses.length === 0 && (
          <p className="api-state" style={{ gridColumn: '1 / -1' }}>
            No courses in this category yet.
          </p>
        )}
        {courses.map(course => {
          const thumb = publicCourseThumbnailUrl(course)
          const excerpt = publicCourseExcerpt(course, 100)
          return (
            <article className="interview-sub-card" key={course.id}>
              <div className="interview-sub-icon">
                {thumb ? (
                  <div
                    className="course-list-preview-thumb"
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: 48,
                      backgroundImage: `url(${thumb})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 8,
                    }}
                    role="img"
                    aria-hidden
                  />
                ) : (
                  <i className="fa-solid fa-book-open" />
                )}
              </div>
              <h4>{course.title}</h4>
              <span className="interview-sub-count">
                {formatCoursePrice(course)}
                {excerpt ? ` · ${excerpt}` : ''}
              </span>
              <Link
                to={getCourseTo(course)}
                className="interview-sub-btn"
                state={{ fromCourses: fromCoursesState(course) }}
              >
                View course
              </Link>
            </article>
          )
        })}
      </div>
      {footerLink && (
        <p className="muted" style={{ marginTop: 12 }}>
          <Link to={footerLink.to}>{footerLink.label}</Link>
        </p>
      )}
    </div>
  )
}

export default function PublicCourses() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [openIdx, setOpenIdx] = useState(0)
  const [roots, setRoots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const hasLegacyQs = !!(
    searchParams.get('cat') ||
    searchParams.get('sub') ||
    searchParams.get('category')
  )

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getPublicCourseCatalog()
      .then(data => {
        if (!cancelled) setRoots(Array.isArray(data) ? data : [])
      })
      .catch(e => {
        if (!cancelled) setError(e.message || 'Failed to load course catalog')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const expandedCourses = useMemo(() => {
    if (openIdx === -2) return []
    if (!roots.length) return []
    if (openIdx === -1) return flattenCatalogCourses(roots)
    const root = roots[openIdx]
    if (!root) return []
    return collectCoursesFromCategoryNode(root)
  }, [openIdx, roots])

  if (hasLegacyQs) {
    return <Navigate to={`${TOPICS_BASE}${location.search}`} replace />
  }

  if (loading) {
    return (
      <section className="interview-page">
        <div className="container"><p className="api-state">Loading course catalog…</p></div>
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

  if (!roots.length) {
    return (
      <section className="interview-page">
        <div className="container"><p className="api-state">No course categories yet.</p></div>
      </section>
    )
  }

  return (
    <section className="interview-page">
      <div className="container">
        <div className="section-head">
          <span>Learn</span>
          <h1>Course categories</h1>
          <p>Open a category to see its courses, or browse the full list under “Browse all”.</p>
        </div>

        <div className="interview-list">
          <div className={`interview-category${openIdx === -1 ? ' is-open' : ''}`}>
            <button
              className="interview-category-header"
              type="button"
              aria-expanded={openIdx === -1}
              onClick={() => setOpenIdx(openIdx === -1 ? -2 : -1)}
            >
              <span className="interview-category-title">
                <span className="interview-category-ico">
                  <i className="fa-solid fa-border-all" />
                </span>
                Browse all
              </span>
              <span className="interview-toggle-btn">
                <span className="toggle-label-show">Show all courses</span>
                <span className="toggle-label-hide">Hide all courses</span>
                <i className="fa-solid fa-chevron-down toggle-chevron" />
              </span>
            </button>
            {openIdx === -1 && (
              <ExpandedCoursePanel
                courses={expandedCourses}
                getCourseTo={c =>
                  `${TOPICS_BASE}?${buildTopicsQuery({
                    sub: SUB_ALL,
                    course: c.slug || String(c.id),
                    course_id: c.id,
                  })}`
                }
                fromCoursesState={c => ({
                  cat: '',
                  sub: SUB_ALL,
                  course: c.slug || String(c.id),
                  course_id: String(c.id),
                })}
                footerLink={{ to: `${TOPICS_BASE}?sub=all`, label: 'Open catalog with filters & pagination →' }}
              />
            )}
          </div>

          {roots.map((root, ci) => {
            const isOpen = openIdx === ci
            return (
              <div className={`interview-category${isOpen ? ' is-open' : ''}`} key={root.id}>
                <button
                  className="interview-category-header"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx(isOpen ? -2 : ci)}
                >
                  <span className="interview-category-title">
                    <span className="interview-category-ico">
                      <i className={`fa-solid ${ROOT_ICONS[ci % ROOT_ICONS.length]}`} />
                    </span>
                    {root.name}
                  </span>
                  <span className="interview-toggle-btn">
                    <span className="toggle-label-show">Show courses</span>
                    <span className="toggle-label-hide">Hide courses</span>
                    <i className="fa-solid fa-chevron-down toggle-chevron" />
                  </span>
                </button>

                {isOpen && (
                  <ExpandedCoursePanel
                    courses={expandedCourses}
                    getCourseTo={c =>
                      `${TOPICS_BASE}?${buildTopicsQuery({
                        cat: String(root.id),
                        sub: String(root.id),
                        course: c.slug || String(c.id),
                        course_id: c.id,
                      })}`
                    }
                    fromCoursesState={c => ({
                      cat: String(root.id),
                      sub: String(root.id),
                      course: c.slug || String(c.id),
                      course_id: String(c.id),
                    })}
                    footerLink={{
                      to: `${TOPICS_BASE}?${buildTopicsQuery({
                        cat: String(root.id),
                        sub: String(root.id),
                      })}`,
                      label: 'Open this category in the full catalog →',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
