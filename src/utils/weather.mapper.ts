import type {
  ApiWeatherPayload,
  ApiCurrent,
  ApiDaily,
  ApiHourly,
} from '../models/weather.api.model'
import type { GeoLocation, GeoWeatherResponse } from '../models/geo.model'
import type {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherLocation,
  WeatherResponse,
} from '../models/weather.model'

const CONDITION_LABELS: Record<string, string> = {
  '0': 'clear',
  '1': 'mainly clear',
  '2': 'partly cloudy',
  '3': 'overcast',
  '45': 'fog',
  '48': 'fog',
  '51': 'drizzle',
  '53': 'drizzle',
  '55': 'drizzle',
  '61': 'rain',
  '63': 'rain',
  '65': 'rain',
  '71': 'snow',
  '73': 'snow',
  '75': 'snow',
  '80': 'showers',
  '81': 'showers',
  '82': 'showers',
  '95': 'thunderstorm',
  '96': 'thunderstorm',
  '99': 'thunderstorm',
}

function parseConditionFromIcon(icon?: string): string | null {
  if (!icon) return null
  const match = icon.match(/\/(\d+)_([a-z0-9_]+)_(?:day|night)\./i)
  if (!match) return null
  return match[2].replace(/_/g, ' ')
}

export function parseConditionLabel(
  conditionCode: string,
  icon?: string,
): string {
  const fromIcon = parseConditionFromIcon(icon)
  if (fromIcon) return fromIcon
  return CONDITION_LABELS[conditionCode] ?? 'cloudy'
}

function isDayFromIcon(icon?: string): boolean {
  if (!icon) return true
  return icon.includes('_day.') || !icon.includes('_night.')
}

function findHourForCurrent(
  hourly: ApiHourly[] | undefined,
  currentTime: string,
): ApiHourly | undefined {
  if (!hourly?.length) return undefined
  const exact = hourly.find((h) => h.time === currentTime)
  if (exact) return exact
  return hourly[0]
}

function mapLocation(
  payload: ApiWeatherPayload,
): WeatherLocation {
  const { location, ip_geo: ipGeo } = payload
  return {
    city: ipGeo?.city ?? location.country ?? 'Unknown',
    region: ipGeo?.region ?? '',
    country: ipGeo?.country ?? location.country ?? '',
    lat: location.lat,
    lon: location.lon,
  }
}

function mapGeoLocation(
  payload: ApiWeatherPayload,
): GeoLocation {
  const location = mapLocation(payload)
  const ipGeo = payload.ip_geo
  return {
    city: ipGeo?.city ?? location.city,
    region: ipGeo?.region ?? location.region,
    country: ipGeo?.country ?? location.country,
    lat: ipGeo?.lat ?? location.lat,
    lon: ipGeo?.lon ?? location.lon,
  }
}

function mapCurrent(
  current: ApiCurrent,
  hourly?: ApiHourly[],
  dailyToday?: ApiDaily,
): CurrentWeather {
  const matchedHour = findHourForCurrent(hourly, current.time)

  return {
    temp: current.temperature,
    feels_like:
      current.feels_like ??
      matchedHour?.feels_like ??
      current.temperature,
    humidity: current.humidity ?? matchedHour?.humidity ?? 0,
    wind_kph: current.wind_speed,
    wind_direction: current.wind_direction,
    uv_index: current.uv_index ?? matchedHour?.uv_index ?? 0,
    precip_mm:
      current.precipitation ?? dailyToday?.precipitation_sum ?? 0,
    condition: parseConditionLabel(current.condition_code, current.icon),
    condition_icon: current.icon ?? '',
    is_day: isDayFromIcon(current.icon),
  }
}

function mapDailyEntry(entry: ApiDaily): DailyForecast {
  const date = new Date(entry.date)
  const dayOfWeek = Number.isNaN(date.getTime())
    ? entry.date
    : date.toLocaleDateString('en-US', { weekday: 'long' })

  return {
    date: entry.date,
    day_of_week: dayOfWeek,
    max_temp: entry.temp_max,
    min_temp: entry.temp_min,
    rain_chance: entry.precipitation_probability ?? 0,
    condition: parseConditionLabel(entry.condition_code, entry.icon),
    condition_icon: entry.icon ?? '',
    sunrise: entry.sunrise,
    sunset: entry.sunset,
  }
}

function mapHourlyEntry(entry: ApiHourly): HourlyForecast {
  return {
    time: entry.time,
    temp: entry.temperature,
    rain_chance: entry.precipitation_probability ?? 0,
    humidity: entry.humidity ?? 0,
  }
}

export function mapWeatherResponse(payload: ApiWeatherPayload): WeatherResponse {
  const daily = payload.daily ?? []
  const hourly = payload.hourly ?? []
  const today = daily[0]

  return {
    location: mapLocation(payload),
    current: mapCurrent(payload.current, hourly, today),
    daily: daily.map(mapDailyEntry),
    hourly: hourly.map(mapHourlyEntry),
    ai_summary: payload.ai_summary ?? payload.summary ?? '',
  }
}

export function mapGeoWeatherResponse(
  payload: ApiWeatherPayload,
): GeoWeatherResponse {
  const mapped = mapWeatherResponse(payload)
  return {
    ...mapped,
    geo: mapGeoLocation(payload),
  }
}
