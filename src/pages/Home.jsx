import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BlogCardVisual from '../components/BlogCardVisual'
import {
  AGENCY_EXPERTISE,
  CAREER_HIGHLIGHTS,
  CTA_PRIMARY,
  CTA_SECONDARY,
  SITE_BRAND_AGENCY,
  SITE_BRAND_FULL,
  SITE_FOUNDER_BIO,
  SITE_POSITIONING,
  STATS_FOOTNOTE,
} from '../config/app.config'
import {
  aiCapabilities,
  caseStudies,
  homeHeroSlides,
  homeTrustedStack,
  homeWhatWeBuild,
  homeWhyHSubhani,
  industries,
  services,
  solutions,
} from '../data/agency'
import { getBlogList } from '../lib/blogApi'
import { mapBlogRowFromApi } from '../lib/blogMappers'
import useScrollReveal from '../lib/useScrollReveal'

const HOME_BLOG_COUNT = 3
const HOME_AI_CAP_COUNT = 4
const HOME_WHY_COUNT = 3
const HOME_FEATURED_COUNT = 3
const HERO_SLIDE_MS = 5500

/** Hero reassurance points — short, checkable claims only. */
const HERO_ASSURANCES = [
  { icon: 'fa-solid fa-user-gear', label: 'Senior-led delivery' },
  { icon: 'fa-solid fa-code-branch', label: 'Production-grade architecture' },
  { icon: 'fa-solid fa-life-ring', label: 'Support beyond launch' },
]

/** Canonical summaries keyed by slug — build cards link into services or solutions. */
const summaryBySlug = new Map(
  [...services, ...solutions].map(entry => [entry.slug, entry.summary]),
)

function summaryForBuildItem(item) {
  return summaryBySlug.get(item.to.split('/').pop()) || ''
}

function mapHomeBlogPosts(items) {
  return items
    .map(mapBlogRowFromApi)
    .filter(p => p.slug)
    .sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0
      return tb - ta
    })
    .slice(0, HOME_BLOG_COUNT)
}

const featuredStudies = caseStudies.slice(0, HOME_FEATURED_COUNT)
const whyPoints = homeWhyHSubhani.slice(0, HOME_WHY_COUNT)

export default function Home() {
  const [posts, setPosts] = useState([])
  const [blogLoading, setBlogLoading] = useState(true)
  const [blogError, setBlogError] = useState(null)
  const [heroSlide, setHeroSlide] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)
  const pageRef = useRef(null)

  useScrollReveal(pageRef, [blogLoading, posts.length])

  useEffect(() => {
    let cancelled = false
    setBlogLoading(true)
    setBlogError(null)

    getBlogList({ per_page: HOME_BLOG_COUNT })
      .then(({ items }) => {
        if (!cancelled) setPosts(mapHomeBlogPosts(items))
      })
      .catch(e => {
        if (!cancelled) {
          setPosts([])
          setBlogError(e.message || 'Failed to load posts')
        }
      })
      .finally(() => {
        if (!cancelled) setBlogLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (heroPaused || homeHeroSlides.length < 2) return undefined
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const id = window.setInterval(() => {
      setHeroSlide(i => (i + 1) % homeHeroSlides.length)
    }, HERO_SLIDE_MS)

    return () => window.clearInterval(id)
  }, [heroPaused])

  const activeSlide = homeHeroSlides[heroSlide] || homeHeroSlides[0]
  const [leadStudy, ...sideStudies] = featuredStudies

  return (
    <div className="home-agency" ref={pageRef}>
      {/* Hero ------------------------------------------------------------- */}
      <section className="ent-hero ent-on-dark" aria-labelledby="home-hero-heading">
        <div className="ent-hero-grid" aria-hidden="true" />
        <div className="ent-hero-orb ent-hero-orb--a" aria-hidden="true" />
        <div className="ent-hero-orb ent-hero-orb--b" aria-hidden="true" />
        <div className="container ent-hero-inner">
          <div className="ent-hero-copy" data-reveal>
            <p className="ent-hero-badge">
              <span className="ent-pulse" aria-hidden="true" />
              <span>{SITE_POSITIONING}</span>
            </p>
            <h1 id="home-hero-heading" className="ent-hero-brand">
              {SITE_BRAND_FULL}
            </h1>
            <p className="ent-hero-tagline">
              Build. <em>Modernize.</em> Scale.
            </p>
            <p className="ent-hero-lead">
              We design, build and scale production web applications, APIs, SaaS platforms and
              AI-powered systems — engineered by a senior technical lead who stays on the project
              after launch.
            </p>
            <div className="ent-hero-actions">
              <Link to="/contact" className="btn btn-teal">
                {CTA_PRIMARY}
                <span className="btn-ico" aria-hidden="true">
                  <i className="fa-solid fa-arrow-up-right" />
                </span>
              </Link>
              <Link to="/work" className="btn btn-ghost ent-ghost-dark">
                View Case Studies
              </Link>
            </div>
            <ul className="ent-hero-note">
              {HERO_ASSURANCES.map(item => (
                <li key={item.label}>
                  <i className={item.icon} aria-hidden="true" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="ent-stack-panel ent-stack-panel--live"
            data-reveal
            onMouseEnter={() => setHeroPaused(true)}
            onMouseLeave={() => setHeroPaused(false)}
            onFocusCapture={() => setHeroPaused(true)}
            onBlurCapture={e => {
              if (!e.currentTarget.contains(e.relatedTarget)) setHeroPaused(false)
            }}
          >
            <div className="ent-stack-panel-head">
              <h2 className="ent-stack-panel-title" id="home-stack-title">
                {activeSlide.title}
              </h2>
              <div
                className="ent-stack-dots"
                role="tablist"
                aria-label="Hero panel slides"
              >
                {homeHeroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    className={index === heroSlide ? 'is-active' : undefined}
                    aria-selected={index === heroSlide}
                    aria-controls="home-stack-panel"
                    aria-label={`${slide.title} (${index + 1} of ${homeHeroSlides.length})`}
                    onClick={() => setHeroSlide(index)}
                  />
                ))}
              </div>
            </div>
            <div
              className="ent-stack-viewport"
              id="home-stack-panel"
              role="tabpanel"
              aria-labelledby="home-stack-title"
              key={activeSlide.id}
            >
              <ul className="ent-stack-layers">
                {activeSlide.items.map((layer, index) => (
                  <li
                    className="ent-stack-layer"
                    key={`${activeSlide.id}-${layer.tier}`}
                    style={{ '--stack-i': index }}
                  >
                    <span className="ent-stack-icon" aria-hidden="true">
                      <i className={layer.icon} />
                    </span>
                    <span className="ent-stack-body">
                      <span className="ent-stack-tier">{layer.tier}</span>
                      <span className="ent-stack-label">{layer.label}</span>
                      <span className="ent-stack-detail">{layer.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology credibility row --------------------------------------- */}
      <section className="ent-trust" aria-labelledby="home-trust-heading">
        <div className="container ent-trust-inner">
          <h2 id="home-trust-heading" className="ent-trust-label">
            Core delivery stack
          </h2>
          <ul className="ent-trust-row">
            {homeTrustedStack.map(item => (
              <li key={item.name}>
                <span className="ent-trust-ico" aria-hidden="true">
                  <i className={item.icon} />
                </span>
                <span className="ent-trust-name">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured work ---------------------------------------------------- */}
      <section className="ent-section" aria-labelledby="home-work-heading">
        <div className="container">
          <div className="ent-head ent-head--split" data-reveal>
            <div>
              <p className="ent-eyebrow">Selected work</p>
              <h2 id="home-work-heading" className="ent-h2">
                Systems still running the business
              </h2>
            </div>
            <p className="ent-deck">
              Production platforms in AI, commerce and operations — each one still carrying real
              traffic, not a portfolio mock.
            </p>
          </div>

          <div className="ent-featured" data-reveal>
            {leadStudy && (
              <article className="ent-featured-lead">
                <p className="ent-work-kicker">{leadStudy.kicker}</p>
                <h3>
                  <Link to={`/work/${leadStudy.slug}`}>{leadStudy.title}</Link>
                </h3>
                <p>{leadStudy.summary}</p>
                <ul className="ent-work-stack">
                  {leadStudy.stack.slice(0, 5).map(tech => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <div className="ent-work-foot">
                  <Link to={`/work/${leadStudy.slug}`} className="ent-link">
                    Read the case study
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            )}

            <div className="ent-featured-side">
              {sideStudies.map(study => (
                <article className="ent-featured-item" key={study.slug}>
                  <p className="ent-work-kicker">{study.kicker}</p>
                  <h3>
                    <Link to={`/work/${study.slug}`}>{study.title}</Link>
                  </h3>
                  <p>{study.summary}</p>
                  <Link to={`/work/${study.slug}`} className="ent-link">
                    View project
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <p className="ent-card-foot">
            <Link to="/work" className="ent-link">
              Browse all case studies
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* Capabilities ----------------------------------------------------- */}
      <section className="ent-section ent-section--sunk" aria-labelledby="home-build-heading">
        <div className="container">
          <div className="ent-head ent-head--split" data-reveal>
            <div>
              <p className="ent-eyebrow">Capabilities</p>
              <h2 id="home-build-heading" className="ent-h2">
                What we build
              </h2>
            </div>
            <p className="ent-deck">
              Six delivery areas that cover most engagements — from a first production release to
              modernizing a system that is already carrying the business.
            </p>
          </div>

          <div className="ent-grid ent-grid--3">
            {homeWhatWeBuild.map(item => (
              <Link className="ent-card ent-card--link" to={item.to} key={item.title} data-reveal>
                <span className="ent-card-icon" aria-hidden="true">
                  <i className={item.icon} />
                </span>
                <h3>{item.title}</h3>
                <p>{summaryForBuildItem(item)}</p>
                <span className="ent-card-foot">
                  <span className="ent-link">
                    Explore
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators -------------------------------------------------- */}
      {/* <section className="ent-section" aria-labelledby="home-why-heading">
        <div className="container">
          <div className="ent-head ent-head--center" data-reveal>
            <p className="ent-eyebrow">Why us</p>
            <h2 id="home-why-heading" className="ent-h2">
              Why {SITE_BRAND_FULL}?
            </h2>
            <p className="ent-deck">
              A founder-led engineering partner: the person who architects your system is the person
              who builds and reviews it.
            </p>
          </div>

          <ol className="ent-why-strip">
            {whyPoints.map((item, index) => (
              <li key={item.title} data-reveal>
                <span className="ent-why-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section> */}

      {/* AI --------------------------------------------------------------- */}
      <section className="ent-ai ent-on-dark" aria-labelledby="home-ai-heading">
        <div className="container ent-ai-grid">
          <div data-reveal>
            <p className="ent-eyebrow ent-eyebrow--on-dark">AI &amp; automation</p>
            <h2 id="home-ai-heading" className="ent-h2">
              AI inside software that is already in production
            </h2>
            <p className="ent-deck">
              AI is not sold here as a slogan. Models are wired into Laravel and Python services
              around a real job to be done, with a human still in control of what gets committed.
            </p>
            <div className="ent-hero-actions">
              <Link to="/services/ai-integration" className="btn btn-teal">
                Explore AI Solutions
                <span className="btn-ico" aria-hidden="true">
                  <i className="fa-solid fa-arrow-up-right" />
                </span>
              </Link>
            </div>
          </div>

          <ul className="ent-ai-caps" data-reveal>
            {aiCapabilities.slice(0, HOME_AI_CAP_COUNT).map(cap => (
              <li className="ent-ai-cap" key={cap.title}>
                <strong>{cap.title}</strong>
                <span>{cap.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Industries ------------------------------------------------------- */}
      <section className="ent-section ent-section--sunk" aria-labelledby="home-industries-heading">
        <div className="container">
          <div className="ent-head ent-head--center" data-reveal>
            <p className="ent-eyebrow">Industries</p>
            <h2 id="home-industries-heading" className="ent-h2">
              Sectors we deliver into
            </h2>
          </div>

          <div className="ent-industry-rail">
            {industries.map(item => (
              <Link className="ent-industry" to={item.to} key={item.slug} data-reveal>
                <i className={item.icon} aria-hidden="true" />
                <span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Founder ---------------------------------------------------------- */}
      {/* <section className="ent-founder" aria-labelledby="home-about-heading">
        <div className="container ent-founder-grid">
          <div data-reveal>
            <p className="ent-eyebrow">About {SITE_BRAND_AGENCY}</p>
            <h2 id="home-about-heading" className="ent-h2">
              Founder-led engineering, not an account layer
            </h2>
            <p className="ent-deck">{SITE_FOUNDER_BIO}</p>
            <p className="ent-founder-quote">
              Production software, APIs and AI integration — architected and shipped by a technical
              lead, not a layer of account managers.
            </p>
            <div className="ent-hero-actions">
              <Link to="/about" className="btn btn-ghost">
                Meet the technical lead
              </Link>
              <Link to="/contact" className="btn btn-teal">
                {CTA_SECONDARY}
              </Link>
            </div>
          </div>

          <ul className="ent-expertise" data-reveal>
            {AGENCY_EXPERTISE.map(item => (
              <li key={item.title}>
                <i className={item.icon} aria-hidden="true" />
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </section> */}

      {/* Insights --------------------------------------------------------- */}
      {/* <section className="ent-section" aria-labelledby="home-blog-heading">
        <div className="container">
          <div className="ent-head ent-head--split" data-reveal>
            <div>
              <p className="ent-eyebrow">Insights</p>
              <h2 id="home-blog-heading" className="ent-h2">
                Engineering notes
              </h2>
            </div>
            <p className="ent-deck">
              Practical writing on Laravel, backend architecture, APIs and putting AI into systems
              that already have users.
            </p>
          </div>

          {blogLoading && <p className="api-state">Loading recent posts…</p>}
          {!blogLoading && blogError && (
            <p className="api-state api-state--error">{blogError}</p>
          )}
          {!blogLoading && !blogError && posts.length === 0 && (
            <p className="api-state">No insights published yet.</p>
          )}
          {!blogLoading && posts.length > 0 && (
            <div className="blog-grid blog-grid--3 home-blog-grid">
              {posts.map(post => (
                <article className="blog-card home-blog-card" key={post.slug} data-reveal>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="blog-card-visual-link"
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    <BlogCardVisual
                      post={post}
                      className="home-blog-visual"
                      dateBadge={
                        post.dateBadge ? (
                          <div className="home-blog-date-badge" aria-hidden="true">
                            <strong>{post.dateBadge.day}</strong>
                            <span>{post.dateBadge.month}</span>
                          </div>
                        ) : null
                      }
                    />
                  </Link>
                  <div className="blog-card-body">
                    <div className="blog-meta">
                      <span className="blog-tag">{post.category}</span>
                    </div>
                    <h3>
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p>{post.excerpt}</p>
                    <div className="blog-card-footer">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="blog-link"
                        aria-label={`Read ${post.title}`}
                      >
                        <i className="fa-solid fa-arrow-up-right" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="ent-card-foot">
            <Link to="/blog" className="ent-link">
              View all insights
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section> */}

      {/* Proof — just above site footer ---------------------------------- */}
      <section className="ent-metrics ent-on-dark" aria-label="Delivery record">
        <div className="container">
          <div className="ent-metrics-grid">
            {CAREER_HIGHLIGHTS.map(stat => (
              <div className="ent-metric" key={stat.label} data-reveal>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <p className="ent-metrics-note">{STATS_FOOTNOTE}</p>
        </div>
      </section>
    </div>
  )
}
