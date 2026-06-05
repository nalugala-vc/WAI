import { ENDPOINTS } from '../constants/api.constants'
import type { ApiWeatherPayload } from '../models/weather.api.model'
import type { WeatherResponse } from '../models/weather.model'
import { mapWeatherResponse } from '../utils/weather.mapper'
import { apiClient } from './api.client'

export interface WeatherFetchOptions {
  days?: number
  units?: 'metric' | 'imperial'
  lang?: 'en' | 'sw'
  ai?: boolean
}

export interface DailyFetchOptions {
  days?: number
  units?: 'metric' | 'imperial'
  ai?: boolean
}

export interface HourlyFetchOptions {
  days?: number
  units?: 'metric' | 'imperial'
}

function buildCoordParams(
  lat: number,
  lon: number,
  options?: WeatherFetchOptions | DailyFetchOptions | HourlyFetchOptions,
) {
  return {
    lat,
    lon,
    ...options,
  }
}

async function fetchWeatherPayload(
  endpoint: string,
  lat: number,
  lon: number,
  params: Record<string, string | number | boolean | undefined>,
): Promise<WeatherResponse> {
  const { data } = await apiClient.get<ApiWeatherPayload>(endpoint, {
    params: buildCoordParams(lat, lon, params),
  })
  return mapWeatherResponse(data)
}

export async function fetchWeather(
  lat: number,
  lon: number,
  options?: WeatherFetchOptions,
): Promise<WeatherResponse> {
  return fetchWeatherPayload(ENDPOINTS.WEATHER, lat, lon, {
    days: options?.days ?? 7,
    units: options?.units ?? 'metric',
    lang: options?.lang ?? 'en',
    ai: options?.ai ?? true,
  })
}

export async function fetchCurrent(
  lat: number,
  lon: number,
  options?: Omit<WeatherFetchOptions, 'days'>,
): Promise<WeatherResponse> {
  return fetchWeatherPayload(ENDPOINTS.CURRENT, lat, lon, {
    units: options?.units ?? 'metric',
    lang: options?.lang ?? 'en',
    ai: options?.ai ?? true,
  })
}

export async function fetchDaily(
  lat: number,
  lon: number,
  options?: DailyFetchOptions,
): Promise<WeatherResponse> {
  return fetchWeatherPayload(ENDPOINTS.DAILY, lat, lon, {
    days: options?.days ?? 7,
    units: options?.units ?? 'metric',
    ai: options?.ai ?? true,
  })
}

export async function fetchHourly(
  lat: number,
  lon: number,
  options?: HourlyFetchOptions,
): Promise<WeatherResponse> {
  return fetchWeatherPayload(ENDPOINTS.HOURLY, lat, lon, {
    days: options?.days ?? 1,
    units: options?.units ?? 'metric',
  })
}
