export interface ApiLocation {
  lat: number
  lon: number
  timezone?: string
  country?: string
  requested_lat?: number
  requested_lon?: number
}

export interface ApiCurrent {
  time: string
  temperature: number
  wind_speed: number
  wind_direction?: number
  condition_code: string
  icon?: string
  icon_path?: string
  humidity?: number
  feels_like?: number
  uv_index?: number
  precipitation?: number
}

export interface ApiDaily {
  date: string
  temp_min: number
  temp_max: number
  precipitation_sum?: number
  precipitation_probability?: number
  condition_code: string
  icon?: string
  icon_path?: string
  wind_max?: number
  sunrise?: string
  sunset?: string
}

export interface ApiHourly {
  time: string
  temperature: number
  precipitation_probability?: number
  humidity?: number
  feels_like?: number
  wind_speed?: number
  condition_code?: string
  icon?: string
  uv_index?: number
}

export interface ApiIpGeo {
  country?: string
  region?: string
  city?: string
  lat?: number
  lon?: number
}

export interface ApiWeatherPayload {
  location: ApiLocation
  current: ApiCurrent
  hourly?: ApiHourly[]
  daily?: ApiDaily[]
  ip_geo?: ApiIpGeo
  client_geo?: Record<string, unknown>
  ai_summary?: string
  summary?: string
  ai_insights?: string
  insights?: string | Record<string, unknown>
  ai?: string | Record<string, unknown>
}
