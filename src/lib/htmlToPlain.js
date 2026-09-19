/**
 * Turn HTML (or mixed) into a single line of plain text with entities decoded.
 */
export function htmlToPlainText(html) {
  if (html == null || html === '') return ''
  const raw = String(html)
  if (typeof document !== 'undefined') {
    const d = document.createElement('div')
    d.innerHTML = raw
    const text = d.textContent || d.innerText || ''
    return text.replace(/\s+/g, ' ').trim()
  }
  return raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\s+/g, ' ')
    .trim()
}

/** Plain-text preview for list cards: no tags, max length with ellipsis. */
export function plainTextPreview(html, maxLen = 250) {
  const plain = htmlToPlainText(html)
  if (plain.length <= maxLen) return plain
  return `${plain.slice(0, maxLen).trimEnd()}…`
}
