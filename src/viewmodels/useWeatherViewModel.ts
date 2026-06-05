import { useQuery } from '@tanstack/react-query'
import type {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
} from '../models/weather.model'
import {
  fetchDaily,
  fetchHourly,
  fetchInsights,
  fetchWeather,
} from '../services/weather.service'
import { useAppStore } from './useAppStore'

export const weatherQueryKeys = {
  all: ['weather'] as const,
  summary: (
    lat: number,
    lon: number,
    lang: 'en' | 'sw',
    units: 'metric' | 'imperial',
  ) => [...weatherQueryKeys.all, 'summary', lat, lon, lang, units] as const,
  hourly: (
    lat: number,
    lon: number,
    units: 'metric' | 'imperial',
  ) => [...weatherQueryKeys.all, 'hourly', lat, lon, units] as const,
  daily: (
    lat: number,
    lon: number,
    units: 'metric' | 'imperial',
  ) => [...weatherQueryKeys.all, 'daily', lat, lon, units] as const,
  insights: (
    lat: number,
    lon: number,
    lang: 'en' | 'sw',
    units: 'metric' | 'imperial',
  ) => [...weatherQueryKeys.all, 'insights', lat, lon, lang, units] as const,
}

export function useWeatherViewModel(
  lat: number | null,
  lon: number | null,
  lang: 'en' | 'sw',
) {
  const units = useAppStore((state) => state.units)
  const enabled = lat !== null && lon !== null

  const weatherQuery = useQuery({
    queryKey: weatherQueryKeys.summary(lat ?? 0, lon ?? 0, lang, units),
    queryFn: () =>
      fetchWeather(lat!, lon!, { days: 7, lang, units, ai: false }),
    enabled,
  })

  const hourlyQuery = useQuery({
    queryKey: weatherQueryKeys.hourly(lat ?? 0, lon ?? 0, units),
    queryFn: () => fetchHourly(lat!, lon!, { days: 1, units }),
    enabled,
  })

  const dailyQuery = useQuery({
    queryKey: weatherQueryKeys.daily(lat ?? 0, lon ?? 0, units),
    queryFn: () => fetchDaily(lat!, lon!, { days: 7, units }),
    enabled,
  })

  const insightsQuery = useQuery({
    queryKey: weatherQueryKeys.insights(lat ?? 0, lon ?? 0, lang, units),
    queryFn: () => fetchInsights(lat!, lon!, { days: 7, units, lang }),
    enabled: false, // AI quota disabled — re-enable when on Pro plan
  })

  const isLoading =
    weatherQuery.isLoading || hourlyQuery.isLoading || dailyQuery.isLoading
  const isError =
    weatherQuery.isError || hourlyQuery.isError || dailyQuery.isError

  const refetch = () => {
    void Promise.all([
      weatherQuery.refetch(),
      hourlyQuery.refetch(),
      dailyQuery.refetch(),
      insightsQuery.refetch(),
    ])
  }

  const current: CurrentWeather | undefined = weatherQuery.data?.current
  const daily: DailyForecast[] =
    dailyQuery.data?.daily ?? weatherQuery.data?.daily ?? []
  const hourly: HourlyForecast[] =
    hourlyQuery.data?.hourly ?? weatherQuery.data?.hourly ?? []
  const aiSummary = (weatherQuery.data?.ai_summary ?? '').trim()
  const aiUnavailableReason = aiSummary
    ? ''
    : (weatherQuery.data?.ai_unavailable_reason ??
        (lang === 'sw'
          ? 'Muhtasari wa AI haupatikani kwa mpango wa bure. Boresha hadi Pro kwa maarifa ya Gemini — utabiri bado unapakia bila AI.'
          : 'AI summaries are not available on the free plan. Upgrade to Pro for Gemini insights — weather data still loads normally.'))
  const aiSummaryLoading = weatherQuery.isLoading
  const location = weatherQuery.data?.location ?? {
    city: '',
    region: '',
    country: '',
    lat: lat ?? 0,
    lon: lon ?? 0,
  }

  return {
    current,
    daily,
    hourly,
    aiSummary,
    aiUnavailableReason,
    aiSummaryLoading,
    location,
    isLoading,
    isError,
    refetch,
  }
}
