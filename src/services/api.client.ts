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
