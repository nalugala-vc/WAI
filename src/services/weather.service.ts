import { WEATHER_ENDPOINTS } from '../constants/api.constants'
import type {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherLocation,
} from '../models/weather.model'
import { apiClient } from './api.client'

export async function fetchWeather(
  location: string,
): Promise<WeatherLocation> {
  const { data } = await apiClient.get<WeatherLocation>(
    WEATHER_ENDPOINTS.WEATHER,
    { params: { location } },
  )
  return data
}

export async function fetchCurrentWeather(
  location: string,
): Promise<CurrentWeather> {
  const { data } = await apiClient.get<CurrentWeather>(
    WEATHER_ENDPOINTS.CURRENT,
    { params: { location } },
  )
  return data
}

export async function fetchHourlyForecast(
  location: string,
): Promise<HourlyForecast> {
  const { data } = await apiClient.get<HourlyForecast>(
    WEATHER_ENDPOINTS.HOURLY,
    { params: { location } },
  )
  return data
}

export async function fetchDailyForecast(
  location: string,
): Promise<DailyForecast> {
  const { data } = await apiClient.get<DailyForecast>(
    WEATHER_ENDPOINTS.DAILY,
    { params: { location } },
  )
  return data
}
