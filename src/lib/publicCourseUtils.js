import { SERVER_API_ORIGIN } from '../config/app.config'
import { plainTextPreview } from './htmlToPlain'

export function publicCourseThumbnailUrl(course) {
  if (!course) return null
  if (course.thumbnail_url) return course.thumbnail_url
  const path = course.thumbnail_path
  if (!path) return null
  const clean = String(path).replace(/^\//, '')
  if (/^https?:\/\//i.test(clean)) return clean
  return `${SERVER_API_ORIGIN}/storage/${clean}`
}

export function publicCourseExcerpt(course, maxLen = 140) {
  const raw = course?.description || course?.excerpt || ''
  return plainTextPreview(raw, maxLen)
}

export function formatCoursePrice(course) {
  if (!course) return ''
  if (course.is_free) return 'Free'
  const amt = course.price_amount
  const cur = course.currency || 'USD'
  if (amt == null || amt === '') return 'Paid'
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(Number(amt))
  } catch {
    return `${cur} ${amt}`
  }
}
