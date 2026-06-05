import axios from 'axios'
import { ENDPOINTS } from '../constants/api.constants'
import type { ApiWeatherPayload } from '../models/weather.api.model'
import type { WeatherResponse } from '../models/weather.model'
import {
  defaultAiUnavailableReason,
  extractAiSummary,
  mapWeatherResponse,
  parseAiResponseHeaders,
} from '../utils/weather.mapper'
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

function attachAiMeta(
  mapped: WeatherResponse,
  headers: Record<string, unknown>,
  lang: 'en' | 'sw',
): WeatherResponse {
  const ai_meta = parseAiResponseHeaders(headers)
  if (mapped.ai_summary) {
    return { ...mapped, ai_meta }
  }

  return {
    ...mapped,
    ai_meta,
    ai_unavailable_reason:
      mapped.ai_unavailable_reason ??
      defaultAiUnavailableReason(ai_meta, lang),
  }
}

async function fetchWeatherPayload(
  endpoint: string,
  lat: number,
  lon: number,
  params: Record<string, string | number | boolean | undefined>,
  lang: 'en' | 'sw' = 'en',
): Promise<WeatherResponse> {
  const { data, headers } = await apiClient.get<ApiWeatherPayload>(endpoint, {
    params: buildCoordParams(lat, lon, params),
  })
  return attachAiMeta(
    mapWeatherResponse(data),
    headers as Record<string, unknown>,
    lang,
  )
}

export interface InsightsFetchOptions {
  days?: number
  units?: 'metric' | 'imperial'
  lang?: 'en' | 'sw'
}

export async function fetchInsights(
  lat: number,
  lon: number,
  options?: InsightsFetchOptions,
): Promise<Pick<WeatherResponse, 'ai_summary' | 'ai_unavailable_reason'>> {
  const lang = options?.lang ?? 'en'

  try {
    const { data, headers } = await apiClient.get<ApiWeatherPayload>(
      ENDPOINTS.INSIGHTS,
      {
        params: buildCoordParams(lat, lon, {
          days: options?.days ?? 7,
          units: options?.units ?? 'metric',
          lang,
        }),
      },
    )
    const summary = extractAiSummary(data)
    if (summary) {
      return { ai_summary: summary }
    }

    const ai_meta = parseAiResponseHeaders(headers as Record<string, unknown>)
    return {
      ai_summary: '',
      ai_unavailable_reason: defaultAiUnavailableReason(ai_meta, lang),
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      const message =
        (error.response.data as { error?: string })?.error ??
        (lang === 'sw'
          ? 'Maarifa ya AI yanahitaji mpango wa Pro au Scale.'
          : 'AI Insights require a Pro or Scale plan.')
      return { ai_summary: '', ai_unavailable_reason: message }
    }
    throw error
  }
}

export async function fetchWeather(
  lat: number,
  lon: number,
  options?: WeatherFetchOptions,
): Promise<WeatherResponse> {
  const lang = options?.lang ?? 'en'
  return fetchWeatherPayload(
    ENDPOINTS.WEATHER,
    lat,
    lon,
    {
      days: options?.days ?? 7,
      units: options?.units ?? 'metric',
      lang,
      ai: options?.ai ?? false,
    },
    lang,
  )
}

export async function fetchCurrent(
  lat: number,
  lon: number,
  options?: Omit<WeatherFetchOptions, 'days'>,
): Promise<WeatherResponse> {
  const lang = options?.lang ?? 'en'
  return fetchWeatherPayload(
    ENDPOINTS.CURRENT,
    lat,
    lon,
    {
      units: options?.units ?? 'metric',
      lang,
      ai: false,
    },
    lang,
  )
}

export async function fetchDaily(
  lat: number,
  lon: number,
  options?: DailyFetchOptions,
): Promise<WeatherResponse> {
  return fetchWeatherPayload(ENDPOINTS.DAILY, lat, lon, {
    days: options?.days ?? 7,
    units: options?.units ?? 'metric',
    ai: false,
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
    ai: false,
  })
}
