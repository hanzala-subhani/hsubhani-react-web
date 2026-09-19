import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { CourseLessonBody, buildLessonNav } from '../components/CourseLessonBody'
import { getPublicCourseBySlug } from '../lib/courseApi'
import { formatCoursePrice, publicCourseThumbnailUrl } from '../lib/publicCourseUtils'

function listHref(fromCourses, opts = {}) {
  const u = new URLSearchParams()
  if (fromCourses?.sub) {
    if (String(fromCourses.sub) === 'all') {
      u.set('sub', 'all')
      if (fromCourses.cat) u.set('cat', String(fromCourses.cat))
    } else {
      u.set('sub', String(fromCourses.sub))
      if (fromCourses.cat) u.set('cat', String(fromCourses.cat))
    }
  }
  const courseKey = fromCourses?.course || opts.courseSlug
  if (courseKey) u.set('course', String(courseKey))
  if (fromCourses?.course_id != null && fromCourses.course_id !== '') {
    u.set('course_id', String(fromCourses.course_id))
  }
  const lessonKey = fromCourses?.lesson ?? opts.lessonId
  if (lessonKey != null && lessonKey !== '') u.set('lesson', String(lessonKey))
  if (![...u.keys()].length) return '/courses'
  return `/courses/topics?${u.toString()}`
}

export default function PublicCourseDetail() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const lessonParam = searchParams.get('lesson') || ''

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fromCourses = location.state?.fromCourses

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getPublicCourseBySlug(slug)
      .then(data => {
        if (!cancelled) setCourse(data || null)
      })
      .catch(e => {
        if (!cancelled) setError(e.message || 'Course not found')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const flatLessons = useMemo(() => (course ? buildLessonNav(course) : []), [course])

  const activeIndex = useMemo(() => {
    if (!lessonParam || !flatLessons.length) return -1
    const idx = flatLessons.findIndex(({ lesson }) => String(lesson.id) === String(lessonParam))
    return idx
  }, [lessonParam, flatLessons])

  const listUrl = listHref(fromCourses, { courseSlug: slug, lessonId: lessonParam })

  if (loading) {
    return (
      <div className="idetail-wrap">
        <div className="container">
          <p className="api-state">Loading course…</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="idetail-wrap">
        <div className="container">
          <p className="api-state api-state--error">{error || 'Course unavailable.'}</p>
          <Link to="/courses" className="btn btn-primary cdetail-back-fallback">Back to courses</Link>
        </div>
      </div>
    )
  }

  if (flatLessons.length === 0 && lessonParam) {
    return (
      <Navigate to={{ pathname: `/courses/${slug}` }} state={location.state} replace />
    )
  }

  if (flatLessons.length > 0) {
    if (!lessonParam) {
      const firstId = flatLessons[0].lesson.id
      return (
        <Navigate
          to={{ pathname: `/courses/${slug}`, search: `lesson=${encodeURIComponent(firstId)}` }}
          state={location.state}
          replace
        />
      )
    }
    if (activeIndex < 0) {
      const firstId = flatLessons[0].lesson.id
      return (
        <Navigate
          to={{ pathname: `/courses/${slug}`, search: `lesson=${encodeURIComponent(firstId)}` }}
          state={location.state}
          replace
        />
      )
    }
  }

  const row = activeIndex >= 0 ? flatLessons[activeIndex] : null
  const lesson = row?.lesson
  const topic = row?.topic
  const serial = activeIndex >= 0 ? activeIndex + 1 : 0
  const total = flatLessons.length
  const prevRow = activeIndex > 0 ? flatLessons[activeIndex - 1] : null
  const nextRow = activeIndex >= 0 && activeIndex < flatLessons.length - 1 ? flatLessons[activeIndex + 1] : null

  const thumb = publicCourseThumbnailUrl(course)
  const topics = Array.isArray(course.topics) ? course.topics : []

  const lessonLink = lid => ({
    pathname: `/courses/${slug}`,
    search: `lesson=${encodeURIComponent(lid)}`,
    state: location.state,
  })

  return (
    <div className="idetail-wrap">
      <aside className="idetail-sidebar">
        <div className="idetail-sidebar-inner">
          <Link to={listUrl} className="idetail-back">
            <i className="fa-solid fa-arrow-left" /> Back to list
          </Link>
          <h3 className="idetail-sidebar-heading">
            {course.title}
            <span className="idetail-sidebar-count">{flatLessons.length}</span>
          </h3>
          <nav className="idetail-q-nav" aria-label="Course curriculum">
            {flatLessons.length > 0
              ? topics.map(t => {
                const tLessons = Array.isArray(t.lessons) ? t.lessons : []
                if (!tLessons.length) return null
                return (
                  <div className="cdetail-nav-group" key={t.id}>
                    <div className="cdetail-nav-topic">{t.title}</div>
                    {tLessons.map(l => {
                      const globalIdx = flatLessons.findIndex(x => String(x.lesson.id) === String(l.id))
                      const isActive = String(l.id) === String(lessonParam)
                      return (
                        <Link
                          key={l.id}
                          to={lessonLink(l.id)}
                          className={`idetail-q-nav-item${isActive ? ' is-active' : ''}`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <span className="idetail-q-nav-num">{String(globalIdx + 1).padStart(2, '0')}</span>
                          <span className="idetail-q-nav-text">{l.title}</span>
                          {isActive && <i className="fa-solid fa-chevron-right idetail-q-nav-arrow" />}
                        </Link>
                      )
                    })}
                  </div>
                )
              })
              : (
                <p className="muted" style={{ padding: '0 12px', fontSize: 13 }}>No lessons yet.</p>
              )}
          </nav>
        </div>
      </aside>

      <div className="idetail-main">
        <div className="idetail-content">
          <div className="idetail-pagehead">
            <nav className="itopics-breadcrumb" aria-label="Breadcrumb">
              <Link to="/courses">Courses</Link>
              <i className="fa-solid fa-chevron-right" />
              <Link to={listUrl}>Browse</Link>
              <i className="fa-solid fa-chevron-right" />
              <span>{course.title}</span>
              {lesson && (
                <>
                  <i className="fa-solid fa-chevron-right" />
                  <span>L{String(serial).padStart(2, '0')}</span>
                </>
              )}
            </nav>

            {total > 0 && (
              <div className="idetail-progress" aria-label={`Lesson ${serial} of ${total}`}>
                <div className="idetail-progress-track">
                  <div
                    className="idetail-progress-fill"
                    style={{ width: `${total ? Math.round((serial / total) * 100) : 0}%` }}
                  />
                </div>
                <span>{serial} / {total}</span>
              </div>
            )}
          </div>

          <article className="idetail-card">
            <div className="idetail-card-header cdetail-card-header--course">
              {thumb && (
                <div
                  className="cdetail-hero-thumb"
                  style={{ backgroundImage: `url(${thumb})` }}
                  role="img"
                  aria-hidden
                />
              )}
              <div className="idetail-q-badge">
                {lesson
                  ? (
                    <>
                      <span className="idetail-q-label">Lesson {String(serial).padStart(2, '0')}</span>
                      {topic?.title && <span className="blog-tag">{topic.title}</span>}
                    </>
                  )
                  : (
                    <span className="idetail-q-label">Overview</span>
                  )}
                <span className={`course-detail-price-inline ${course.is_free ? 'is-free' : ''}`}>{formatCoursePrice(course)}</span>
              </div>
              <h1 className="idetail-question">{lesson ? lesson.title : course.title}</h1>
              {!lesson && course.category?.name && (
                <p className="muted" style={{ margin: '0 0 8px' }}>{course.category.name}</p>
              )}
            </div>

            {activeIndex === 0 && course.description && (
              <>
                <div className="idetail-divider">
                  <span><i className="fa-solid fa-circle-info" /> About this course</span>
                </div>
                <div
                  className="post-content post-content--html idetail-answer"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </>
            )}

            {lesson && (
              <>
                <div className="idetail-divider">
                  <span><i className="fa-solid fa-book-open" /> Lesson</span>
                </div>
                <CourseLessonBody lesson={lesson} />
              </>
            )}

            {!lesson && course.description && (
              <>
                <div className="idetail-divider">
                  <span><i className="fa-solid fa-list" /> Curriculum</span>
                </div>
                <p className="muted">Open a lesson from the sidebar when content is published.</p>
              </>
            )}

            {!lesson && !course.description && !flatLessons.length && (
              <p className="muted">This course does not have public content yet.</p>
            )}

            {flatLessons.length > 0 && (
              <div className="idetail-card-footer">
                <div className="idetail-nav">
                  {prevRow
                    ? (
                      <Link to={lessonLink(prevRow.lesson.id)} className="idetail-nav-item idetail-nav-item--prev">
                        <span className="idetail-nav-label"><i className="fa-solid fa-arrow-left" /> Previous</span>
                        <span className="idetail-nav-title">{prevRow.lesson.title}</span>
                      </Link>
                    )
                    : <div />}
                  {nextRow
                    ? (
                      <Link to={lessonLink(nextRow.lesson.id)} className="idetail-nav-item idetail-nav-item--next">
                        <span className="idetail-nav-label">Next <i className="fa-solid fa-arrow-right" /></span>
                        <span className="idetail-nav-title">{nextRow.lesson.title}</span>
                      </Link>
                    )
                    : <div />}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  )
}
