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
  WeatherAiMeta,
  WeatherLocation,
  WeatherResponse,
} from '../models/weather.model'

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim()
  return undefined
}

export function extractAiSummary(payload: ApiWeatherPayload): string {
  const direct =
    asNonEmptyString(payload.ai_summary) ??
    asNonEmptyString(payload.summary) ??
    asNonEmptyString(payload.ai_insights) ??
    asNonEmptyString(
      typeof payload.insights === 'string' ? payload.insights : undefined,
    )
  if (direct) return direct

  const insightsObj = payload.insights
  if (insightsObj && typeof insightsObj === 'object') {
    const record = insightsObj as Record<string, unknown>
    const nested =
      asNonEmptyString(record.summary) ??
      asNonEmptyString(record.text) ??
      asNonEmptyString(record.message)
    if (nested) return nested
  }

  const ai = payload.ai
  if (typeof ai === 'string') return asNonEmptyString(ai) ?? ''
  if (ai && typeof ai === 'object') {
    const record = ai as Record<string, unknown>
    return (
      asNonEmptyString(record.summary) ??
      asNonEmptyString(record.text) ??
      asNonEmptyString(record.insights) ??
      asNonEmptyString(record.message) ??
      ''
    )
  }

  return ''
}

export function parseAiResponseHeaders(
  headers: Record<string, unknown>,
): WeatherAiMeta {
  const pick = (key: string) => {
    const value = headers[key]
    if (value == null) return undefined
    if (Array.isArray(value)) return String(value[0])
    return String(value)
  }

  return {
    requested: pick('x-ai-requested') === 'true',
    allowed: pick('x-ai-allow') === 'true',
    applied: pick('x-ai-applied') === 'true',
  }
}

export function defaultAiUnavailableReason(
  meta: WeatherAiMeta | undefined,
  lang: 'en' | 'sw',
): string {
  if (lang === 'sw') {
    if (meta && !meta.allowed) {
      return 'Muhtasari wa AI haupatikani kwa mpango wako wa sasa. Boresha hadi Pro ili kupata maarifa ya Gemini.'
    }
    return 'Hakuna muhtasari wa AI kwa eneo hili kwa sasa. Jaribu tena baadaye.'
  }

  if (meta && !meta.allowed) {
    return 'AI summaries are not enabled for your API key. Upgrade to a Pro or Scale plan for Gemini insights.'
  }
  return 'No AI summary is available for this location yet. Try again later or upgrade your plan.'
}

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

function parseConditionFromIconPath(iconPath?: string): string | null {
  if (!iconPath) return null
  const wmo = iconPath.match(/wmo-(\d+)-(day|night)/i)
  if (!wmo) return null
  return CONDITION_LABELS[wmo[1]] ?? null
}

export function parseConditionLabel(
  conditionCode: string,
  icon?: string,
  iconPath?: string,
): string {
  const fromIcon = parseConditionFromIcon(icon)
  if (fromIcon) return fromIcon
  const fromPath = parseConditionFromIconPath(iconPath)
  if (fromPath) return fromPath
  return CONDITION_LABELS[conditionCode] ?? 'cloudy'
}

function isDayFromIconString(s: string): boolean | null {
  const lower = s.toLowerCase()
  if (/-night|_night/i.test(lower)) return false
  if (/-day|_day/i.test(lower)) return true
  return null
}

/**
 * Determines is_day with a reliable priority chain:
 * 1. API explicit is_day field
 * 2. Sunrise/sunset string comparison (both in location local time — most reliable)
 * 3. Icon filename encoding
 * 4. Local machine hour fallback
 */
function resolveIsDay(
  apiIsDay: boolean | number | undefined,
  icon: string | undefined,
  iconPath: string | undefined,
  currentTime?: string,
  sunrise?: string,
  sunset?: string,
): boolean {
  if (apiIsDay !== undefined && apiIsDay !== null) {
    return Boolean(apiIsDay)
  }
  // The API returns current.time, sunrise, and sunset all in the location's
  // local time (same timezone), so lexicographic comparison is exact.
  if (currentTime && sunrise && sunset) {
    return currentTime >= sunrise && currentTime < sunset
  }
  for (const s of [icon, iconPath]) {
    if (!s) continue
    const result = isDayFromIconString(s)
    if (result !== null) return result
  }
  const hour = new Date().getHours()
  return hour >= 6 && hour < 20
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
    city: ipGeo?.city ?? '',
    region: ipGeo?.region ?? '',
    country: ipGeo?.country ?? location.country ?? '',
    lat: location.lat,
    lon: location.lon,
    timezone: location.timezone,
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
    condition: parseConditionLabel(
      current.condition_code,
      current.icon,
      current.icon_path,
    ),
    condition_icon: current.icon ?? current.icon_path ?? '',
    is_day: resolveIsDay(
      current.is_day,
      current.icon,
      current.icon_path,
      current.time,
      dailyToday?.sunrise,
      dailyToday?.sunset,
    ),
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
    ai_summary: extractAiSummary(payload),
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
