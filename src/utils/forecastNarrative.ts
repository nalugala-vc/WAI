import type { DailyForecast } from '../models/weather.model'
import { formatDayName, formatTemp, isToday } from './formatters'

export function isDayFromForecastIcon(icon?: string): boolean {
  if (!icon) return true
  const lower = icon.toLowerCase()
  if (/-night|_night/i.test(lower)) return false
  if (/-day|_day/i.test(lower)) return true
  return true
}

export function getForecastDayLabel(day: DailyForecast, short = false): string {
  if (isToday(day.date)) return 'Today'
  const name = day.day_of_week || formatDayName(day.date)
  return short ? name.slice(0, 3) : name
}

function capitalizeCondition(condition: string): string {
  if (!condition.trim()) return 'variable conditions'
  return condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase()
}

export function buildDayForecastNarrative(
  day: DailyForecast,
  units: 'metric' | 'imperial',
  lang: 'en' | 'sw' = 'en',
): string {
  const dayName = getForecastDayLabel(day)
  const condition = capitalizeCondition(day.condition)
  const high = formatTemp(day.max_temp, units)
  const low = formatTemp(day.min_temp, units)
  const rain = day.rain_chance

  if (lang === 'sw') {
    const intro = isToday(day.date)
      ? `Leo tunatarajia hali ya ${condition}.`
      : `Siku ya ${dayName} tunatarajia hali ya ${condition}.`
    let msg = `${intro} Joto la juu karibu ${high} na la chini ${low}.`
    if (rain >= 20) msg += ` Nafasi ya mvua ni ${rain}%.`
    else if (rain > 0) msg += ` Nafasi ndogo ya mvua (${rain}%).`
    return msg
  }

  const intro = isToday(day.date)
    ? `Today we expect ${condition} weather.`
    : `On ${dayName}, we expect ${condition} weather.`
  let msg = `${intro} Highs around ${high} and lows around ${low}.`
  if (rain >= 20) {
    msg += ` There's a ${rain}% chance of rain.`
  } else if (rain > 0) {
    msg += ` A slight chance of rain (${rain}%).`
  }
  return msg
}
