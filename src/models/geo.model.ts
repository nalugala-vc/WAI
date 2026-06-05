import type { WeatherResponse } from './weather.model'

export interface GeoLocation {
  city: string
  region: string
  country: string
  lat: number
  lon: number
}

export interface GeoWeatherResponse extends WeatherResponse {
  geo: GeoLocation
}
