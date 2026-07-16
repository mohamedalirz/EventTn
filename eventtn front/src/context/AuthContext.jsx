import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = authService.getStoredUser()
    setUser(stored)
    setLoading(false)
  }, [])

  async function login(credentials) {
    const { user: loggedInUser } = await authService.login(credentials)
    setUser(loggedInUser)
    return loggedInUser
  }

  async function register(payload) {
    const { user: newUser } = await authService.register(payload)
    setUser(newUser)
    return newUser
  }

  function logout() {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
