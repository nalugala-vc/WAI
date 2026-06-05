import bgClearNight from '../assets/backgrounds/Clear (night).png'
import bgFogMist from '../assets/backgrounds/Fog Mist.png'
import bgHeavyRain from '../assets/backgrounds/Heavy rain.png'
import bgLightRain from '../assets/backgrounds/Light rain.png'
import bgOvercastDay from '../assets/backgrounds/Overcast Cloudy Day.png'
import bgOvercastNight from '../assets/backgrounds/Overcast Cloudy Night.png'
import bgPartlyCloudyDay from '../assets/backgrounds/Partly cloudy (day).png'
import bgPartlyCloudyNight from '../assets/backgrounds/Partly cloudy NIGHT.png'
import bgSunny from '../assets/backgrounds/Sunny Clear (day).png'
import bgSunrise from '../assets/backgrounds/Sunrise.png'
import bgSunset from '../assets/backgrounds/Sunset.png'
import bgThunderstorm from '../assets/backgrounds/Thunderstorm.png'
import bgWindy from '../assets/backgrounds/Windy.png'
import bgFallback from '../assets/backgrounds/fallback.png'
import { preloadImages } from './preloadImage'

import lottieClearNight from '../assets/lotties/Clear (night).json'
import lottieFogMist from '../assets/lotties/Fog Mist.json'
import lottieHeavyRain from '../assets/lotties/Heavy rain.json'
import lottieLightRain from '../assets/lotties/Light rain.json'
import lottieOvercast from '../assets/lotties/Overcast Cloudy.json'
import lottiePartlyCloudyDay from '../assets/lotties/Partly cloudy day.json'
import lottiePartlyCloudyNight from '../assets/lotties/Partly cloudy NIGHT.json'
import lottieSunny from '../assets/lotties/Sunny Clear (day).json'
import lottieThunderstorm from '../assets/lotties/Thunderstorm.json'
import lottieWindy from '../assets/lotties/windy.json'
import lottieFallback from '../assets/lotties/fall back.json'

/** Every dashboard background URL — warmed on first visit so swaps are instant. */
export const ALL_CONDITION_BACKGROUNDS = [
  bgClearNight,
  bgFogMist,
  bgHeavyRain,
  bgLightRain,
  bgOvercastDay,
  bgOvercastNight,
  bgPartlyCloudyDay,
  bgPartlyCloudyNight,
  bgSunny,
  bgSunrise,
  bgSunset,
  bgThunderstorm,
  bgWindy,
  bgFallback,
] as const

export function preloadAllConditionBackgrounds(): void {
  preloadImages([...ALL_CONDITION_BACKGROUNDS])
}

export type ConditionCategory =
  | 'thunder'
  | 'heavyRain'
  | 'rain'
  | 'fog'
  | 'wind'
  | 'partly'
  | 'overcast'
  | 'clear'
  | 'fallback'

/** Shared matcher so Lottie and background always agree. */
export function resolveConditionCategory(condition: string): ConditionCategory {
  const c = condition.toLowerCase().trim()
  if (!c) return 'fallback'

  if (c.includes('thunder') || c.includes('storm')) return 'thunder'
  if (c.includes('heavy rain') || c.includes('torrential')) return 'heavyRain'
  if (
    c.includes('drizzle') ||
    c.includes('light rain') ||
    c.includes('shower') ||
    c.includes('rain')
  ) {
    return 'rain'
  }
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return 'fog'
  if (c.includes('wind') || c.includes('breezy') || c.includes('gust')) {
    return 'wind'
  }
  if (/\bmainly\s*clear\b/.test(c) || c.includes('mainly_clear')) return 'clear'
  // Partly before generic "cloudy" — "partly cloudy" must not map to overcast.
  if (c.includes('partly') || c.includes('partial')) return 'partly'
  if (c.includes('overcast')) return 'overcast'
  if (c.includes('cloudy')) return 'overcast'
  if (c.includes('sunny') || /\bclear\b/.test(c)) {
    return 'clear'
  }

  return 'fallback'
}

function getHourInTimezone(timezone?: string): number {
  const tz =
    timezone?.trim() ||
    Intl.DateTimeFormat().resolvedOptions().timeZone
  try {
    const hour = Number(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        hour: 'numeric',
        hour12: false,
      }).format(new Date()),
    )
    return Number.isFinite(hour) ? hour : new Date().getHours()
  } catch {
    return new Date().getHours()
  }
}

function getTimeOfDay(timezone?: string): 'sunrise' | 'sunset' | 'day' | 'night' {
  const hour = getHourInTimezone(timezone)
  if (hour >= 5 && hour < 8) return 'sunrise'
  if (hour >= 17 && hour < 20) return 'sunset'
  if (hour >= 8 && hour < 17) return 'day'
  return 'night'
}

export function getConditionBackground(
  condition: string,
  isDay: boolean,
  timezone?: string,
): string {
  const category = resolveConditionCategory(condition)

  // Night: always follow API day/night — mainly clear → clear night, etc.
  if (!isDay) {
    switch (category) {
      case 'thunder':
        return bgThunderstorm
      case 'heavyRain':
        return bgHeavyRain
      case 'rain':
        return bgHeavyRain
      case 'fog':
        return bgFogMist
      case 'wind':
        return bgWindy
      case 'overcast':
        return bgOvercastNight
      case 'partly':
        return bgPartlyCloudyNight
      case 'clear':
        return bgClearNight
      default:
        return bgClearNight
    }
  }

  const timeOfDay = getTimeOfDay(timezone)

  if (
    timeOfDay === 'sunrise' &&
    (category === 'clear' || category === 'partly')
  ) {
    return bgSunrise
  }

  if (
    timeOfDay === 'sunset' &&
    (category === 'clear' || category === 'partly')
  ) {
    return bgSunset
  }

  switch (category) {
    case 'thunder':
      return bgThunderstorm
    case 'heavyRain':
      return bgHeavyRain
    case 'rain':
      return bgLightRain
    case 'fog':
      return bgFogMist
    case 'wind':
      return bgWindy
    case 'overcast':
      return bgOvercastDay
    case 'partly':
      return bgPartlyCloudyDay
    case 'clear':
      return bgSunny
    default:
      return bgFallback
  }
}

function cloneLottieAsset(asset: object): object {
  return structuredClone(asset)
}

export function getConditionLottie(condition: string, isDay: boolean): object {
  const category = resolveConditionCategory(condition)
  let asset: object = lottieFallback

  switch (category) {
    case 'thunder':
      asset = lottieThunderstorm
      break
    case 'heavyRain':
      asset = lottieHeavyRain
      break
    case 'rain':
      asset = lottieLightRain
      break
    case 'fog':
      asset = lottieFogMist
      break
    case 'wind':
      asset = lottieWindy
      break
    case 'overcast':
      asset = lottieOvercast
      break
    case 'partly':
      asset = isDay ? lottiePartlyCloudyDay : lottiePartlyCloudyNight
      break
    case 'clear':
      asset = isDay ? lottieSunny : lottieClearNight
      break
    default:
      asset = lottieFallback
  }

  return cloneLottieAsset(asset)
}

export function getOverlayOpacity(condition: string, isDay: boolean): number {
  const category = resolveConditionCategory(condition)
  if (category === 'thunder') return 0.55
  if (!isDay) return 0.5
  if (category === 'rain' || category === 'heavyRain') return 0.45
  if (category === 'overcast' || category === 'fog') return 0.4
  return 0.3
}
