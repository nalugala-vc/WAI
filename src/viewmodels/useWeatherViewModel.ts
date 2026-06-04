import { useQuery } from '@tanstack/react-query'
import {
  fetchCurrentWeather,
  fetchDailyForecast,
  fetchHourlyForecast,
  fetchWeather,
} from '../services/weather.service'

export const weatherQueryKeys = {
  all: ['weather'] as const,
  weather: (location: string) =>
    [...weatherQueryKeys.all, 'summary', location] as const,
  current: (location: string) =>
    [...weatherQueryKeys.all, 'current', location] as const,
  hourly: (location: string) =>
    [...weatherQueryKeys.all, 'hourly', location] as const,
  daily: (location: string) =>
    [...weatherQueryKeys.all, 'daily', location] as const,
}

export function useWeatherQuery(location: string | null) {
  return useQuery({
    queryKey: weatherQueryKeys.weather(location ?? ''),
    queryFn: () => fetchWeather(location!),
    enabled: Boolean(location),
  })
}

export function useCurrentWeatherQuery(location: string | null) {
  return useQuery({
    queryKey: weatherQueryKeys.current(location ?? ''),
    queryFn: () => fetchCurrentWeather(location!),
    enabled: Boolean(location),
  })
}

export function useHourlyForecastQuery(location: string | null) {
  return useQuery({
    queryKey: weatherQueryKeys.hourly(location ?? ''),
    queryFn: () => fetchHourlyForecast(location!),
    enabled: Boolean(location),
  })
}

export function useDailyForecastQuery(location: string | null) {
  return useQuery({
    queryKey: weatherQueryKeys.daily(location ?? ''),
    queryFn: () => fetchDailyForecast(location!),
    enabled: Boolean(location),
  })
}
