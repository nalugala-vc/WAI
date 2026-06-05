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

function getTimeOfDay(): 'sunrise' | 'sunset' | 'day' | 'night' {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 8) return 'sunrise'
  if (hour >= 17 && hour < 20) return 'sunset'
  if (hour >= 8 && hour < 17) return 'day'
  return 'night'
}

export function getConditionBackground(
  condition: string,
  isDay: boolean,
): string {
  const c = condition.toLowerCase()
  const timeOfDay = getTimeOfDay()

  if (
    timeOfDay === 'sunrise' &&
    isDay &&
    (c.includes('clear') || c.includes('sunny') || c.includes('partly'))
  ) {
    return bgSunrise
  }

  if (
    timeOfDay === 'sunset' &&
    isDay &&
    (c.includes('clear') || c.includes('sunny') || c.includes('partly'))
  ) {
    return bgSunset
  }

  if (c.includes('thunder') || c.includes('storm')) return bgThunderstorm
  if (c.includes('heavy rain') || c.includes('torrential')) return bgHeavyRain
  if (
    c.includes('drizzle') ||
    c.includes('light rain') ||
    c.includes('shower') ||
    c.includes('rain')
  ) {
    return isDay ? bgLightRain : bgHeavyRain
  }
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) {
    return bgFogMist
  }
  if (c.includes('wind') || c.includes('breezy') || c.includes('gust')) {
    return bgWindy
  }
  if (c.includes('overcast') || c.includes('cloudy')) {
    return isDay ? bgOvercastDay : bgOvercastNight
  }
  if (c.includes('partly') || c.includes('partial')) {
    return isDay ? bgPartlyCloudyDay : bgPartlyCloudyNight
  }
  if (c.includes('sunny') || c.includes('clear')) {
    return isDay ? bgSunny : bgClearNight
  }

  return bgFallback
}

function cloneLottieAsset(asset: object): object {
  // Lottie mutates animationData in place; clone so Strict Mode re-renders stay safe.
  return structuredClone(asset)
}

export function getConditionLottie(condition: string, isDay: boolean): object {
  const c = condition.toLowerCase()
  let asset: object = lottieFallback

  if (c.includes('thunder') || c.includes('storm')) {
    asset = lottieThunderstorm
  } else if (c.includes('heavy rain') || c.includes('torrential')) {
    asset = lottieHeavyRain
  } else if (
    c.includes('drizzle') ||
    c.includes('light rain') ||
    c.includes('shower') ||
    c.includes('rain')
  ) {
    asset = lottieLightRain
  } else if (c.includes('fog') || c.includes('mist') || c.includes('haze')) {
    asset = lottieFogMist
  } else if (c.includes('wind') || c.includes('breezy') || c.includes('gust')) {
    asset = lottieWindy
  } else if (c.includes('overcast') || c.includes('cloudy')) {
    asset = lottieOvercast
  } else if (c.includes('partly') || c.includes('partial')) {
    asset = isDay ? lottiePartlyCloudyDay : lottiePartlyCloudyNight
  } else if (c.includes('sunny') || c.includes('clear')) {
    asset = isDay ? lottieSunny : lottieClearNight
  }

  return cloneLottieAsset(asset)
}

export function getOverlayOpacity(condition: string, isDay: boolean): number {
  const c = condition.toLowerCase()
  if (c.includes('thunder') || c.includes('storm')) return 0.55
  if (!isDay) return 0.5
  if (c.includes('rain')) return 0.45
  if (c.includes('overcast') || c.includes('fog')) return 0.4
  return 0.3
}
