import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const refresh = localStorage.getItem('refresh')
    const isAuthRoute = original.url.includes('/auth/')

    if (error.response?.status === 401 && refresh && !original._retry && !isAuthRoute) {
      original._retry = true
      try {
        const { data } = await axios.post('/api/auth/refresh/', { refresh })
        localStorage.setItem('access', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Transforma os erros do DRF ({campo: ["msg"]}) em texto legível
export function errorMessage(error) {
  const data = error.response?.data
  if (!data) return 'Não foi possível conectar ao servidor.'
  if (typeof data === 'string') return 'Erro inesperado no servidor.'
  if (data.detail) return data.detail
  return Object.entries(data)
    .map(([campo, msgs]) => `${campo}: ${[].concat(msgs).join(' ')}`)
    .join('\n')
}

export default api