import { SERVER_API_ORIGIN } from '../config/app.config'
import blogBannerFallback from '../images/hanzala-logo.webp'

export { blogBannerFallback }

/**
 * Resolve a post cover image from API/database fields. Returns null if none set.
 */
export function resolvePostBannerUrl(post) {
  if (!post) return null
  const raw =
    post.image_url ??
    post.imageUrl ??
    post.featured_image_url ??
    post.featured_image ??
    post.thumbnail_url ??
    post.thumbnail ??
    post.cover_image ??
    post.banner_image ??
    post.image
  if (raw == null || raw === '') return null
  const s = String(raw).trim()
  if (!s) return null
  if (/^https?:\/\//i.test(s)) return s
  const clean = s.replace(/^\//, '')
  if (clean.startsWith('storage/')) return `${SERVER_API_ORIGIN}/${clean}`
  return `${SERVER_API_ORIGIN}/storage/${clean}`
}

/** Database image when present, otherwise hanzala-logo.webp */
export function getPostBannerUrl(post) {
  return resolvePostBannerUrl(post) || blogBannerFallback
}
