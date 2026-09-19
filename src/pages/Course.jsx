import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  createCourseTopic,
  getCourseCategories,
  createMyCourse,
  getCourseCurrentUser,
  getCourseTopics,
  getMyCourses,
  loginCourseUser,
  logoutCourseUser,
  registerCourseUser,
} from '../lib/courseApi'
import { slugify } from '../lib/slugify'

const initialCourseForm = {
  category_id: '',
  title: '',
  slug: '',
  description: '',
  is_free: true,
  price_amount: '',
  currency: 'USD',
  difficulty: 'beginner',
  status: 'draft',
}

const initialTopicForm = {
  title: '',
  description: '',
}

function RichToolbar({ editorRef, expanded }) {
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
    <div className={`course-rich-toolbar${expanded ? ' course-rich-toolbar--expanded' : ''}`}>
      <div className="course-rich-toolbar-row">
        <div className="course-rich-toolbar-group">
          <button type="button" onClick={() => run('bold')} title="Bold"><i className="fa-solid fa-bold" /></button>
          <button type="button" onClick={() => run('italic')} title="Italic"><i className="fa-solid fa-italic" /></button>
          <button type="button" onClick={() => run('underline')} title="Underline"><i className="fa-solid fa-underline" /></button>
          <button type="button" onClick={() => run('insertUnorderedList')} title="Bullet list"><i className="fa-solid fa-list-ul" /></button>
          <button type="button" onClick={() => run('insertOrderedList')} title="Numbered list"><i className="fa-solid fa-list-ol" /></button>
          <button type="button" onClick={promptLink} title="Link"><i className="fa-solid fa-link" /></button>
        </div>
        <div className="course-rich-toolbar-group course-rich-toolbar-colors">
          <label className="course-rich-color" title="Text color">
            <i className="fa-solid fa-font" />
            <input type="color" onChange={e => run('foreColor', e.target.value)} aria-label="Text color" />
          </label>
          <label className="course-rich-color" title="Highlight">
            <i className="fa-solid fa-highlighter" />
            <input type="color" onChange={e => run('hiliteColor', e.target.value)} aria-label="Highlight" />
          </label>
        </div>
      </div>
    </div>
  )
}

export default function Course() {
  const descriptionEditorRef = useRef(null)
  const descriptionHtmlRef = useRef('')
  const slugManualRef = useRef(false)
  const [tab, setTab] = useState('login')
  const [busy, setBusy] = useState(false)
  const [authUser, setAuthUser] = useState(null)
  const [error, setError] = useState('')
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [courseForm, setCourseForm] = useState(initialCourseForm)
  const [topicForm, setTopicForm] = useState(initialTopicForm)
  const [topics, setTopics] = useState([])
  const [studioTab, setStudioTab] = useState('create')
  const [searchParams] = useSearchParams()
  const [aiPrompt, setAiPrompt] = useState('')

  const selectedCourse = courses.find(c => String(c.id) === selectedCourseId) || null

  useEffect(() => {
    const t = searchParams.get('tab')
    if (t === 'list') setStudioTab('list')
    const c = searchParams.get('course')
    if (c) setSelectedCourseId(c)
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    getCourseCurrentUser()
      .then(user => {
        if (!cancelled) setAuthUser(user || null)
      })
      .catch(() => {
        if (!cancelled) setAuthUser(null)
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!authUser?.id) return
    let cancelled = false
    setCategoryLoading(true)
    getCourseCategories()
      .then(rows => {
        if (!cancelled) setCategories(Array.isArray(rows) ? rows : [])
      })
      .catch(() => {
        if (!cancelled) setCategories([])
      })
      .finally(() => {
        if (!cancelled) setCategoryLoading(false)
      })
    return () => { cancelled = true }
  }, [authUser?.id])

  useEffect(() => {
    if (!authUser?.id) return
    let cancelled = false
    getMyCourses()
      .then(rows => {
        if (!cancelled) setCourses(Array.isArray(rows) ? rows : [])
      })
      .catch(() => {
        if (!cancelled) setCourses([])
      })
    return () => { cancelled = true }
  }, [authUser?.id])

  useEffect(() => {
    if (!selectedCourseId || !authUser?.id) {
      setTopics([])
      return
    }
    let cancelled = false
    getCourseTopics(selectedCourseId)
      .then(rows => {
        if (!cancelled) setTopics(Array.isArray(rows) ? rows : [])
      })
      .catch(() => {
        if (!cancelled) setTopics([])
      })
    return () => { cancelled = true }
  }, [selectedCourseId, authUser?.id])

  function syncDescriptionFromDom() {
    if (descriptionEditorRef.current) {
      descriptionHtmlRef.current = descriptionEditorRef.current.innerHTML
    }
  }

  function onDescriptionInput() {
    syncDescriptionFromDom()
  }

  function onLogin(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    loginCourseUser(authForm.email, authForm.password)
      .then(user => {
        setAuthUser(user || null)
        setTab('login')
      })
      .catch(err => setError(err.message || 'Login failed'))
      .finally(() => setBusy(false))
  }

  function onRegister(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    registerCourseUser(authForm.name, authForm.email, authForm.password)
      .then(user => {
        setAuthUser(user || null)
      })
      .catch(err => setError(err.message || 'Register failed'))
      .finally(() => setBusy(false))
  }

  async function onLogout() {
    setError('')
    try {
      await logoutCourseUser()
    } finally {
      setAuthUser(null)
      setSelectedCourseId('')
      setCourseForm(initialCourseForm)
      slugManualRef.current = false
    }
  }

  function onCourseField(e) {
    const { name, value, type, checked } = e.target
    if (name === 'title' && !slugManualRef.current) {
      setCourseForm(prev => ({
        ...prev,
        title: value,
        slug: slugify(value),
      }))
      return
    }
    if (name === 'slug') {
      slugManualRef.current = true
      setCourseForm(prev => ({ ...prev, slug: value }))
      return
    }
    setCourseForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function runCourseAiDemo() {
    syncDescriptionFromDom()
    const focus = aiPrompt.trim()
    const block = focus ? `<p><strong>Focus:</strong> ${focus.replace(/</g, '')}</p>` : ''
    const html = `<h2>Overview</h2>${block}<p>Describe outcomes, prerequisites, and how lessons are structured.</p><ul><li>What learners will build</li><li>Time to complete</li></ul>`
    if (descriptionEditorRef.current) {
      descriptionEditorRef.current.innerHTML = html
      descriptionHtmlRef.current = html
    }
    setCourseForm(prev => ({ ...prev, description: html }))
  }

  async function onCreateCourse(e) {
    e.preventDefault()
    syncDescriptionFromDom()
    setError('')
    if (!courseForm.category_id || !courseForm.title.trim()) {
      setError('Category and title are required.')
      return
    }
    setBusy(true)
    try {
      const payload = {
        category_id: Number(courseForm.category_id),
        title: courseForm.title.trim(),
        slug: (courseForm.slug || slugify(courseForm.title)).trim() || slugify(courseForm.title),
        description: descriptionHtmlRef.current || courseForm.description || '',
        is_free: !!courseForm.is_free,
        price_amount: courseForm.is_free ? null : Number(courseForm.price_amount) || 0,
        currency: courseForm.currency || 'USD',
        difficulty: courseForm.difficulty,
        status: courseForm.status,
      }
      await createMyCourse(payload)
      const rows = await getMyCourses()
      setCourses(Array.isArray(rows) ? rows : [])
      setCourseForm(initialCourseForm)
      slugManualRef.current = false
      if (descriptionEditorRef.current) {
        descriptionEditorRef.current.innerHTML = ''
        descriptionHtmlRef.current = ''
      }
      setStudioTab('list')
    } catch (err) {
      setError(err.message || 'Could not create course')
    } finally {
      setBusy(false)
    }
  }

  async function onCreateTopic(e) {
    e.preventDefault()
    if (!selectedCourseId) return
    setError('')
    setBusy(true)
    try {
      await createCourseTopic(selectedCourseId, {
        title: topicForm.title.trim(),
        description: topicForm.description.trim(),
      })
      const rows = await getCourseTopics(selectedCourseId)
      setTopics(Array.isArray(rows) ? rows : [])
      setTopicForm(initialTopicForm)
    } catch (err) {
      setError(err.message || 'Could not add topic')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="course-page">
      <div className="container">
        <div className="section-head course-head">
          <div>
            <span>Course studio</span>
            <h1>Create courses and topics</h1>
            <p>
              Sign in to build and publish courses. Learners browse the public catalog on{' '}
              <Link to="/courses">Courses</Link>.
            </p>
          </div>
        </div>

        {error && <p className="api-state api-state--error course-error">{error}</p>}

        {!authUser && (
          <div className="course-auth-card">
            <div className="course-auth-tabs">
              <button type="button" className={tab === 'login' ? 'is-active' : ''} onClick={() => setTab('login')}>Login</button>
              <button type="button" className={tab === 'register' ? 'is-active' : ''} onClick={() => setTab('register')}>Register</button>
            </div>
            <form onSubmit={tab === 'login' ? onLogin : onRegister} className="course-auth-form">
              {tab === 'register' && (
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={authForm.name}
                  onChange={e => setAuthForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={authForm.email}
                onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={authForm.password}
                onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {tab === 'login' ? 'Login' : 'Register'}
              </button>
            </form>
          </div>
        )}

        {authUser && (
          <div className="course-studio">
            <div className="course-studio-headrow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <p style={{ margin: 0 }}>Signed in as <strong>{authUser.name}</strong></p>
              <button type="button" className="btn btn-ghost" onClick={onLogout}>Logout</button>
            </div>
            <div className="course-studio-tabs">
              <button type="button" className={studioTab === 'create' ? 'is-active' : ''} onClick={() => setStudioTab('create')}>Create course</button>
              <button type="button" className={studioTab === 'list' ? 'is-active' : ''} onClick={() => setStudioTab('list')}>My courses</button>
            </div>

            {studioTab === 'create' && (
              <form className="course-form panel" onSubmit={onCreateCourse}>
                <div className="course-panel-head">
                  <h4>New course</h4>
                  <span className="course-panel-tag">Draft saves to your account</span>
                </div>
                <div className="course-form-grid">
                  <label className="course-field">
                    <span>Category</span>
                    <select
                      name="category_id"
                      className="course-select"
                      value={courseForm.category_id}
                      onChange={onCourseField}
                      required
                      disabled={categoryLoading}
                    >
                      <option value="">{categoryLoading ? 'Loading…' : 'Select category'}</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {'—'.repeat(c.level)}{c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="course-field">
                    <span>Title</span>
                    <input name="title" value={courseForm.title} onChange={onCourseField} required />
                  </label>
                  <label className="course-field">
                    <span>Slug</span>
                    <input name="slug" value={courseForm.slug} onChange={onCourseField} placeholder="auto from title" />
                  </label>
                  <label className="course-field">
                    <span>Difficulty</span>
                    <select name="difficulty" className="course-select" value={courseForm.difficulty} onChange={onCourseField}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </label>
                  <label className="course-field">
                    <span>Status</span>
                    <select name="status" className="course-select" value={courseForm.status} onChange={onCourseField}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </label>
                  <label className="course-check">
                    <input name="is_free" type="checkbox" checked={courseForm.is_free} onChange={onCourseField} />
                    <span>Free course</span>
                  </label>
                  {!courseForm.is_free && (
                    <label className="course-field">
                      <span>Price</span>
                      <input name="price_amount" type="number" step="0.01" value={courseForm.price_amount} onChange={onCourseField} />
                    </label>
                  )}
                </div>
                <label className="course-field">
                  <span>Description</span>
                  <div className="course-rich-wrap">
                    <RichToolbar editorRef={descriptionEditorRef} expanded />
                    <div
                      ref={descriptionEditorRef}
                      className="course-rich-editor"
                      contentEditable
                      suppressContentEditableWarning
                      onInput={onDescriptionInput}
                      onBlur={syncDescriptionFromDom}
                    />
                  </div>
                </label>
                <div className="course-ai-builder">
                  <p className="course-ai-builder-note">Demo: paste a short focus and generate starter HTML for the description.</p>
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="e.g. Laravel APIs for beginners"
                    style={{ width: '100%', maxWidth: 420, marginBottom: 8, padding: '8px 12px', borderRadius: 8, border: '1px solid #e5eaf5' }}
                  />
                  <button type="button" className="btn btn-teal" onClick={runCourseAiDemo}>Fill description template</button>
                </div>
                <button type="submit" className="btn btn-primary" disabled={busy}>Create course</button>
              </form>
            )}

            {studioTab === 'list' && (
              <div className="course-list-panel panel">
                <div className="course-panel-head">
                  <h4>Your courses</h4>
                </div>
                <div className="course-item-list">
                  {courses.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className={`course-item${String(c.id) === selectedCourseId ? ' is-active' : ''}`}
                      onClick={() => setSelectedCourseId(String(c.id))}
                    >
                      <div className="course-item-top">
                        <strong>{c.title}</strong>
                        <span className={`course-status course-status--${(c.status || 'draft').replace(/\s/g, '_')}`}>{c.status || 'draft'}</span>
                      </div>
                      <div className="course-item-meta">
                        <span>#{c.id}</span>
                        {c.slug && <span>{c.slug}</span>}
                      </div>
                    </button>
                  ))}
                  {!courses.length && <p className="muted">No courses yet. Use Create course.</p>}
                </div>

                {selectedCourse && (
                  <div className="course-topic-panel panel">
                    <div className="course-panel-head">
                      <h4>Topics — {selectedCourse.title}</h4>
                      <span className="course-panel-tag course-panel-tag--ai">Add topics, then lessons</span>
                    </div>
                    <form className="course-topic-form" onSubmit={onCreateTopic}>
                      <label className="course-field">
                        <span>Topic title</span>
                        <input
                          value={topicForm.title}
                          onChange={e => setTopicForm(f => ({ ...f, title: e.target.value }))}
                          required
                        />
                      </label>
                      <label className="course-field">
                        <span>Topic description</span>
                        <textarea
                          value={topicForm.description}
                          onChange={e => setTopicForm(f => ({ ...f, description: e.target.value }))}
                          rows={3}
                        />
                      </label>
                      <button type="submit" className="btn btn-primary" disabled={busy}>Add topic</button>
                    </form>
                    <ul className="course-topic-list">
                      {topics.map(t => (
                        <li key={t.id} className="course-topic-row">
                          <div className="course-topic-row-main">
                            <strong>{t.title}</strong>
                            {t.description && <span className="muted">{t.description}</span>}
                          </div>
                          <Link
                            className="btn btn-ghost course-topic-lessons-link"
                            to={`/course/${selectedCourse.id}/topic/${t.id}/lessons`}
                          >
                            Lessons <i className="fa-solid fa-arrow-right" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {!topics.length && <p className="muted">No topics for this course yet.</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
