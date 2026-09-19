import { API_V1_BASE } from '../config/app.config'

const AUTH_STORAGE_KEY = 'course_user_token'

function joinUrl(path) {
  const p = path.startsWith('/') ? path.slice(1) : path
  return `${API_V1_BASE}/${p}`
}

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function setAuthToken(token) {
  try {
    if (!token) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      window.dispatchEvent(new Event('course-auth-changed'))
      return
    }
    localStorage.setItem(AUTH_STORAGE_KEY, String(token))
    window.dispatchEvent(new Event('course-auth-changed'))
  } catch {
    // ignore write errors from restricted storage contexts
  }
}

export function clearAuthToken() {
  setAuthToken('')
}

async function apiRequest(path, options = {}) {
  const { auth = false, headers = {}, body, ...rest } = options
  const token = auth ? getAuthToken() : ''
  const mergedHeaders = {
    Accept: 'application/json',
    ...headers,
  }
  if (auth && token) mergedHeaders.Authorization = `Bearer ${token}`

  const res = await fetch(joinUrl(path), {
    ...rest,
    headers: mergedHeaders,
    body,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || `${res.status} ${res.statusText}`)
  if (json.success === false) throw new Error(json.message || 'Request failed')
  return json.data
}

/**
 * GET JSON from API v1. Expects `{ success, message, data }`.
 */
export async function apiGet(path) {
  return apiRequest(path)
}

export async function apiPost(path, body = {}) {
  return apiRequest(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

/**
 * POST and return the full JSON body (not only `data`), for endpoints that expose extra fields.
 */
export async function apiPostRaw(path, body = {}) {
  const res = await fetch(joinUrl(path), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || `${res.status} ${res.statusText}`)
  if (json.success === false) throw new Error(json.message || 'Request failed')
  return json
}

export async function apiGetAuth(path) {
  return apiRequest(path, { auth: true })
}

export async function apiPostAuth(path, body = {}) {
  return apiRequest(path, {
    auth: true,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}
