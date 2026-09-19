const trimSlash = s => String(s || '').replace(/\/+$/, '')

const env = import.meta.env || {}

/**
 * API v1 root — local (Laravel dev server). No trailing slash.
 * @see https://vitejs.dev/guide/env-and-mode.html
 */
//export const API_V1_BASE_LOCAL = 'http://127.0.0.1:8000/api/v1'
export const API_V1_BASE_LOCAL = 'https://blog-api.hsubhani.com/api/v1'
/**
 * API v1 root — deployed server. No trailing slash.
 */
export const API_V1_BASE_SERVER = 'https://blog-api.hsubhani.com/api/v1'

/**
 * When set, overrides both local and production defaults (full URL to `/api/v1`, no trailing slash).
 * @example VITE_API_V1_BASE=http://127.0.0.1:8000/api/v1
 */
const envApiV1Base = env.VITE_API_V1_BASE ? trimSlash(env.VITE_API_V1_BASE) : null

/**
 * Active API v1 base URL used by `apiGet` / `apiPost`.
 * - Development build: {@link API_V1_BASE_LOCAL}
 * - Production build: {@link API_V1_BASE_SERVER}
 * - Override: `VITE_API_V1_BASE`
 */
export const API_V1_BASE =
  envApiV1Base ||
  (env.PROD ? trimSlash(API_V1_BASE_SERVER) : trimSlash(API_V1_BASE_LOCAL))

/**
 * Backend origin (scheme + host + port) for resolving relative media paths (e.g. blog images).
 * Derived from {@link API_V1_BASE} unless `VITE_SERVER_API_ORIGIN` is set.
 */
function originFromApiV1Base(apiBase) {
  try {
    return new URL(trimSlash(apiBase)).origin
  } catch {
    return 'http://127.0.0.1:8000'
  }
}

export const SERVER_API_ORIGIN = env.VITE_SERVER_API_ORIGIN
  ? trimSlash(env.VITE_SERVER_API_ORIGIN)
  : originFromApiV1Base(API_V1_BASE)

/**
 * This SPA’s public URL (dev or production). No trailing slash.
 * @example http://localhost:5173
 */
export const LOCAL_APP_URL = trimSlash(
  env.VITE_LOCAL_APP_URL || 'http://localhost:5173',
)

/** Agency brand (public site). Founder name kept for About / bylines. */
export const SITE_BRAND_MARK = 'Hanzala Subhani'
export const SITE_BRAND_AGENCY = 'Hanzala Subhani'
export const SITE_BRAND_FIRST = 'Hanzala'
export const SITE_BRAND_LAST = 'Subhani'
export const SITE_BRAND_FULL = `${SITE_BRAND_FIRST} ${SITE_BRAND_LAST}`
export const SITE_POSITIONING = 'Software Development & AI Solutions Agency'
export const SITE_AGENCY_SHORT = 'Software Development Agency'
export const SITE_FOUNDER_LED = 'Hanzala Subhani is a founder-led software development agency.'
export const SITE_TAGLINE =
  'Hanzala Subhani is a founder-led software development agency. Production web applications, APIs and AI-powered business solutions—designed, built and scaled for the businesses that use them.'
export const SITE_STACK = ['Laravel', 'Node.js', 'React', 'Python', 'FastAPI', 'AI', 'Cloud']
export const CTA_PRIMARY = 'Start a Project'
export const CTA_NAV = 'Start a Project'
export const CTA_SECONDARY = 'Book a Technical Consultation'
export const CTA_TALK = 'Talk to Hanzala Subhani'
export const SITE_FOUNDER_ROLE = 'Founder & Technical Lead'
export const SITE_FOUNDER_KICKER = 'Founded & Technically Led By'
export const SITE_ABOUT_LEAD =
  'Hanzala Subhani is a founder-led software development agency focused on building scalable digital products for businesses.'
export const SITE_FOUNDER_BIO =
  'Hanzala Subhani is a software engineer and technical lead with 16+ years of professional experience in PHP, Laravel, Node.js, React and backend architecture.'
export const AGENCY_EXPERTISE = [
  { icon: 'fa-solid fa-server', title: 'Backend engineering' },
  { icon: 'fa-solid fa-diagram-project', title: 'API architecture' },
  { icon: 'fa-solid fa-cloud', title: 'SaaS development' },
  { icon: 'fa-solid fa-window-maximize', title: 'Web applications' },
  { icon: 'fa-solid fa-microchip', title: 'AI integration' },
  { icon: 'fa-solid fa-cloud-arrow-up', title: 'Cloud architecture' },
  { icon: 'fa-solid fa-recycle', title: 'System modernization' },
  { icon: 'fa-solid fa-comments', title: 'Technical consulting' },
]

/** Delivery stats shared by Home and About. Use only numbers we can stand behind. */
export const CAREER_HIGHLIGHTS = [
  { value: '16+', label: 'Years experience' },
  { value: '50K+', label: 'Monthly API requests*', note: true },
  { value: '20+', label: 'Projects' },
  { value: 'Multiple', label: 'Industries' },
]
export const EXPERIENCE_HEADING = '16+ Years of Software Engineering Experience'
export const EXPERIENCE_LEAD =
  'Hanzala Subhani brings more than 16 years of hands-on software engineering experience across backend development, APIs, web applications, architecture and technical leadership.'
export const STATS_FOOTNOTE =
  '*Monthly request volume from production APIs Hanzala Subhani operates and maintains.'

/** Agency bio shown on blog article sidebar. */
export const AUTHOR_BIO =
  'Hanzala Subhani is a founder-led software development agency specializing in Laravel, Node.js, React, and AI-powered business solutions.'

/** Inspirational quote shown on blog article sidebar. */
export const BLOG_SIDEBAR_QUOTE = {
  text: 'First, solve the problem. Then, write the code.',
  author: 'John Johnson',
}

/** Public contact & social (header topbar). */
export const CONTACT_PHONE = '+91-9354391972'
export const CONTACT_PHONE_TEL = '+91-9354391972'
export const CONTACT_EMAIL = 'hanzalamca@gmail.com'
export const CONTACT_INQUIRY_EMAIL = 'hcl.subhani@gmail.com'

/** WhatsApp number in wa.me format: country code first, digits only. */
export const CONTACT_WHATSAPP = '919354391972'
export const WHATSAPP_PREFILL = `Hi ${SITE_BRAND_MARK}, I'd like to discuss a project.`
export const WHATSAPP_LINK = `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', href: 'https://www.linkedin.com/in/hanzala-subhani-5265641a/' },
  { label: 'GitHub', icon: 'fa-brands fa-github', href: 'https://github.com/hanzala-subhani' },
  { label: 'Facebook', icon: 'fa-brands fa-facebook-f', href: 'https://www.facebook.com/hanzala.subhani' },
  { label: 'X', icon: 'fa-brands fa-x-twitter', href: 'https://x.com/SubhaniHanzala' },
]
