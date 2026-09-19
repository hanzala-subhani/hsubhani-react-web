import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicCourseCatalog } from '../lib/courseApi'
import {
  formatCoursePrice,
  publicCourseExcerpt,
  publicCourseThumbnailUrl,
} from '../lib/publicCourseUtils'

const stats = [
  { value: '120+', label: 'Expert-led courses' },
  { value: '25k+', label: 'Active learners' },
  { value: '4.8', label: 'Average course rating' },
]

const benefits = [
  {
    icon: 'fa-chalkboard-user',
    title: 'Learn from practitioners',
    text: 'Courses built by developers and educators who ship real products—not theory-only content.',
  },
  {
    icon: 'fa-clock',
    title: 'Learn at your pace',
    text: 'Structured lessons you can start, pause, and resume anytime on any device.',
  },
  {
    icon: 'fa-certificate',
    title: 'Job-ready skills',
    text: 'Practical projects and clear outcomes so you can apply what you learn immediately.',
  },
  {
    icon: 'fa-shield-halved',
    title: 'Trusted platform',
    text: 'Secure checkout, organized catalogs, and a consistent learning experience end to end.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Browse the catalog',
    text: 'Explore categories—from web development to interview prep—and pick a course that fits your goals.',
  },
  {
    step: '02',
    title: 'Enroll & start learning',
    text: 'Get instant access to lessons, topics, and resources structured for steady progress.',
  },
  {
    step: '03',
    title: 'Grow with support',
    text: 'Apply skills through exercises and stay on track with clear modules and updates.',
  },
]

const testimonials = [
  {
    initials: 'AK',
    name: 'Aisha Khan',
    role: 'Junior Developer',
    text: 'The Node.js track gave me confidence to build APIs for my internship project. Clear lessons and real examples.',
  },
  {
    initials: 'RP',
    name: 'Rahul Patel',
    role: 'Career switcher',
    text: 'Interview prep courses helped me organize answers and practice under pressure. Worth every minute.',
  },
  {
    initials: 'MJ',
    name: 'Maria Johnson',
    role: 'Team lead',
    text: 'We enrolled our team in several courses. The catalog is easy to navigate and the content stays practical.',
  },
]

const placeholderCourses = [
  {
    id: 'demo-1',
    slug: null,
    title: 'Full-Stack Web Development',
    description: 'PHP, Node.js, and React—from fundamentals to deployable apps.',
    is_free: false,
    price_amount: 49,
    currency: 'USD',
  },
  {
    id: 'demo-2',
    slug: null,
    title: 'Interview Preparation',
    description: 'Technical and behavioral questions with structured practice paths.',
    is_free: true,
  },
  {
    id: 'demo-3',
    slug: null,
    title: 'Laravel & API Design',
    description: 'Eloquent, REST APIs, and patterns for maintainable backends.',
    is_free: false,
    price_amount: 39,
    currency: 'USD',
  },
]

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

function courseHref(course) {
  if (course.slug) return `/courses/${course.slug}`
  if (course.id && !String(course.id).startsWith('demo')) {
    return `/courses/topics?sub=all&course_id=${course.id}`
  }
  return '/courses'
}

export default function CompanyLanding() {
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getPublicCourseCatalog()
      .then(data => {
        if (!cancelled) setCatalog(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setCatalog([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const featuredCourses = useMemo(() => {
    const fromApi = flattenCatalogCourses(catalog).slice(0, 6)
    if (fromApi.length > 0) return fromApi
    return placeholderCourses
  }, [catalog])

  const categoryCount = catalog.length

  return (
    <div className="company-landing">
      {/* Hero */}
      <section className="company-hero" aria-labelledby="company-hero-heading">
        <div className="company-hero-bg" aria-hidden="true" />
        <div className="container company-hero-inner">
          <div className="company-hero-copy">
            <p className="company-hero-eyebrow">
              <i className="fa-solid fa-graduation-cap" aria-hidden="true" />
              Bexon Academy
            </p>
            <h1 id="company-hero-heading">
              Learn skills that move your career forward
            </h1>
            <p className="company-hero-lead">
              Professional courses in development, interview prep, and technology—designed
              for individuals and teams who want practical, up-to-date training they can
              use on the job.
            </p>
            <div className="company-hero-actions">
              <Link to="/courses" className="btn btn-teal">
                Browse courses
                <span className="btn-ico" aria-hidden="true">
                  <i className="fa-solid fa-arrow-up-right" />
                </span>
              </Link>
              <Link to="/course" className="btn btn-ghost company-hero-ghost">
                Teach on Bexon
              </Link>
            </div>
          </div>
          <div className="company-hero-card" aria-label="Platform highlights">
            <div className="company-hero-stat-grid">
              {stats.map(s => (
                <div className="company-hero-stat" key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <p className="company-hero-card-note">
              {categoryCount > 0
                ? `${categoryCount} categories live in the catalog today.`
                : 'New categories and courses added regularly.'}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="company-section company-benefits" aria-labelledby="company-benefits-heading">
        <div className="container">
          <div className="company-section-head">
            <span>Why Bexon Academy</span>
            <h2 id="company-benefits-heading">A learning platform built for real outcomes</h2>
            <p>
              Whether you are upskilling, preparing for interviews, or training a team—we
              focus on clarity, quality, and courses you can finish.
            </p>
          </div>
          <div className="company-benefit-grid">
            {benefits.map(b => (
              <article className="company-benefit-card" key={b.title}>
                <div className="company-benefit-icon" aria-hidden="true">
                  <i className={`fa-solid ${b.icon}`} />
                </div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="company-section company-courses" aria-labelledby="company-courses-heading">
        <div className="container">
          <div className="company-section-head">
            <span>Course catalog</span>
            <h2 id="company-courses-heading">Popular courses to get started</h2>
            <p>Hand-picked from our catalog—enroll and start learning in minutes.</p>
          </div>

          {loading ? (
            <p className="api-state company-courses-state">Loading courses…</p>
          ) : (
            <div className="company-course-grid">
              {featuredCourses.map(course => {
                const thumb = publicCourseThumbnailUrl(course)
                const excerpt = publicCourseExcerpt(course, 110)
                const href = courseHref(course)
                return (
                  <article className="company-course-card" key={course.id}>
                    <Link to={href} className="company-course-thumb-link" tabIndex={-1} aria-hidden="true">
                      <div className="company-course-thumb">
                        {thumb ? (
                          <img src={thumb} alt="" />
                        ) : (
                          <i className="fa-solid fa-book-open" />
                        )}
                        <span className={`company-course-price${course.is_free ? ' is-free' : ''}`}>
                          {formatCoursePrice(course)}
                        </span>
                      </div>
                    </Link>
                    <div className="company-course-body">
                      <h3>
                        <Link to={href}>{course.title}</Link>
                      </h3>
                      <p>{excerpt || course.description}</p>
                      <Link to={href} className="company-course-link">
                        View course
                        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <p className="company-courses-more">
            <Link to="/courses" className="btn btn-primary">
              View full catalog
              <span className="btn-ico" aria-hidden="true">
                <i className="fa-solid fa-arrow-up-right" />
              </span>
            </Link>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="company-section company-steps" aria-labelledby="company-steps-heading">
        <div className="container">
          <div className="company-section-head">
            <span>How it works</span>
            <h2 id="company-steps-heading">From browse to mastery in three steps</h2>
          </div>
          <ol className="company-steps-list">
            {steps.map(s => (
              <li className="company-step-card" key={s.step}>
                <span className="company-step-num">{s.step}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* For instructors */}
      <section className="company-instructor-banner" aria-labelledby="company-instructor-heading">
        <div className="container company-instructor-inner">
          <div>
            <span className="company-instructor-tag">For educators</span>
            <h2 id="company-instructor-heading">Sell and deliver courses on your terms</h2>
            <p>
              Use the Bexon course studio to publish lessons, organize topics, and reach
              learners through our public catalog.
            </p>
          </div>
          <Link to="/course" className="btn btn-teal">
            Open course studio
            <span className="btn-ico" aria-hidden="true">
              <i className="fa-solid fa-arrow-up-right" />
            </span>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="company-section company-testimonials" aria-labelledby="company-testimonials-heading">
        <div className="container">
          <div className="company-section-head">
            <span>Learner stories</span>
            <h2 id="company-testimonials-heading">Trusted by students and teams</h2>
          </div>
          <div className="company-testimonial-grid">
            {testimonials.map(t => (
              <blockquote className="company-testimonial-card" key={t.name}>
                <p>{t.text}</p>
                <footer>
                  <span className="company-testimonial-avatar" aria-hidden="true">
                    {t.initials}
                  </span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="company-bottom-cta" aria-labelledby="company-cta-heading">
        <div className="container company-bottom-inner">
          <div>
            <h2 id="company-cta-heading">Ready to start learning?</h2>
            <p>
              Explore the catalog, pick a course, and build skills that employers and
              clients value.
            </p>
          </div>
          <div className="company-hero-actions">
            <Link to="/courses" className="btn btn-teal">
              Explore courses
              <span className="btn-ico" aria-hidden="true">
                <i className="fa-solid fa-arrow-up-right" />
              </span>
            </Link>
            <Link to="/contact" className="btn btn-ghost company-hero-ghost">
              Contact sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
