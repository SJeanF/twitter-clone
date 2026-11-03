import { createContext, useContext, useEffect, useState } from 'react'
import api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadUser() {
    const { data } = await api.get('/profile/me/')
    setUser(data)
    return data
  }

  useEffect(() => {
    if (!localStorage.getItem('access')) {
      setLoading(false)
      return
    }
    loadUser()
      .catch(() => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(username, password) {
    const { data } = await api.post('/auth/login/', { username, password })
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    await loadUser()
  }

  async function register(username, email, password) {
    await api.post('/auth/register/', { username, email, password })
    await login(username, password)
  }

  function logout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)