import { apiGet, apiPost } from './api'

function readBlogRows(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

function readBlogMeta(payload) {
  if (!payload || Array.isArray(payload)) return null
  if (payload.current_page == null && payload.total == null) return null
  return {
    current_page: payload.current_page,
    last_page: payload.last_page,
    total: payload.total,
    per_page: payload.per_page,
  }
}

/**
 * Public blog list (POST). Body matches Laravel `blog-list` endpoint.
 * @param {{ per_page?: number, page?: number, category_id?: number, search?: string }} [options]
 */
export async function getBlogList(options = {}) {
  const per_page = Math.min(50, Math.max(1, Number(options.per_page) || 15))
  const body = { per_page }

  const page = Number(options.page)
  if (Number.isFinite(page) && page > 1) {
    body.page = page
  }
  if (options.category_id != null && options.category_id !== '') {
    body.category_id = Number(options.category_id) || 0
  }
  if (options.search != null && String(options.search).trim() !== '') {
    body.search = String(options.search)
  }

  const payload = await apiPost('blog-list', body)

  return {
    items: readBlogRows(payload),
    meta: readBlogMeta(payload),
  }
}

/** Full blog post by id (includes HTML content). */
export async function getBlogById(id) {
  return apiGet(`blog-list/${encodeURIComponent(id)}`)
}

/**
 * Resolve a blog post by slug. Tries slug endpoint, then id fallback, then list scan.
 */
export async function getBlogBySlug(slug) {
  const s = String(slug || '').trim()
  if (!s) throw new Error('Post not found')

  try {
    return await apiGet(`blog-list/slug/${encodeURIComponent(s)}`)
  } catch {
    // slug route may be unavailable on some API builds
  }

  const idMatch = /^post-(\d+)$/.exec(s)
  if (idMatch) {
    return getBlogById(idMatch[1])
  }

  let page = 1
  while (page <= 50) {
    const { items, meta } = await getBlogList({ per_page: 50, page })
    const hit = items.find(row => String(row?.slug || '').trim() === s)
    if (hit?.id != null) return getBlogById(hit.id)
    if (!meta || meta.current_page >= meta.last_page) break
    page += 1
  }

  throw new Error('Post not found')
}
