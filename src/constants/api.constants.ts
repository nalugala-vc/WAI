/** In production, calls go through /api/wai to avoid browser CORS blocks. */
export const API_BASE_URL = import.meta.env.PROD
  ? '/api/wai'
  : 'https://api.weather-ai.co'

export const USE_API_PROXY = import.meta.env.PROD

export const ENDPOINTS = {
  WEATHER: '/v1/weather',
  CURRENT: '/v1/current',
  DAILY: '/v1/daily',
  HOURLY: '/v1/hourly',
  FORECAST: '/v1/forecast',
  WEATHER_GEO: '/v1/weather-geo',
  INSIGHTS: '/v1/insights',
  TREES_ANALYZE: '/v1/trees/analyze',
  TREES_HISTORY: '/v1/trees/history',
  TREES_QUOTA: '/v1/trees/quota',
} as const
