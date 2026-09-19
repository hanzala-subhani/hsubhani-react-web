import { slugify } from './slugify'

const CATEGORY_ICONS = [
  'fa-chart-line',
  'fa-briefcase',
  'fa-gears',
  'fa-users',
  'fa-lightbulb',
  'fa-layer-group',
  'fa-compass',
  'fa-rocket',
]

const SUB_ICONS = [
  'fa-book',
  'fa-code',
  'fa-terminal',
  'fa-database',
  'fa-microchip',
  'fa-diagram-project',
  'fa-flask',
  'fa-brain',
]

/**
 * Maps category tree from either:
 * - `GET interview-categories` (parents with `children`), or
 * - `GET web/interview-categories` (parents with `subcategories` + `questions_count`).
 */
function categorySlug(row) {
  const raw = row?.slug != null && String(row.slug).trim() !== '' ? String(row.slug).trim() : ''
  return raw || slugify(row?.name || '')
}

export function mapInterviewCategoriesApi(data) {
  const roots = Array.isArray(data) ? data : []
  return roots.map((parent, pi) => {
    const rawSubs = parent.children ?? parent.subcategories ?? []
    return {
      id: parent.id,
      slug: categorySlug(parent),
      title: parent.name,
      icon: CATEGORY_ICONS[pi % CATEGORY_ICONS.length],
      questions_count:
        parent.questions_count ?? parent.contents_count ?? undefined,
      subs: rawSubs.map((child, si) => ({
        id: child.id,
        slug: categorySlug(child),
        label: child.name,
        icon: SUB_ICONS[si % SUB_ICONS.length],
        questions_count:
          child.questions_count ?? child.contents_count ?? undefined,
      })),
    }
  })
}

function normSlug(s) {
  return String(s || '').trim().toLowerCase()
}

export function findCategoryBySlug(categories, catSlug) {
  const n = normSlug(catSlug)
  if (!n) return null
  return (
    categories.find(c => normSlug(c.slug) === n)
    || categories.find(c => normSlug(slugify(c.title)) === n)
    || null
  )
}

export function findSubBySlug(category, subSlug) {
  if (!category) return null
  const n = normSlug(subSlug)
  if (!n) return null
  return (
    category.subs.find(s => normSlug(s.slug) === n)
    || category.subs.find(s => normSlug(slugify(s.label)) === n)
    || null
  )
}

/** Numeric PK so URL `q` and API values always match (string "3" vs number 3). */
function normalizeId(value) {
  if (value == null || value === '') return NaN
  const n = Number(value)
  return Number.isFinite(n) ? n : NaN
}

/** Web questions list: title + description */
export function mapQuestionsFromApi(questions) {
  return (questions || [])
    .map(row => ({
      id: normalizeId(row?.id),
      slug: row.slug,
      q: row.title,
      a: row.description || '',
    }))
    .filter(x => Number.isFinite(x.id))
}

/** GET interview-list/{id} — full row for detail view */
export function mapInterviewContentRecord(row) {
  if (!row) return null
  const id = normalizeId(row.id)
  if (!Number.isFinite(id)) return null
  return {
    id,
    slug: row.slug,
    q: row.title,
    a: row.description || '',
    category_id: row.category_id != null ? Number(row.category_id) : undefined,
  }
}

/** GET web/interview-detail?cat&sub&q&question_id */
export function mapWebInterviewDetail(data) {
  if (!data) return null
  const row = data.question
  const id = row ? normalizeId(row.id) : NaN
  return {
    category: data.category || null,
    position: data.position
      ? {
          q: data.position.q,
          index: data.position.index,
          serial: data.position.serial != null ? Number(data.position.serial) : null,
          total: data.position.total != null ? Number(data.position.total) : null,
        }
      : null,
    navigation: data.navigation
      ? {
          prev_question_id:
            data.navigation.prev_question_id != null
              ? normalizeId(data.navigation.prev_question_id)
              : null,
          next_question_id:
            data.navigation.next_question_id != null
              ? normalizeId(data.navigation.next_question_id)
              : null,
        }
      : null,
    question: row && Number.isFinite(id)
      ? {
          id,
          title: row.title,
          slug: row.slug,
          description: row.description || '',
        }
      : null,
  }
}
