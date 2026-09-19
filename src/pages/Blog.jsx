import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BlogCardVisual from '../components/BlogCardVisual'
import { getBlogList } from '../lib/blogApi'
import { mapBlogRowFromApi } from '../lib/blogMappers'

const BLOG_PAGE_SIZE = 10

function mapBlogItems(items) {
  return items
    .map(mapBlogRowFromApi)
    .filter(p => p.slug)
    .sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0
      return tb - ta
    })
}

function hasMorePages(meta, itemCount) {
  if (meta?.current_page != null && meta?.last_page != null) {
    return meta.current_page < meta.last_page
  }
  return itemCount >= BLOG_PAGE_SIZE
}

export default function Blog() {
  const [featured, setFeatured] = useState(null)
  const [gridPosts, setGridPosts] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const sentinelRef = useRef(null)
  const loadingMoreRef = useRef(false)

  const appendUnique = useCallback((prev, incoming, excludeSlug) => {
    const seen = new Set(prev.map(p => p.slug))
    if (excludeSlug) seen.add(excludeSlug)
    const next = [...prev]
    for (const post of incoming) {
      if (!seen.has(post.slug)) {
        seen.add(post.slug)
        next.push(post)
      }
    }
    return next
  }, [])

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMore) return
    loadingMoreRef.current = true
    setLoadingMore(true)

    const nextPage = page + 1
    try {
      const { items, meta } = await getBlogList({ per_page: BLOG_PAGE_SIZE, page: nextPage })
      const mapped = mapBlogItems(items)
      setGridPosts(prev => appendUnique(prev, mapped, featured?.slug))
      setPage(nextPage)
      setHasMore(hasMorePages(meta, mapped.length))
    } catch (e) {
      setError(e.message || 'Failed to load more posts')
    } finally {
      loadingMoreRef.current = false
      setLoadingMore(false)
    }
  }, [appendUnique, featured?.slug, hasMore, page])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setFeatured(null)
    setGridPosts([])
    setPage(0)
    setHasMore(false)

    getBlogList({ per_page: BLOG_PAGE_SIZE })
      .then(({ items, meta }) => {
        if (cancelled) return
        const mapped = mapBlogItems(items)
        if (!mapped.length) {
          setFeatured(null)
          setGridPosts([])
          setHasMore(false)
          return
        }
        setFeatured(mapped[0])
        setGridPosts(mapped.slice(1))
        setPage(1)
        setHasMore(hasMorePages(meta, mapped.length))
      })
      .catch(e => {
        if (!cancelled) setError(e.message || 'Failed to load posts')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || loading || !hasMore) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && !loadingMoreRef.current) {
          loadMore()
        }
      },
      { root: null, rootMargin: '240px', threshold: 0 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loading, hasMore, loadMore])

  if (loading) {
    return (
      <section className="blog-page">
        <div className="container">
          <p className="api-state">Loading insights…</p>
        </div>
      </section>
    )
  }

  if (error && !featured && !gridPosts.length) {
    return (
      <section className="blog-page">
        <div className="container">
          <p className="api-state api-state--error">{error}</p>
        </div>
      </section>
    )
  }

  if (!featured) {
    return (
      <section className="blog-page">
        <div className="container">
          <p className="api-state">No insights published yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="blog-page">
      <div className="container">
        {error && (
          <p className="api-state api-state--error" style={{ marginBottom: 16 }}>{error}</p>
        )}
        <article className="blog-featured">
          <div className="blog-featured-body">
            <span className="blog-featured-eyebrow">
              <i className="fa-solid fa-star" aria-hidden="true" />
              Featured Article
            </span>
            <div className="blog-meta blog-featured-meta">
              <span className="blog-tag">{featured.category}</span>
              <span className="blog-dot" />
              <span>{featured.date}</span>
              <span className="blog-dot" />
              <span>{featured.read}</span>
            </div>
            <h2>
              <Link to={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p className="blog-featured-excerpt">{featured.excerpt}</p>
            <div className="blog-featured-footer">
              <div className="blog-author blog-featured-author">
                <div className="blog-avatar">{featured.initials}</div>
                <div>
                  <strong>{featured.author}</strong>
                  <span>{featured.role}</span>
                </div>
              </div>
              <Link to={`/blog/${featured.slug}`} className="btn btn-teal blog-read-btn">
                Read Article
                <span className="btn-ico" aria-hidden="true"><i className="fa-solid fa-arrow-up-right" /></span>
              </Link>
            </div>
          </div>
          <Link
            to={`/blog/${featured.slug}`}
            className="blog-featured-visual-link"
            aria-label={`Read ${featured.title}`}
          >
            <BlogCardVisual post={featured} forceLogoPanel className="blog-featured-card-visual" />
          </Link>
        </article>

        {gridPosts.length > 0 && (
          <div className="blog-grid">
            {gridPosts.map(post => (
              <article className="blog-card" key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="blog-card-visual-link" aria-label={`Read ${post.title}`}>
                  <BlogCardVisual post={post} forceLogoPanel />
                </Link>
                <div className="blog-card-body">
                  <div className="blog-meta">
                    <span className="blog-tag">{post.category}</span>
                    <span className="blog-dot" />
                    <span>{post.read}</span>
                  </div>
                  <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-card-footer">
                    <div className="blog-author">
                      <div className="blog-avatar blog-avatar--sm">{post.initials}</div>
                      <div>
                        <strong>{post.author}</strong>
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <Link to={`/blog/${post.slug}`} className="blog-link" aria-label={`Read ${post.title}`}>
                      <i className="fa-solid fa-arrow-up-right" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {hasMore && (
          <div ref={sentinelRef} className="blog-load-sentinel" aria-hidden="true" />
        )}

        {loadingMore && (
          <p className="api-state blog-load-more">Loading more posts…</p>
        )}
      </div>
    </section>
  )
}
