import type { QueryClient } from '@tanstack/react-query'
import {
  fetchDaily,
  fetchHourly,
  fetchWeather,
} from '../services/weather.service'
import { weatherQueryKeys } from '../viewmodels/useWeatherViewModel'

export function prefetchWeatherForLocation(
  queryClient: QueryClient,
  lat: number,
  lon: number,
  lang: 'en' | 'sw',
  units: 'metric' | 'imperial',
): void {
  void queryClient.prefetchQuery({
    queryKey: weatherQueryKeys.summary(lat, lon, lang, units),
    queryFn: () => fetchWeather(lat, lon, { days: 7, lang, units, ai: false }),
  })
  void queryClient.prefetchQuery({
    queryKey: weatherQueryKeys.hourly(lat, lon, units),
    queryFn: () => fetchHourly(lat, lon, { days: 1, units }),
  })
  void queryClient.prefetchQuery({
    queryKey: weatherQueryKeys.daily(lat, lon, units),
    queryFn: () => fetchDaily(lat, lon, { days: 7, units }),
  })
}
