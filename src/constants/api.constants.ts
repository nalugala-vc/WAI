export const API_BASE_URL = 'https://api.weather-ai.co'

export const ENDPOINTS = {
  WEATHER: '/v1/weather',
  CURRENT: '/v1/current',
  DAILY: '/v1/daily',
  HOURLY: '/v1/hourly',
  FORECAST: '/v1/forecast',
  WEATHER_GEO: '/v1/weather-geo',
  TREES_ANALYZE: '/v1/trees/analyze',
  TREES_HISTORY: '/v1/trees/history',
  TREES_QUOTA: '/v1/trees/quota',
} as const
