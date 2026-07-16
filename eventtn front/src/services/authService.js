import api, { USE_MOCK, mockDelay } from './api'
import { mockDb } from './mockDb'

const TOKEN_KEY = 'eventtn_token'
const USER_KEY = 'eventtn_user'

function mockToken(user) {
  return btoa(JSON.stringify({ sub: user.id, role: user.role, iat: Date.now() }))
}

async function register({ name, email, password, role }) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    if (db.users.some((u) => u.email === email)) {
      throw new Error('An account with this email already exists.')
    }
    const user = { id: `user_${Date.now()}`, name, email, role, password }
    db.users.push(user)
    mockDb.save(db)
    const { password: _pw, ...safeUser } = user
    const token = mockToken(user)
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser))
    return { user: safeUser, token }
  }
  const { data } = await api.post('/auth/register', { name, email, password, role })
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  return data
}

async function login({ email, password }) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    const user = db.users.find((u) => u.email === email && u.password === password)
    if (!user) throw new Error('Invalid email or password.')
    const { password: _pw, ...safeUser } = user
    const token = mockToken(user)
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser))
    return { user: safeUser, token }
  }
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  return data
}

function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

async function me() {
  if (USE_MOCK) {
    await mockDelay(150)
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  }
  const { data } = await api.get('/auth/me')
  return data
}

function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export const authService = { register, login, logout, me, getStoredUser, getToken }
