import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams, Navigate } from 'react-router-dom'
import { CourseLessonBody, buildLessonNav, lessonHasDisplayContent } from '../components/CourseLessonBody'
import {
  getPublicCourseCategoryTree,
  getPublicCourses,
  getPublicCourseBySlug,
  getPublicCourseById,
  getPublicCourseTopicsPayload,
  getPublicCourseLesson,
  mergePostTopicsWithRichLessons,
} from '../lib/courseApi'
import {
  formatCoursePrice,
  publicCourseExcerpt,
  publicCourseThumbnailUrl,
} from '../lib/publicCourseUtils'

const SUB_ALL = 'all'
const TOPICS_BASE = '/courses/topics'

function subsOf(root) {
  return Array.isArray(root.subcategories) ? root.subcategories : []
}

function firstSelectable(roots) {
  if (!roots.length) return null
  const r = roots[0]
  const subs = subsOf(r)
  if (subs.length) return { root: r, sub: subs[0] }
  return { root: r, sub: r }
}

function findSelection(roots, subId) {
  if (subId == null || subId === '' || String(subId) === SUB_ALL) return null
  for (const root of roots) {
    const subs = subsOf(root)
    if (String(root.id) === String(subId)) return { root, sub: root }
    const sub = subs.find(s => String(s.id) === String(subId))
    if (sub) return { root, sub }
  }
  return null
}

function subCountLabel(sub) {
  const n = sub?.courses_count ?? sub?.courses_count_total
  if (n != null && n !== '') return Number(n)
  return '—'
}

/** @param {{ cat?: string, sub?: string, course?: string, course_id?: string|number, lesson?: string|number }} p */
function buildTopicsQuery(p) {
  const u = new URLSearchParams()
  if (String(p.sub) === SUB_ALL) {
    u.set('sub', 'all')
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

function topicsQs(params) {
  const { cat, sub } = params
  if (String(sub) === SUB_ALL) return `${TOPICS_BASE}?${buildTopicsQuery({ cat, sub: SUB_ALL })}`
  return `${TOPICS_BASE}?${buildTopicsQuery({ cat, sub })}`
}

function findLessonInCourse(course, lessonId) {
  if (!course || lessonId == null || lessonId === '') return null
  for (const t of course?.topics || []) {
    for (const l of t.lessons || []) {
      if (String(l.id) === String(lessonId)) return l
    }
  }
  return null
}

export default function PublicCourseTopics() {
  const [searchParams] = useSearchParams()
  const catParam = searchParams.get('cat') || ''
  const subParam = searchParams.get('sub') || searchParams.get('category') || ''
  const courseSlug = searchParams.get('course') || ''
  const courseIdParam = searchParams.get('course_id') || ''
  const lessonParam = searchParams.get('lesson') || ''

  const [roots, setRoots] = useState([])
  const [loadingTree, setLoadingTree] = useState(true)
  const [treeError, setTreeError] = useState(null)

  const [courses, setCourses] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState(null)
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [openCat, setOpenCat] = useState('')
  const [openRow, setOpenRow] = useState(null)

  const [courseDetail, setCourseDetail] = useState(null)
  const [courseDetailLoading, setCourseDetailLoading] = useState(false)
  const [courseLoadError, setCourseLoadError] = useState(null)
  const [openTopicId, setOpenTopicId] = useState('')
  const [lessonEnrichment, setLessonEnrichment] = useState(null)
  const [lessonEnrichmentLoading, setLessonEnrichmentLoading] = useState(false)

  const isAllCourses = String(subParam) === SUB_ALL
  const selection = !loadingTree && roots.length && !isAllCourses ? findSelection(roots, subParam) : null
  const crumbSelection = useMemo(
    () =>
      !loadingTree && roots.length && !isAllCourses && subParam
        ? findSelection(roots, subParam)
        : null,
    [loadingTree, roots, isAllCourses, subParam],
  )

  useEffect(() => {
    let cancelled = false
    setLoadingTree(true)
    setTreeError(null)
    getPublicCourseCategoryTree()
      .then(data => {
        if (!cancelled) setRoots(Array.isArray(data) ? data : [])
      })
      .catch(e => {
        if (!cancelled) setTreeError(e.message || 'Failed to load categories')
      })
      .finally(() => {
        if (!cancelled) setLoadingTree(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!courseSlug && !courseIdParam) {
      setCourseDetail(null)
      setCourseLoadError(null)
      setCourseDetailLoading(false)
      return
    }
    let cancelled = false
    setCourseDetailLoading(true)
    setCourseLoadError(null)

    const run = async () => {
      try {
        const idFromQs =
          courseIdParam && /^\d+$/.test(String(courseIdParam).trim())
            ? Number(String(courseIdParam).trim())
            : null
        const idFromSlug =
          courseSlug && /^\d+$/.test(String(courseSlug).trim())
            ? Number(String(courseSlug).trim())
            : null
        const preferredId = idFromQs ?? idFromSlug

        if (preferredId != null) {
          const [topicsPayload, richCourseById] = await Promise.all([
            getPublicCourseTopicsPayload(preferredId),
            getPublicCourseById(preferredId).catch(() => null),
          ])
          if (cancelled) return
          // Fall back to slug lookup if ID endpoint returned nothing
          let richCourse = richCourseById
          if (!richCourse && courseSlug && !/^\d+$/.test(String(courseSlug).trim())) {
            richCourse = await getPublicCourseBySlug(courseSlug).catch(() => null)
            if (cancelled) return
          }
          const mergedTopics = mergePostTopicsWithRichLessons(topicsPayload.topics, richCourse)
          const detail = richCourse
            ? { ...richCourse, topics: mergedTopics }
            : {
                id: topicsPayload.courseId,
                title: `Course #${topicsPayload.courseId}`,
                slug: courseSlug || String(topicsPayload.courseId),
                topics: mergedTopics,
                is_free: true,
                description: '',
              }
          setCourseDetail(detail)
          setCourseLoadError(null)
          return
        }

        const richCourse = await getPublicCourseBySlug(courseSlug)
        if (cancelled) return
        let mergedTopics = Array.isArray(richCourse?.topics) ? richCourse.topics : []
        if (richCourse?.id != null) {
          try {
            const { topics: postTopics } = await getPublicCourseTopicsPayload(richCourse.id)
            mergedTopics = mergePostTopicsWithRichLessons(postTopics, richCourse)
          } catch {
            mergedTopics = Array.isArray(richCourse.topics) ? richCourse.topics : []
          }
        }
        setCourseDetail({ ...richCourse, topics: mergedTopics })
        setCourseLoadError(null)
      } catch (e) {
        if (!cancelled) {
          setCourseLoadError(e.message || 'Course not found')
          setCourseDetail(null)
        }
      } finally {
        if (!cancelled) setCourseDetailLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [courseSlug, courseIdParam])

  useEffect(() => {
    if (selection) setOpenCat(String(selection.root.id))
  }, [selection?.root?.id])

  useEffect(() => {
    setPage(1)
  }, [subParam])

  useEffect(() => {
    if (courseSlug || courseIdParam) return
    let cancelled = false
    setListLoading(true)
    setListError(null)
    const categoryId = isAllCourses ? undefined : subParam || undefined
    getPublicCourses({
      category_id: categoryId,
      page,
      per_page: 12,
    })
      .then(({ items, meta: m }) => {
        if (!cancelled) {
          setCourses(Array.isArray(items) ? items : [])
          setMeta(m)
        }
      })
      .catch(e => {
        if (!cancelled) {
          setListError(e.message || 'Failed to load courses')
          setCourses([])
        }
      })
      .finally(() => {
        if (!cancelled) setListLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [subParam, isAllCourses, page, courseSlug, courseIdParam])

  const flatLessons = useMemo(
    () => (courseDetail ? buildLessonNav(courseDetail) : []),
    [courseDetail],
  )

  const activeLessonIndex = useMemo(() => {
    if (!lessonParam || !flatLessons.length) return -1
    return flatLessons.findIndex(({ lesson }) => String(lesson.id) === String(lessonParam))
  }, [lessonParam, flatLessons])

  useEffect(() => {
    if (!courseDetail || !lessonParam) return
    const topics = Array.isArray(courseDetail.topics) ? courseDetail.topics : []
    for (const topic of topics) {
      const lessons = Array.isArray(topic.lessons) ? topic.lessons : []
      if (lessons.some(l => String(l.id) === String(lessonParam))) {
        setOpenTopicId(String(topic.id))
        return
      }
    }
  }, [courseDetail, lessonParam])

  useEffect(() => {
    if (!courseDetail || lessonParam) return
    const topics = Array.isArray(courseDetail.topics) ? courseDetail.topics : []
    if (topics[0]?.id) setOpenTopicId(String(topics[0].id))
  }, [courseDetail, lessonParam])

  const lessonPlayerCtx = useMemo(() => {
    const o = { cat: catParam, sub: subParam, course: courseSlug }
    if (courseIdParam) o.course_id = courseIdParam
    return o
  }, [catParam, subParam, courseSlug, courseIdParam])

  useEffect(() => {
    const inPlayer = !!(courseSlug || courseIdParam)
    if (!inPlayer) {
      setLessonEnrichment(null)
      setLessonEnrichmentLoading(false)
      return
    }
    if (!courseDetail?.id || !lessonParam) {
      setLessonEnrichment(null)
      setLessonEnrichmentLoading(false)
      return
    }
    const base = findLessonInCourse(courseDetail, lessonParam)
    if (!base) {
      setLessonEnrichment(null)
      setLessonEnrichmentLoading(false)
      return
    }
    if (lessonHasDisplayContent(base)) {
      setLessonEnrichment(null)
      setLessonEnrichmentLoading(false)
      return
    }
    let cancelled = false
    setLessonEnrichment(null)
    setLessonEnrichmentLoading(true)
    getPublicCourseLesson(courseDetail.id, lessonParam)
      .then(extra => {
        if (cancelled || !extra || typeof extra !== 'object') return
        setLessonEnrichment(extra)
      })
      .catch(() => {
        if (!cancelled) setLessonEnrichment(null)
      })
      .finally(() => {
        if (!cancelled) setLessonEnrichmentLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [courseSlug, courseIdParam, courseDetail?.id, lessonParam])

  /* ─── Course player mode (?course= or ?course_id=) ─── */
  if (courseSlug || courseIdParam) {
    if (courseDetailLoading && !courseDetail) {
      return (
        <div className="itopics-wrap">
          <p className="api-state" style={{ gridColumn: '1 / -1', padding: 24 }}>Loading course…</p>
        </div>
      )
    }

    if (courseLoadError || !courseDetail) {
      return (
        <div className="itopics-wrap">
          <div style={{ gridColumn: '1 / -1', padding: 24 }}>
            <p className="api-state api-state--error">{courseLoadError || 'Course unavailable.'}</p>
            <Link to="/courses" className="btn btn-ghost" style={{ marginTop: 12, display: 'inline-block' }}>← Courses</Link>
          </div>
        </div>
      )
    }

    const topics = Array.isArray(courseDetail.topics) ? courseDetail.topics : []
    const row = activeLessonIndex >= 0 ? flatLessons[activeLessonIndex] : null
    const lesson = row?.lesson
    const lessonForBody =
      lesson && lessonEnrichment ? { ...lesson, ...lessonEnrichment } : lesson
    const topic = row?.topic
    const serial = activeLessonIndex >= 0 ? activeLessonIndex + 1 : 0
    const total = flatLessons.length
    const prevRow = activeLessonIndex > 0 ? flatLessons[activeLessonIndex - 1] : null
    const nextRow =
      activeLessonIndex >= 0 && activeLessonIndex < flatLessons.length - 1
        ? flatLessons[activeLessonIndex + 1]
        : null

    if (flatLessons.length === 0 && lessonParam) {
      return <Navigate to={`${TOPICS_BASE}?${buildTopicsQuery(lessonPlayerCtx)}`} replace />
    }

    if (flatLessons.length > 0 && !lessonParam) {
      const firstId = flatLessons[0].lesson.id
      return (
        <Navigate
          to={`${TOPICS_BASE}?${buildTopicsQuery({ ...lessonPlayerCtx, lesson: firstId })}`}
          replace
        />
      )
    }

    if (flatLessons.length > 0 && activeLessonIndex < 0) {
      const firstId = flatLessons[0].lesson.id
      return (
        <Navigate
          to={`${TOPICS_BASE}?${buildTopicsQuery({ ...lessonPlayerCtx, lesson: firstId })}`}
          replace
        />
      )
    }

    const listBack = () => {
      if (!subParam && !catParam) return '/courses'
      return `${TOPICS_BASE}?${buildTopicsQuery({ cat: catParam, sub: subParam })}`
    }

    const lessonQs = lid => `${TOPICS_BASE}?${buildTopicsQuery({ ...lessonPlayerCtx, lesson: lid })}`
    const thumb = publicCourseThumbnailUrl(courseDetail)

    return (
      <div className="itopics-wrap">
        <aside className="itopics-sidebar">
          <div className="itopics-sidebar-inner">
            <h3 className="itopics-sidebar-heading">Topics</h3>
            <p className="course-sidebar-course-title">{courseDetail.title}</p>
            <Link to={listBack()} className="itopics-sub-link course-sidebar-back-link">
              <i className="fa-solid fa-arrow-left" /> Back to course list
            </Link>
            {topics.map(t => {
              const tLessons = Array.isArray(t.lessons) ? t.lessons : []
              const isOpen = openTopicId === String(t.id)
              return (
                <div className={`itopics-cat${isOpen ? ' is-open' : ''}`} key={t.id}>
                  <button
                    type="button"
                    className="itopics-cat-header itopics-cat-header--topic"
                    aria-expanded={isOpen}
                    onClick={() => setOpenTopicId(isOpen ? '' : String(t.id))}
                  >
                    <span className="itopics-cat-title-text">{t.title}</span>
                    <span className="itopics-cat-header-trail">
                      <span className="itopics-count">{tLessons.length}</span>
                      <i className="fa-solid fa-chevron-down itopics-chevron" />
                    </span>
                  </button>
                  {isOpen && (
                    <ul className="itopics-sub-list">
                      {tLessons.length === 0 && (
                        <li><span className="muted itopics-lesson-empty">No lessons yet</span></li>
                      )}
                      {tLessons.map(l => (
                        <li key={l.id}>
                          <Link
                            to={lessonQs(l.id)}
                            className={`itopics-sub-link${String(l.id) === String(lessonParam) ? ' is-active' : ''}`}
                          >
                            {l.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
            {!topics.length && (
              <p className="muted" style={{ padding: '8px 12px', fontSize: 13 }}>No topics published.</p>
            )}
          </div>
        </aside>

        <div className="itopics-main">
          <div className="itopics-topbar">
            <nav className="itopics-breadcrumb" aria-label="Breadcrumb">
              <Link to="/courses">Courses</Link>
              <i className="fa-solid fa-chevron-right" />
              {isAllCourses ? (
                <Link to={listBack()}>All courses</Link>
              ) : crumbSelection ? (
                <>
                  <span>{crumbSelection.root.name}</span>
                  <i className="fa-solid fa-chevron-right" />
                  <span>{crumbSelection.sub.name}</span>
                </>
              ) : (
                <Link to={listBack()}>Browse</Link>
              )}
              <i className="fa-solid fa-chevron-right" />
              <span>{courseDetail.title}</span>
              {lesson && (
                <>
                  <i className="fa-solid fa-chevron-right" />
                  <span>L{String(serial).padStart(2, '0')}</span>
                </>
              )}
            </nav>

            {total > 0 && (
              <div className="idetail-progress" aria-label={`Lesson ${serial} of ${total}`} style={{ marginTop: 12 }}>
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

          <article className="idetail-card course-topics-main-card">
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
                <span className={`course-detail-price-inline ${courseDetail.is_free ? 'is-free' : ''}`}>
                  {formatCoursePrice(courseDetail)}
                </span>
              </div>
              <h1 className="idetail-question">{lesson ? lesson.title : courseDetail.title}</h1>
            </div>

            {activeLessonIndex === 0 && courseDetail.description && (
              <>
                <div className="idetail-divider">
                  <span><i className="fa-solid fa-circle-info" /> About this course</span>
                </div>
                <div
                  className="post-content post-content--html idetail-answer"
                  dangerouslySetInnerHTML={{ __html: courseDetail.description }}
                />
              </>
            )}

            {lesson && (
              <>
                <div className="idetail-divider">
                  <span><i className="fa-solid fa-book-open" /> Lesson</span>
                </div>
                {lessonEnrichmentLoading && !lessonHasDisplayContent(lessonForBody) && (
                  <p className="api-state" style={{ padding: '12px 0' }}>Loading lesson content…</p>
                )}
                <CourseLessonBody lesson={lessonForBody} />
              </>
            )}

            {!lesson && !flatLessons.length && courseDetail.description && (
              <div
                className="post-content post-content--html idetail-answer"
                dangerouslySetInnerHTML={{ __html: courseDetail.description }}
              />
            )}

            {!lesson && !flatLessons.length && !courseDetail.description && (
              <p className="muted">This course has no public lessons yet.</p>
            )}

            {flatLessons.length > 0 && (
              <div className="idetail-card-footer">
                <div className="idetail-nav">
                  {prevRow
                    ? (
                      <Link to={lessonQs(prevRow.lesson.id)} className="idetail-nav-item idetail-nav-item--prev">
                        <span className="idetail-nav-label"><i className="fa-solid fa-arrow-left" /> Previous</span>
                        <span className="idetail-nav-title">{prevRow.lesson.title}</span>
                      </Link>
                    )
                    : <div />}
                  {nextRow
                    ? (
                      <Link to={lessonQs(nextRow.lesson.id)} className="idetail-nav-item idetail-nav-item--next">
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
    )
  }

  /* ─── Catalog mode (category sidebar + course list) ─── */
  if (loadingTree && !roots.length && !treeError) {
    return (
      <div className="itopics-wrap">
        <p className="api-state" style={{ gridColumn: '1 / -1' }}>Loading…</p>
      </div>
    )
  }

  if (treeError && !roots.length) {
    return (
      <div className="itopics-wrap">
        <p className="api-state api-state--error" style={{ gridColumn: '1 / -1' }}>{treeError}</p>
      </div>
    )
  }

  if (!roots.length) {
    return (
      <div className="itopics-wrap">
        <p className="api-state" style={{ gridColumn: '1 / -1' }}>No categories yet.</p>
      </div>
    )
  }

  if (!subParam) {
    const first = firstSelectable(roots)
    if (first) {
      return (
        <Navigate
          to={`${TOPICS_BASE}?cat=${encodeURIComponent(first.root.id)}&sub=${encodeURIComponent(first.sub.id)}`}
          replace
        />
      )
    }
  }

  if (subParam && !isAllCourses && !selection) {
    const first = firstSelectable(roots)
    if (first) {
      return (
        <Navigate
          to={`${TOPICS_BASE}?cat=${encodeURIComponent(first.root.id)}&sub=${encodeURIComponent(first.sub.id)}`}
          replace
        />
      )
    }
  }

  if (!isAllCourses && selection && (!catParam || String(catParam) !== String(selection.root.id))) {
    return (
      <Navigate
        to={`${TOPICS_BASE}?cat=${encodeURIComponent(selection.root.id)}&sub=${encodeURIComponent(selection.sub.id)}`}
        replace
      />
    )
  }

  const currentRoot = isAllCourses ? null : selection?.root
  const currentSub = isAllCourses ? null : selection?.sub
  const filterLabel = isAllCourses ? 'All courses' : currentSub?.name || 'Courses'

  const subIndex =
    currentRoot && currentSub
      ? (subsOf(currentRoot).length ? subsOf(currentRoot).findIndex(s => String(s.id) === String(currentSub.id)) : 0)
      : -1
  const subs = currentRoot ? subsOf(currentRoot) : []
  const prevSub = subIndex > 0 ? subs[subIndex - 1] : null
  const nextSub = subIndex >= 0 && subIndex < subs.length - 1 ? subs[subIndex + 1] : null

  const listState = { cat: catParam || (currentRoot ? String(currentRoot.id) : ''), sub: String(subParam) }
  const listStateWithCourse = course => ({
    ...listState,
    course: course.slug || String(course.id),
    course_id: String(course.id),
  })

  return (
    <div className="itopics-wrap">
      <aside className="itopics-sidebar">
        <div className="itopics-sidebar-inner">
          <h3 className="itopics-sidebar-heading">Categories</h3>
          <ul className="itopics-sub-list itopics-sub-list--root">
            <li>
              <Link
                to={`${TOPICS_BASE}?sub=all`}
                className={`itopics-sub-link${isAllCourses ? ' is-active' : ''}`}
                onClick={() => setOpenCat('')}
              >
                All courses
                <span className="itopics-count">—</span>
              </Link>
            </li>
          </ul>
          {roots.map(root => {
            const isActiveRoot = !isAllCourses && currentRoot && String(currentRoot.id) === String(root.id)
            const isOpen = openCat === String(root.id)
            const rootSubs = subsOf(root)
            return (
              <div className={`itopics-cat${isOpen ? ' is-open' : ''}`} key={root.id}>
                <button
                  className={`itopics-cat-header${isActiveRoot ? ' is-active' : ''}`}
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenCat(isOpen ? '' : String(root.id))}
                >
                  <span>{root.name}</span>
                  <i className="fa-solid fa-chevron-down itopics-chevron" />
                </button>
                {isOpen && (
                  <ul className="itopics-sub-list">
                    {rootSubs.length === 0 && (
                      <li key={`leaf-${root.id}`}>
                        <Link
                          to={topicsQs({ cat: String(root.id), sub: String(root.id) })}
                          className={`itopics-sub-link${!isAllCourses && String(currentSub?.id) === String(root.id) ? ' is-active' : ''}`}
                        >
                          {root.name}
                          <span className="itopics-count">{subCountLabel(root)}</span>
                        </Link>
                      </li>
                    )}
                    {rootSubs.map(sub => {
                      const isActiveSub = !isAllCourses && String(sub.id) === String(subParam)
                      return (
                        <li key={sub.id}>
                          <Link
                            to={topicsQs({ cat: String(root.id), sub: String(sub.id) })}
                            className={`itopics-sub-link${isActiveSub ? ' is-active' : ''}`}
                          >
                            {sub.name}
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
            <Link to="/courses">Courses</Link>
            <i className="fa-solid fa-chevron-right" />
            {isAllCourses ? (
              <span>All courses</span>
            ) : (
              <>
                <span>{currentRoot?.name}</span>
                <i className="fa-solid fa-chevron-right" />
                <span>{currentSub?.name}</span>
              </>
            )}
          </nav>
          <h1 className="itopics-heading">
            {filterLabel}
            <span className="itopics-heading-count">
              {meta?.total != null ? `${meta.total} Courses` : `${courses.length} Courses`}
            </span>
          </h1>
        </div>

        {listError && (
          <p className="api-state api-state--error">{listError}</p>
        )}

        <div className="itopics-question-list">
          {listLoading && (
            <p className="api-state" style={{ padding: '24px 0' }}>Loading courses…</p>
          )}
          {!listLoading && !listError && courses.length === 0 && (
            <p className="api-state" style={{ padding: '24px 0' }}>No published courses in this category yet.</p>
          )}
          {!listLoading && courses.map((course, qi) => {
            const slug = course.slug || String(course.id)
            const thumb = publicCourseThumbnailUrl(course)
            const openCourseQs = buildTopicsQuery({
              cat: catParam,
              sub: subParam,
              course: slug,
              course_id: course.id,
            })
            return (
              <div className={`itopics-question${openRow === qi ? ' is-open' : ''}`} key={course.id}>
                <div className="itopics-question-headrow">
                  <button
                    className="itopics-question-toggle"
                    type="button"
                    aria-expanded={openRow === qi}
                    onClick={() => setOpenRow(openRow === qi ? null : qi)}
                  >
                    <span className="itopics-q-num">{String(qi + 1).padStart(2, '0')}</span>
                    <span className="itopics-q-text">{course.title}</span>
                    <span className={`course-list-price-pill${course.is_free ? ' is-free' : ''}`}>{formatCoursePrice(course)}</span>
                    <i className="fa-solid fa-chevron-down itopics-q-chevron" />
                  </button>
                  <Link
                    to={`${TOPICS_BASE}?${openCourseQs}`}
                    state={{ fromCourses: listStateWithCourse(course) }}
                    className="itopics-detail-link"
                    aria-label="Open course"
                  >
                    <i className="fa-solid fa-arrow-up-right" />
                  </Link>
                </div>
                {openRow === qi && (
                  <div className="itopics-answer">
                    {thumb && (
                      <div
                        className="course-list-preview-thumb"
                        style={{ backgroundImage: `url(${thumb})` }}
                        role="img"
                        aria-hidden
                      />
                    )}
                    <p className="itopics-answer-preview">{publicCourseExcerpt(course, 280)}</p>
                    <Link
                      to={`${TOPICS_BASE}?${openCourseQs}`}
                      state={{ fromCourses: listStateWithCourse(course) }}
                      className="itopics-read-more"
                    >
                      View course <i className="fa-solid fa-arrow-up-right" />
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {meta && meta.last_page > 1 && (
          <div className="courses-pagination">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="courses-pagination-info">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={page >= meta.last_page}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        )}

        {!isAllCourses && currentRoot && subs.length > 1 && (
          <div className="itopics-subnav">
            {prevSub
              ? (
                <Link
                  to={topicsQs({ cat: String(currentRoot.id), sub: String(prevSub.id) })}
                  className="itopics-subnav-item itopics-subnav-item--prev"
                >
                  <span className="itopics-subnav-label"><i className="fa-solid fa-arrow-left" /> Previous category</span>
                  <span className="itopics-subnav-title">{prevSub.name}</span>
                </Link>
              )
              : <div />}
            {nextSub
              ? (
                <Link
                  to={topicsQs({ cat: String(currentRoot.id), sub: String(nextSub.id) })}
                  className="itopics-subnav-item itopics-subnav-item--next"
                >
                  <span className="itopics-subnav-label">Next category <i className="fa-solid fa-arrow-right" /></span>
                  <span className="itopics-subnav-title">{nextSub.name}</span>
                </Link>
              )
              : <div />}
          </div>
        )}
      </div>
    </div>
  )
}
