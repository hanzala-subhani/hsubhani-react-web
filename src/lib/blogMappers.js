import { SITE_BRAND_FULL } from '../config/app.config'
import { plainTextPreview } from './htmlToPlain'

const PLACEHOLDER_STRINGS = new Set(['', 'string', 'null', 'undefined'])
const DEFAULT_AUTHOR = SITE_BRAND_FULL
const DEFAULT_AUTHOR_INITIALS = 'HZ'

function authorInitials(name) {
  if (!name) return DEFAULT_AUTHOR_INITIALS
  const trimmed = String(name).trim()
  if (!trimmed || trimmed.toLowerCase() === 'unknown') return DEFAULT_AUTHOR_INITIALS
  if (trimmed === DEFAULT_AUTHOR) return DEFAULT_AUTHOR_INITIALS
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function resolveAuthorName(row) {
  const raw = row?.author?.name != null ? String(row.author.name).trim() : ''
  if (!raw || raw.toLowerCase() === 'unknown') return DEFAULT_AUTHOR
  return raw
}

function formatPostDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

function formatDateBadge(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
  }
}

function estimateReadTime(content) {
  const plain = plainTextPreview(content, 100_000)
  const words = plain.split(/\s+/).filter(Boolean).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

function resolveSlug(row) {
  const raw = row?.slug != null ? String(row.slug).trim() : ''
  if (raw && !PLACEHOLDER_STRINGS.has(raw.toLowerCase())) return raw
  if (row?.id != null) return `post-${row.id}`
  return ''
}

/**
 * Map a blog-list API row to the shape used by Blog cards and detail pages.
 */
export function mapBlogRowFromApi(row) {
  const authorName = resolveAuthorName(row)
  const categoryName = row?.category?.name || 'Blog'
  const content = row?.content || ''

  return {
    id: row?.id,
    slug: resolveSlug(row),
    category: categoryName,
    category_id: row?.category_id,
    date: formatPostDate(row?.created_at || row?.updated_at),
    dateBadge: formatDateBadge(row?.created_at || row?.updated_at),
    read: estimateReadTime(content),
    title: row?.title || 'Untitled',
    excerpt: plainTextPreview(content, 220),
    initials: authorInitials(authorName),
    author: authorName,
    role: String(row?.author?.role || 'Author').replace(/_/g, ' '),
    featured_image: row?.featured_image,
    image: row?.featured_image,
    contentHtml: content,
    created_at: row?.created_at,
  }
}
