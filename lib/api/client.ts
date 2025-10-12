import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-1eee.up.railway.app'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token storage - will be updated by AuthProvider
let currentAccessToken: string | null = null

// Function for AuthProvider to set the token
export const setApiToken = (token: string | null) => {
  currentAccessToken = token
}

// Function to get current token (for debugging)
export const getApiToken = () => currentAccessToken

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`
  }
  return config
})

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      // BUT: Don't redirect if we're on the success page (auth might be initializing)
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        const isSuccessPage = currentPath.includes('/success')
        
        if (!isSuccessPage) {
          window.location.href = '/auth/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

