import {
  apiPost,
  apiPostRaw,
  apiGet,
  apiGetAuth,
  apiPostAuth,
  clearAuthToken,
  setAuthToken,
} from './api'

function readRows(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

function flattenCategories(nodes, level = 0, out = []) {
  if (!Array.isArray(nodes)) return out
  nodes.forEach(node => {
    if (!node?.id) return
    out.push({
      id: node.id,
      name: node.name || node.title || 'Untitled',
      level,
      slug: node.slug || '',
    })
    const children = node.subcategories || node.children || []
    flattenCategories(children, level + 1, out)
  })
  return out
}

export async function loginCourseUser(email, password) {
  const data = await apiPost('auth/login', { email, password })
  const token = data?.token || ''
  if (!token) throw new Error('Token missing in login response')
  setAuthToken(token)
  return data?.user || null
}

export async function registerCourseUser(name, email, password) {
  const data = await apiPost('auth/register', { name, email, password })
  const token = data?.token || ''
  if (!token) throw new Error('Token missing in register response')
  setAuthToken(token)
  return data?.user || null
}

export async function logoutCourseUser() {
  try {
    await apiPostAuth('auth/logout')
  } finally {
    clearAuthToken()
  }
}

export async function getCourseCurrentUser() {
  return apiGetAuth('auth/me')
}

export async function getMyCourses() {
  const data = await apiGetAuth('user/courses')
  return readRows(data)
}

export async function getMyCourse(courseId) {
  return apiGetAuth(`user/courses/${courseId}`)
}

export async function getCourseCategories() {
  const data = await apiGet('course-categories')
  const roots = readRows(data)
  return flattenCategories(roots)
}

export async function createMyCourse(payload) {
  return apiPostAuth('user/courses', payload)
}

export async function getCourseTopics(courseId) {
  const data = await apiGetAuth(`user/courses/${courseId}/topics`)
  return readRows(data)
}

export async function createCourseTopic(courseId, payload) {
  return apiPostAuth(`user/courses/${courseId}/topics`, payload)
}

export async function getTopicLessons(courseId, topicId) {
  const data = await apiGetAuth(`user/courses/${courseId}/topics/${topicId}/lessons`)
  return readRows(data)
}

export async function createTopicLesson(courseId, topicId, payload) {
  return apiPostAuth(`user/courses/${courseId}/topics/${topicId}/lessons`, payload)
}

export async function getPublicCourseCategoryTree() {
  const data = await apiGet('course-categories')
  const roots = readRows(data)
  return Array.isArray(roots) ? roots : []
}

/**
 * Full category tree with nested `courses` per category (POST catalog).
 * @param {{ courses_per_category?: number, include_unpublished?: boolean }} [options]
 */
export async function getPublicCourseCatalog(options = {}) {
  const data = await apiPost('web/course-catalog', {
    courses_per_category: 500,
    include_unpublished: true,
    ...options,
  })
  if (Array.isArray(data)) return data
  const rows = readRows(data)
  return Array.isArray(rows) ? rows : []
}

export async function getPublicCourses(params = {}) {
  const search = new URLSearchParams()
  if (params.category_id) search.set('category_id', String(params.category_id))
  if (params.page) search.set('page', String(params.page))
  search.set('per_page', String(Math.min(50, Number(params.per_page) || 12)))
  const qs = search.toString()
  const data = await apiGet(`courses${qs ? `?${qs}` : ''}`)
  if (data && Array.isArray(data.data)) {
    return {
      items: data.data,
      meta: {
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      },
    }
  }
  if (Array.isArray(data)) return { items: data, meta: null }
  const items = readRows(data)
  return { items, meta: null }
}

export async function getPublicCourseBySlug(slug) {
  return apiGet(`courses/slug/${encodeURIComponent(slug)}`)
}

export async function getPublicCourseById(courseId) {
  return apiGet(`courses/${encodeURIComponent(courseId)}`)
}

/** Single lesson (full body) for public player when list endpoints omit HTML. */
export async function getPublicCourseLesson(courseId, lessonId) {
  const cid = encodeURIComponent(courseId)
  const lid = encodeURIComponent(lessonId)
  const data = await apiGet(`courses/${cid}/lessons/${lid}`)
  if (data && typeof data === 'object' && data.lesson && typeof data.lesson === 'object') return data.lesson
  return data
}

/**
 * Public topics + lesson list (POST). Merges with {@link getPublicCourseById} in the UI for lesson bodies.
 * @returns {{ courseId: number, topics: Array }}
 */
export async function getPublicCourseTopicsPayload(courseId) {
  const id = Number(courseId)
  if (!Number.isFinite(id)) throw new Error('Invalid course id')
  const json = await apiPostRaw('courses/topics', { course_id: id })
  const topics = Array.isArray(json.data) ? json.data : readRows(json)
  const resolvedId = json.course_id != null ? Number(json.course_id) : id
  return { courseId: resolvedId, topics: Array.isArray(topics) ? topics : [] }
}

/** Overlay POST topic/lesson shape with rich lesson fields (content, youtube_url, …) from a full course payload. */
export function mergePostTopicsWithRichLessons(postTopics, richCourse) {
  if (!Array.isArray(postTopics) || !postTopics.length) {
    return Array.isArray(richCourse?.topics) ? richCourse.topics : []
  }
  const richLessonById = new Map()
  for (const t of richCourse?.topics || []) {
    for (const l of t.lessons || []) {
      if (l?.id != null) {
        richLessonById.set(Number(l.id), l)
        richLessonById.set(String(l.id), l)
      }
    }
  }
  return postTopics.map(t => ({
    ...t,
    lessons: (t.lessons || []).map(l => {
      const rid = l?.id != null ? l.id : null
      const rich =
        rid != null ? richLessonById.get(rid) ?? richLessonById.get(Number(rid)) : null
      if (!rich) return l
      const merged = { ...l, ...rich }
      for (const key of Object.keys(l)) {
        const shellVal = l[key]
        const richVal = rich[key]
        if (
          (richVal === '' || richVal == null) &&
          shellVal != null &&
          shellVal !== ''
        ) {
          merged[key] = shellVal
        }
      }
      return merged
    }),
  }))
}
