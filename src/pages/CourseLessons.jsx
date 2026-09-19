import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createTopicLesson,
  getCourseCurrentUser,
  getCourseTopics,
  getMyCourse,
  getTopicLessons,
} from '../lib/courseApi'

const initialMeta = {
  title: '',
  content_type: 'text',
  youtube_url: '',
  duration_seconds: '',
}

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function LessonRichToolbar({ editorRef }) {
  function run(cmd, val) {
    if (!editorRef.current) return
    editorRef.current.focus()
    document.execCommand(cmd, false, val ?? undefined)
  }
  function promptLink() {
    const url = window.prompt('URL', 'https://')
    if (url) run('createLink', url)
  }
  return (
    <div className="course-rich-toolbar course-rich-toolbar--expanded">
      <div className="course-rich-toolbar-row">
        <div className="course-rich-toolbar-group">
          <button type="button" onClick={() => run('bold')}><i className="fa-solid fa-bold" /></button>
          <button type="button" onClick={() => run('italic')}><i className="fa-solid fa-italic" /></button>
          <button type="button" onClick={() => run('underline')}><i className="fa-solid fa-underline" /></button>
          <button type="button" onClick={() => run('insertUnorderedList')}><i className="fa-solid fa-list-ul" /></button>
          <button type="button" onClick={() => run('insertOrderedList')}><i className="fa-solid fa-list-ol" /></button>
          <button type="button" onClick={promptLink}><i className="fa-solid fa-link" /></button>
        </div>
        <div className="course-rich-toolbar-group course-rich-toolbar-colors">
          <label className="course-rich-color">
            <i className="fa-solid fa-font" />
            <input type="color" onChange={e => run('foreColor', e.target.value)} aria-label="Text color" />
          </label>
          <label className="course-rich-color">
            <i className="fa-solid fa-highlighter" />
            <input type="color" onChange={e => run('hiliteColor', e.target.value)} aria-label="Highlight" />
          </label>
        </div>
      </div>
    </div>
  )
}

export default function CourseLessons() {
  const { courseId, topicId } = useParams()
  const navigate = useNavigate()
  const lessonBodyRef = useRef(null)
  const lessonBodyHtmlRef = useRef('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [courseTitle, setCourseTitle] = useState('')
  const [topics, setTopics] = useState([])
  const [topicTitle, setTopicTitle] = useState('')
  const [lessons, setLessons] = useState([])
  const [meta, setMeta] = useState(initialMeta)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!courseId || !topicId) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError('')
      try {
        const user = await getCourseCurrentUser()
        if (cancelled) return
        if (!user?.id) {
          navigate('/course', { replace: true })
          return
        }
        const [course, topicRows, lessonRows] = await Promise.all([
          getMyCourse(courseId).catch(() => null),
          getCourseTopics(courseId),
          getTopicLessons(courseId, topicId),
        ])
        if (cancelled) return
        setCourseTitle(course?.title || `Course #${courseId}`)
        const list = Array.isArray(topicRows) ? topicRows : []
        setTopics(list)
        const topic = list.find(t => String(t.id) === String(topicId))
        setTopicTitle(topic?.title || `Topic #${topicId}`)
        setLessons(Array.isArray(lessonRows) ? lessonRows : [])
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [courseId, topicId, navigate])

  function onLessonBodyInput() {
    if (lessonBodyRef.current) lessonBodyHtmlRef.current = lessonBodyRef.current.innerHTML
  }

  function onMetaInput(e) {
    const { name, value } = e.target
    setMeta(prev => ({ ...prev, [name]: value }))
  }

  async function onCreateLesson(e) {
    e.preventDefault()
    if (lessonBodyRef.current) lessonBodyHtmlRef.current = lessonBodyRef.current.innerHTML
    setError('')
    if (!meta.title.trim()) {
      setError('Lesson title is required.')
      return
    }
    setBusy(true)
    try {
      await createTopicLesson(courseId, topicId, {
        title: meta.title.trim(),
        content_type: meta.content_type,
        content: lessonBodyHtmlRef.current || '',
        youtube_url: meta.content_type === 'youtube' ? meta.youtube_url : '',
        duration_seconds: meta.duration_seconds ? Number(meta.duration_seconds) : null,
      })
      const rows = await getTopicLessons(courseId, topicId)
      setLessons(Array.isArray(rows) ? rows : [])
      setMeta(initialMeta)
      if (lessonBodyRef.current) {
        lessonBodyRef.current.innerHTML = ''
        lessonBodyHtmlRef.current = ''
      }
    } catch (err) {
      setError(err.message || 'Could not create lesson')
    } finally {
      setBusy(false)
    }
  }

  async function runDemoAiBuilder() {
    setAiGenerating(true)
    setError('')
    try {
      await new Promise(r => setTimeout(r, 600))
      const focus = aiPrompt.trim()
      const safeTopic = escapeHtml(topicTitle)
      const safeCourse = escapeHtml(courseTitle)
      const focusBlock = focus
        ? `<p><strong>Learner focus:</strong> ${escapeHtml(focus)}</p>`
        : ''
      const html = `
<h2>Lesson overview</h2>
${focusBlock}
<p>This lesson is part of <strong>${safeCourse}</strong> → <strong>${safeTopic}</strong>.</p>
<ul><li>Key idea</li><li>Practice step</li><li>Check your understanding</li></ul>`
      if (lessonBodyRef.current) {
        lessonBodyRef.current.innerHTML = html
        lessonBodyHtmlRef.current = html
      }
      setMeta(prev => ({ ...prev, title: prev.title || `Introduction to ${topicTitle}` }))
    } finally {
      setAiGenerating(false)
    }
  }

  if (loading) {
    return (
      <section className="course-lesson-page">
        <div className="container">
          <p className="api-state">Loading…</p>
        </div>
      </section>
    )
  }

  return (
    <section className="course-lesson-page">
      <div className="container">
        <nav className="course-lesson-breadcrumb" aria-label="Breadcrumb">
          <Link to="/course">Course studio</Link>
          <span className="course-bc-sep">/</span>
          <Link to={`/course?tab=list&course=${encodeURIComponent(courseId)}`}>My courses</Link>
          <span className="course-bc-sep">/</span>
          <span className="course-bc-current">{courseTitle}</span>
          <span className="course-bc-sep">/</span>
          <span className="course-bc-current">{topicTitle}</span>
        </nav>

        {error && <p className="api-state api-state--error">{error}</p>}

        <div className="course-lesson-layout">
          <aside className="course-lesson-sidebar panel">
            <h4>Topics</h4>
            <p className="course-lesson-sidebar-hint">Jump to another topic to edit its lessons.</p>
            <ul className="course-lesson-topic-nav">
              {topics.map(t => (
                <li key={t.id}>
                  <Link
                    to={`/course/${courseId}/topic/${t.id}/lessons`}
                    className={String(t.id) === String(topicId) ? 'is-active' : ''}
                  >
                    {t.title}
                    <span className="course-lesson-topic-sort">#{t.sort_order ?? ''}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div>
            <form className="course-lesson-form panel" onSubmit={onCreateLesson}>
              <div className="course-panel-head">
                <h4>New lesson</h4>
                <span className="course-panel-tag course-panel-tag--ai">Rich text + video</span>
              </div>
              <div className="course-form-grid">
                <label className="course-field">
                  <span>Title</span>
                  <input name="title" value={meta.title} onChange={onMetaInput} required />
                </label>
                <label className="course-field">
                  <span>Type</span>
                  <select name="content_type" className="course-select" value={meta.content_type} onChange={onMetaInput}>
                    <option value="text">Text / HTML</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </label>
                {meta.content_type === 'youtube' && (
                  <label className="course-field">
                    <span>YouTube URL</span>
                    <input name="youtube_url" value={meta.youtube_url} onChange={onMetaInput} placeholder="https://..." />
                  </label>
                )}
                <label className="course-field">
                  <span>Duration (seconds)</span>
                  <input name="duration_seconds" type="number" value={meta.duration_seconds} onChange={onMetaInput} />
                </label>
              </div>

              {meta.content_type === 'text' && (
                <>
                  <div className="course-ai-builder">
                    <p className="course-ai-builder-note">Demo lesson builder: optional focus, then generate a starter outline.</p>
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder="What should this lesson emphasize?"
                      style={{ width: '100%', maxWidth: 480, marginBottom: 8, padding: '8px 12px', borderRadius: 8, border: '1px solid #e5eaf5' }}
                    />
                    <button type="button" className="btn btn-teal" onClick={runDemoAiBuilder} disabled={aiGenerating}>
                      {aiGenerating ? 'Generating…' : 'Generate demo HTML'}
                    </button>
                  </div>
                  <label className="course-field">
                    <span>Content</span>
                    <div className="course-rich-wrap">
                      <LessonRichToolbar editorRef={lessonBodyRef} />
                      <div
                        ref={lessonBodyRef}
                        className="course-rich-editor course-rich-editor--lesson"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={onLessonBodyInput}
                        onBlur={onLessonBodyInput}
                      />
                    </div>
                  </label>
                </>
              )}

              <button type="submit" className="btn btn-primary" disabled={busy}>Save lesson</button>
            </form>

            <div className="course-lesson-list-panel panel">
              <h4>Lessons in this topic</h4>
              <ul className="course-lesson-cards">
                {lessons.map(lesson => (
                  <li key={lesson.id} className="course-lesson-card">
                    <div>
                      <strong>{lesson.title}</strong>
                      <div className="course-lesson-card-meta">{lesson.content_type || 'text'}</div>
                    </div>
                  </li>
                ))}
              </ul>
              {!lessons.length && <p className="muted">No lessons yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
