import axios from 'axios'

// Set VITE_API_URL and VITE_USE_MOCK=false in your .env to connect a real backend
// implementing the endpoints documented in each *Service.js file.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://eventtn-1.onrender.com',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eventtn_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('eventtn_token')
      localStorage.removeItem('eventtn_user')
    }
    return Promise.reject(error)
  }
)

// Simulates network latency in mock mode so loading states are visible/testable.
export const mockDelay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

export default api
