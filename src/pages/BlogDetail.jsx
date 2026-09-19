import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import BlogCardVisual from '../components/BlogCardVisual'
import { getBlogBySlug, getBlogList } from '../lib/blogApi'
import { mapBlogRowFromApi } from '../lib/blogMappers'
import { getPostBannerUrl } from '../lib/blogUtils'
import { AUTHOR_BIO, BLOG_SIDEBAR_QUOTE, SITE_BRAND_AGENCY } from '../config/app.config'

function sortByDateDesc(list) {
  return [...list].sort((a, b) => {
    const ta = a.created_at ? new Date(a.created_at).getTime() : 0
    const tb = b.created_at ? new Date(b.created_at).getTime() : 0
    return tb - ta
  })
}

export default function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [prev, setPrev] = useState(null)
  const [next, setNext] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    setError(null)
    setPost(null)
    setRelated([])
    setPrev(null)
    setNext(null)

    getBlogBySlug(slug)
      .then(row => {
        if (cancelled) return
        const mapped = mapBlogRowFromApi(row)
        if (!mapped.slug) {
          setNotFound(true)
          return
        }
        setPost(mapped)

        const listOpts = { per_page: 50 }
        if (mapped.category_id) listOpts.category_id = mapped.category_id

        return getBlogList(listOpts).then(({ items }) => {
          if (cancelled) return
          const ordered = sortByDateDesc(
            items.map(mapBlogRowFromApi).filter(p => p.slug),
          )
          const idx = ordered.findIndex(p => p.slug === mapped.slug)
          if (idx > 0) setPrev(ordered[idx - 1])
          if (idx >= 0 && idx < ordered.length - 1) setNext(ordered[idx + 1])

          const rel = ordered
            .filter(p => p.slug !== mapped.slug)
            .slice(0, 3)
          setRelated(rel)
        })
      })
      .catch(e => {
        if (cancelled) return
        const msg = e.message || 'Failed to load post'
        if (/not found/i.test(msg)) setNotFound(true)
        else setError(msg)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [slug])

  if (loading) {
    return (
      <section className="post-body-section">
        <div className="container">
          <p className="api-state">Loading article…</p>
        </div>
      </section>
    )
  }

  if (notFound) return <Navigate to="/blog" replace />

  if (error || !post) {
    return (
      <section className="post-body-section">
        <div className="container">
          <p className="api-state api-state--error">{error || 'Article unavailable.'}</p>
          <Link to="/blog" className="post-back" style={{ marginTop: 16 }}>
            <i className="fa-solid fa-arrow-left" /> Back to Blog
          </Link>
        </div>
      </section>
    )
  }

  const bannerUrl = getPostBannerUrl(post)

  return (
    <>
      <section className="post-hero">
        {bannerUrl && (
          <div className="post-hero-cover" aria-hidden="true">
            <img
              className="post-hero-cover-img"
              src={bannerUrl}
              alt=""
              decoding="async"
            />
          </div>
        )}
        <div className="container">
          <div className="post-hero-inner">
            <h1>{post.title}</h1>
            {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
          </div>
        </div>
      </section>

      <section className="post-body-section">
        <div className="container post-layout">
          {post.contentHtml ? (
            <article
              className="post-content post-content--html"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          ) : (
            <article className="post-content">
              <p>No content available.</p>
            </article>
          )}
          <aside className="post-sidebar">
            <div className="sidebar-card">
              <h4>About Hanzala Subhani</h4>
              <div className="blog-author sidebar-author" style={{ marginTop: 14 }}>
                <div className="blog-avatar">{post.initials}</div>
                <div><strong>{SITE_BRAND_AGENCY}</strong></div>
              </div>
              <p className="sidebar-author-bio">{AUTHOR_BIO}</p>
            </div>
            <div className="sidebar-card">
              <h4>Article Info</h4>
              <ul className="sidebar-meta-list">
                <li><span>Category</span><span className="blog-tag">{post.category}</span></li>
                <li><span>Published</span><span>{post.date}</span></li>
                <li><span>Read time</span><span>{post.read}</span></li>
              </ul>
            </div>
            <blockquote className="sidebar-quote">
              <i className="fa-solid fa-quote-left sidebar-quote-icon" aria-hidden="true" />
              <p>{BLOG_SIDEBAR_QUOTE.text}</p>
              <cite>— {BLOG_SIDEBAR_QUOTE.author}</cite>
            </blockquote>
          </aside>
        </div>
      </section>

      {(prev || next) && (
        <section className="post-nav-section">
          <div className="container post-nav">
            {prev
              ? <Link to={`/blog/${prev.slug}`} className="post-nav-item post-nav-item--prev">
                  <span className="post-nav-label"><i className="fa-solid fa-arrow-left" /> Previous</span>
                  <span className="post-nav-title">{prev.title}</span>
                </Link>
              : <div />}
            {next
              ? <Link to={`/blog/${next.slug}`} className="post-nav-item post-nav-item--next">
                  <span className="post-nav-label">Next <i className="fa-solid fa-arrow-right" /></span>
                  <span className="post-nav-title">{next.title}</span>
                </Link>
              : <div />}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="post-related">
          <div className="container">
            <div className="section-head" style={{ marginBottom: 32 }}>
              <span>Keep Reading</span>
              <h2>Related Articles</h2>
            </div>
            <div className="blog-grid blog-grid--3">
              {related.map(r => (
                <article className="blog-card" key={r.slug}>
                  <Link to={`/blog/${r.slug}`} className="blog-card-visual-link">
                    <BlogCardVisual post={r} />
                  </Link>
                  <div className="blog-card-body">
                    <div className="blog-meta">
                      <span className="blog-tag">{r.category}</span>
                      <span className="blog-dot" />
                      <span>{r.read}</span>
                    </div>
                    <h3><Link to={`/blog/${r.slug}`}>{r.title}</Link></h3>
                    <p>{r.excerpt}</p>
                    <div className="blog-card-footer">
                      <div className="blog-author">
                        <div className="blog-avatar blog-avatar--sm">{r.initials}</div>
                        <div>
                          <strong>{r.author}</strong>
                          <span>{r.date}</span>
                        </div>
                      </div>
                      <Link to={`/blog/${r.slug}`} className="blog-link" aria-label={`Read ${r.title}`}>
                        <i className="fa-solid fa-arrow-up-right" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
