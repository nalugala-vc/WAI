import { GEO_ENDPOINTS } from '../constants/api.constants'
import type { GeoDetectionResponse } from '../models/geo.model'
import { apiClient } from './api.client'

export async function fetchWeatherGeo(): Promise<GeoDetectionResponse> {
  const { data } = await apiClient.get<GeoDetectionResponse>(
    GEO_ENDPOINTS.WEATHER_GEO,
    { params: { ip: 'auto' } },
  )
  return data
}
