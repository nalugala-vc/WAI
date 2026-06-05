import axios from 'axios'
import { API_BASE_URL, USE_API_PROXY } from '../constants/api.constants'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  if (!USE_API_PROXY) {
    const apiKey = import.meta.env.VITE_WAI_API_KEY
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`
    }
  }
  return config
})

apiClient.interceptors.response.use((response) => {
  const contentType = String(response.headers['content-type'] ?? '')
  const data = response.data

  if (
    typeof data === 'string' &&
    (contentType.includes('text/html') || data.trimStart().startsWith('<!'))
  ) {
    return Promise.reject(
      new Error(
        'The API proxy is not running — the server returned the app page instead of weather data. Redeploy with the latest code and set VITE_WAI_API_KEY on Vercel.',
      ),
    )
  }

  return response
})
