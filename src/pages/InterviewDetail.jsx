import { useEffect, useState } from 'react'
import { Link, useSearchParams, Navigate } from 'react-router-dom'
import { apiGet, apiPost } from '../lib/api'
import {
  mapInterviewCategoriesApi,
  findCategoryBySlug,
  findSubBySlug,
  mapQuestionsFromApi,
  mapWebInterviewDetail,
} from '../lib/interviewMappers'

function InterviewAnswerBody({ content }) {
  if (!content) return <p>—</p>
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return <div className="interview-body-html" dangerouslySetInnerHTML={{ __html: content }} />
  }
  return <p>{content}</p>
}

function detailHref(catSlug, subSlug, qIdx, questionId) {
  return `/interview/detail?cat=${encodeURIComponent(catSlug)}&sub=${encodeURIComponent(subSlug)}&q=${qIdx}&question_id=${encodeURIComponent(questionId)}`
}

function searchParamDecoded(key, params) {
  const raw = params.get(key)
  if (raw == null) return ''
  const t = String(raw).trim()
  if (!t) return ''
  try {
    return decodeURIComponent(t.replace(/\+/g, ' '))
  } catch {
    return t
  }
}

function InterviewDetailLoading({ compact }) {
  return (
    <div
      className={`idetail-loading-wrap${compact ? ' idetail-loading-wrap--compact' : ''}`}
      role="status"
      aria-label="Loading"
    >
      <span className="idetail-loading-motion">
        <span className={`spinner${compact ? ' spinner--sm' : ''}`} aria-hidden="true" />
      </span>
    </div>
  )
}

export default function InterviewDetail() {
  const [params] = useSearchParams()
  const catSlug = searchParamDecoded('cat', params)
  const subSlug = searchParamDecoded('sub', params)
  const questionIdParamRaw = params.get('question_id')
  const questionIdParam =
    questionIdParamRaw != null && String(questionIdParamRaw).trim() !== ''
      ? String(questionIdParamRaw).trim()
      : ''
  /** `q` is 0-based index in the topic’s question list (question 1 → q=0). */
  const qRaw = params.get('q')
  const qParam = qRaw !== null && qRaw !== '' ? parseInt(String(qRaw).trim(), 10) : NaN

  const [categories, setCategories] = useState([])
  const [questions, setQuestions] = useState([])
  const [questionsMeta, setQuestionsMeta] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const [loading, setLoading] = useState(true)
  const [questionsLoading, setQuestionsLoading] = useState(false)
  /** Avoid redirecting before the first `questions` response for the active sub (effect runs after paint). */
  const [questionsLoadedForSubId, setQuestionsLoadedForSubId] = useState(null)
  const [error, setError] = useState(null)

  const currentCat = categories.length ? findCategoryBySlug(categories, catSlug) : null
  const currentSub = currentCat ? findSubBySlug(currentCat, subSlug) : null

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
      setQuestionsMeta(null)
      setQuestionsLoading(false)
      setQuestionsLoadedForSubId(null)
      return
    }
    let cancelled = false
    const subId = currentSub.id
    setQuestionsLoading(true)
    setQuestionsLoadedForSubId(null)
    apiGet(`web/interview-categories/${subId}/questions`)
      .then(data => {
        if (cancelled) return
        setQuestionsMeta(
          data
            ? {
                category: data.category,
                total: data.total,
              }
            : null,
        )
        setQuestions(mapQuestionsFromApi(data?.questions))
      })
      .catch(() => {
        if (!cancelled) {
          setQuestions([])
          setQuestionsMeta(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setQuestionsLoading(false)
          setQuestionsLoadedForSubId(subId)
        }
      })
    return () => { cancelled = true }
  }, [currentSub?.id])

  const qIndex =
    Number.isInteger(qParam) && qParam >= 0 && qParam < questions.length
      ? qParam
      : -1
  const questionFromList = qIndex >= 0 ? questions[qIndex] : null

  const questionIdNum = questionIdParam !== '' ? Number(questionIdParam) : NaN

  useEffect(() => {
    if (!catSlug || !subSlug || !questionFromList?.id) {
      setDetail(null)
      return
    }
    if (!Number.isFinite(questionIdNum) || Number(questionIdNum) !== Number(questionFromList.id)) {
      setDetail(null)
      return
    }
    let cancelled = false
    setDetailLoading(true)
    setDetail(null)
    const qs = new URLSearchParams({
      cat: catSlug,
      sub: subSlug,
      q: String(qParam),
      question_id: String(questionFromList.id),
    })
    apiGet(`web/interview-detail?${qs.toString()}`)
      .then(data => {
        if (!cancelled) setDetail(mapWebInterviewDetail(data))
      })
      .catch(() => {
        if (!cancelled) setDetail(null)
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false)
      })
    return () => { cancelled = true }
  }, [catSlug, subSlug, qParam, questionFromList?.id, questionIdNum])

  const displayTitle = detail?.question?.title ?? questionFromList?.q ?? ''
  const displayBody = detail?.question?.description ?? questionFromList?.a ?? ''
  const trackId = detail?.question?.id ?? questionFromList?.id

  useEffect(() => {
    if (!trackId) return
    apiPost(`interview-list/${trackId}/view`, {}).catch(() => {})
  }, [trackId])

  if (loading && !categories.length) {
    return (
      <div className="idetail-wrap">
        <InterviewDetailLoading />
      </div>
    )
  }

  if (error && !categories.length) {
    return (
      <div className="idetail-wrap">
        <p className="api-state api-state--error" style={{ gridColumn: '1 / -1' }}>{error}</p>
      </div>
    )
  }

  if (!currentCat || !currentSub) {
    return (
      <div className="idetail-wrap">
        <div className="container">
          <p className="api-state api-state--error">
            No category matched <strong>{catSlug || '—'}</strong> / <strong>{subSlug || '—'}</strong>.
            Check the URL or open the topic from the list.
          </p>
          <p className="api-state" style={{ paddingTop: 0 }}>
            <Link to="/interview">← Interview home</Link>
            {catSlug && subSlug && (
              <>
                {' · '}
                <Link to={`/interview/topics?cat=${encodeURIComponent(catSlug)}&sub=${encodeURIComponent(subSlug)}`}>
                  Topics for this path
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    )
  }

  const listUrlEarly = `/interview/topics?cat=${encodeURIComponent(catSlug)}&sub=${encodeURIComponent(subSlug)}`

  const questionsReadyForSub =
    !currentSub?.id || questionsLoadedForSubId === currentSub.id

  if (questionsLoading || !questionsReadyForSub) {
    return (
      <div className="idetail-wrap">
        <InterviewDetailLoading />
      </div>
    )
  }

  /** `question_id` is authoritative list position when it disagrees with `q`. */
  if (questions.length > 0 && Number.isFinite(questionIdNum)) {
    const idxByQuestionId = questions.findIndex(x => Number(x.id) === Number(questionIdNum))
    if (idxByQuestionId >= 0 && idxByQuestionId !== qParam) {
      return <Navigate to={detailHref(catSlug, subSlug, idxByQuestionId, questionIdNum)} replace />
    }
  }

  /** Old links used DB id in `q`; redirect to index + question_id. */
  if (
    questions.length > 0
    && qIndex < 0
    && Number.isFinite(qParam)
    && Number.isInteger(qParam)
    && qParam >= 0
  ) {
    const byId = questions.findIndex(x => Number(x.id) === Number(qParam))
    if (byId >= 0) {
      return <Navigate to={detailHref(catSlug, subSlug, byId, questions[byId].id)} replace />
    }
  }

  if (!Number.isInteger(qParam) || qParam < 0 || !questionFromList) {
    return <Navigate to={listUrlEarly} replace />
  }

  if (!questionIdParam || !Number.isFinite(questionIdNum)) {
    return <Navigate to={detailHref(catSlug, subSlug, qParam, questionFromList.id)} replace />
  }

  if (Number(questionIdNum) !== Number(questionFromList.id)) {
    return <Navigate to={detailHref(catSlug, subSlug, qParam, questionFromList.id)} replace />
  }

  const listTotal = questionsMeta?.total ?? questions.length
  const serial = detail?.position?.serial != null ? detail.position.serial : qIndex + 1
  const totalShown = detail?.position?.total != null ? detail.position.total : listTotal

  const bc = detail?.category
  const breadcrumbParent = bc?.parent?.name ?? currentCat.title
  const breadcrumbSub = bc?.sub?.name ?? questionsMeta?.category?.name ?? currentSub.label
  const sidebarTitle = questionsMeta?.category?.name ?? currentSub.label

  let prevLinkIdx = -1
  let nextLinkIdx = -1
  if (detail?.navigation) {
    if (detail.navigation.prev_question_id != null && Number.isFinite(detail.navigation.prev_question_id)) {
      prevLinkIdx = questions.findIndex(x => Number(x.id) === Number(detail.navigation.prev_question_id))
    }
    if (detail.navigation.next_question_id != null && Number.isFinite(detail.navigation.next_question_id)) {
      nextLinkIdx = questions.findIndex(x => Number(x.id) === Number(detail.navigation.next_question_id))
    }
  }
  if (prevLinkIdx < 0 && qIndex > 0) prevLinkIdx = qIndex - 1
  if (nextLinkIdx < 0 && qIndex < questions.length - 1) nextLinkIdx = qIndex + 1

  const prevRow = prevLinkIdx >= 0 ? questions[prevLinkIdx] : null
  const nextRow = nextLinkIdx >= 0 ? questions[nextLinkIdx] : null

  return (
    <div className="idetail-wrap">
      <aside className="idetail-sidebar">
        <div className="idetail-sidebar-inner">
          <Link to={listUrlEarly} className="idetail-back">
            <i className="fa-solid fa-arrow-left" /> Back to List
          </Link>
          <h3 className="idetail-sidebar-heading">
            {sidebarTitle}
            <span className="idetail-sidebar-count">{listTotal}</span>
          </h3>
          <nav className="idetail-q-nav" aria-label="Questions in this topic">
            {questions.map((q, i) => (
              <Link
                key={q.id}
                to={detailHref(catSlug, subSlug, i, q.id)}
                className={`idetail-q-nav-item${i === qIndex ? ' is-active' : ''}`}
                aria-current={i === qIndex ? 'page' : undefined}
              >
                <span className="idetail-q-nav-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="idetail-q-nav-text">{q.q}</span>
                {i === qIndex && <i className="fa-solid fa-chevron-right idetail-q-nav-arrow" />}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="idetail-main">
        <div className="idetail-content">
          <div className="idetail-pagehead">
            <nav className="itopics-breadcrumb" aria-label="Breadcrumb">
              <Link to="/interview">Interview</Link>
              <i className="fa-solid fa-chevron-right" />
              <Link to={`/interview/topics?cat=${encodeURIComponent(catSlug)}`}>{breadcrumbParent}</Link>
              <i className="fa-solid fa-chevron-right" />
              <Link to={listUrlEarly}>{breadcrumbSub}</Link>
              <i className="fa-solid fa-chevron-right" />
              <span>Q{serial}</span>
            </nav>

            <div className="idetail-progress" aria-label={`Question ${serial} of ${totalShown}`}>
              <div className="idetail-progress-track">
                <div
                  className="idetail-progress-fill"
                  style={{
                    width: `${totalShown ? Math.round((serial / totalShown) * 100) : 0}%`,
                  }}
                />
              </div>
              <span>{serial} / {totalShown}</span>
            </div>
          </div>

          <article className="idetail-card">
            <div className="idetail-card-header">
              <div className="idetail-q-badge">
                <span className="idetail-q-label">Question {String(serial).padStart(2, '0')}</span>
                <span className="blog-tag">{breadcrumbParent}</span>
                <span className="blog-dot" />
                <span className="blog-tag idetail-sub-tag">{breadcrumbSub}</span>
              </div>
              <h1 className="idetail-question">{displayTitle}</h1>
            </div>

            <div className="idetail-divider">
              <span><i className="fa-solid fa-lightbulb" /> Answer</span>
            </div>

            <div className="idetail-answer">
              <InterviewAnswerBody content={displayBody} />
            </div>

            <div className="idetail-tip">
              <i className="fa-solid fa-circle-check" />
              <div>
                <strong>Interview Tip</strong>
                <p>Structure your answer clearly. Start with a definition, give a real-world example, and connect it to business impact. Keep it concise — aim for 60 to 90 seconds when speaking.</p>
              </div>
            </div>

            <div className="idetail-card-footer">
              <div className="idetail-nav">
                {prevRow
                  ? (
                    <Link
                      to={detailHref(catSlug, subSlug, prevLinkIdx, prevRow.id)}
                      className="idetail-nav-item idetail-nav-item--prev"
                    >
                      <span className="idetail-nav-label"><i className="fa-solid fa-arrow-left" /> Previous</span>
                      <span className="idetail-nav-title">{prevRow.q}</span>
                    </Link>
                  )
                  : <div />}
                {nextRow
                  ? (
                    <Link
                      to={detailHref(catSlug, subSlug, nextLinkIdx, nextRow.id)}
                      className="idetail-nav-item idetail-nav-item--next"
                    >
                      <span className="idetail-nav-label">Next <i className="fa-solid fa-arrow-right" /></span>
                      <span className="idetail-nav-title">{nextRow.q}</span>
                    </Link>
                  )
                  : <div />}
              </div>
            </div>
          </article>
        </div>

        {detailLoading && !detail && <InterviewDetailLoading compact />}
      </div>
    </div>
  )
}
