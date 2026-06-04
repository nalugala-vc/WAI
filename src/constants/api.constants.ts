export const API_BASE_URL = 'https://api.weather-ai.co'

export const WEATHER_ENDPOINTS = {
  WEATHER: '/v1/weather',
  CURRENT: '/v1/current',
  HOURLY: '/v1/hourly',
  DAILY: '/v1/daily',
} as const

export const TREES_ENDPOINTS = {
  ANALYZE: '/v1/trees/analyze',
  HISTORY: '/v1/trees/history',
} as const

export const GEO_ENDPOINTS = {
  WEATHER_GEO: '/v1/weather-geo',
} as const
