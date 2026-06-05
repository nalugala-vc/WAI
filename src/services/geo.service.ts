import { ENDPOINTS } from '../constants/api.constants'
import type { ApiWeatherPayload } from '../models/weather.api.model'
import type { GeoWeatherResponse } from '../models/geo.model'
import { mapGeoWeatherResponse } from '../utils/weather.mapper'
import { apiClient } from './api.client'

export interface GeoWeatherFetchOptions {
  days?: number
  lang?: 'en' | 'sw'
  ai?: boolean
}

export async function fetchGeoWeather(
  options?: GeoWeatherFetchOptions,
): Promise<GeoWeatherResponse> {
  const { data } = await apiClient.get<ApiWeatherPayload>(
    ENDPOINTS.WEATHER_GEO,
    {
      params: {
        ip: 'auto',
        days: options?.days ?? 7,
        lang: options?.lang ?? 'en',
        ai: false,
      },
    },
  )
  return mapGeoWeatherResponse(data)
}
