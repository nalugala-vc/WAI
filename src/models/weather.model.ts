export interface CurrentWeather {
  temp: number
  feels_like: number
  humidity: number
  wind_kph: number
  wind_direction?: number
  uv_index: number
  precip_mm: number
  condition: string
  condition_icon: string
  is_day: boolean
}

export interface DailyForecast {
  date: string
  day_of_week: string
  max_temp: number
  min_temp: number
  rain_chance: number
  condition: string
  condition_icon: string
  sunrise?: string
  sunset?: string
}

export interface HourlyForecast {
  time: string
  temp: number
  rain_chance: number
  humidity: number
}

export interface WeatherLocation {
  city: string
  region: string
  country: string
  lat: number
  lon: number
  timezone?: string
}

export interface WeatherAiMeta {
  requested: boolean
  allowed: boolean
  applied: boolean
}

export interface WeatherResponse {
  location: WeatherLocation
  current: CurrentWeather
  daily: DailyForecast[]
  hourly: HourlyForecast[]
  ai_summary: string
  ai_unavailable_reason?: string
  ai_meta?: WeatherAiMeta
}
