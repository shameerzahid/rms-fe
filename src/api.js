const AUTH_KEY = 'rms_admin_auth'

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY))
  } catch {
    return null
  }
}

export function setSession(session) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(AUTH_KEY)
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const session = getSession()
    if (session?.token) headers.Authorization = `Bearer ${session.token}`
  }

  const res = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password } }),
  getPages: () => request('/api/pages'),
  getReviews: () => request('/api/reviews'),
  createReview: (fields, { auth = true } = {}) =>
    request('/api/reviews', { method: 'POST', body: fields, auth }),
  updateReview: (id, patch) =>
    request(`/api/reviews/${id}`, { method: 'PATCH', body: patch, auth: true }),
  deleteReview: (id) =>
    request(`/api/reviews/${id}`, { method: 'DELETE', auth: true }),
}
