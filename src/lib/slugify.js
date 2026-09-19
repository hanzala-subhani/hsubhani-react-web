/** URL slug from a display name (aligned with typical Laravel Str::slug). */
export function slugify(str) {
  if (!str || typeof str !== 'string') return ''
  return str
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
