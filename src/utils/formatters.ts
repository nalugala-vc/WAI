export function convertToImperial(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

export function formatTemp(
  value: number,
  units: 'metric' | 'imperial',
): string {
  if (units === 'imperial') {
    return `${Math.round(convertToImperial(value))}°F`
  }
  return `${Math.round(value)}°C`
}

export function formatTempValue(
  value: number,
  units: 'metric' | 'imperial',
): string {
  if (units === 'imperial') {
    return `${Math.round(convertToImperial(value))}°`
  }
  return `${Math.round(value)}°`
}

export function formatHour(timeString: string): string {
  const date = new Date(timeString)
  if (Number.isNaN(date.getTime())) {
    const match = timeString.match(/(\d{1,2}):(\d{2})/)
    if (match) {
      const hour = Number.parseInt(match[1], 10)
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 === 0 ? 12 : hour % 12
      return `${displayHour} ${period}`
    }
    return timeString
  }
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  })
}

export function formatTimeShort(timeString: string | undefined): string {
  if (!timeString) return '—'
  const date = new Date(timeString)
  if (Number.isNaN(date.getTime())) {
    const match = timeString.match(/T(\d{2}):(\d{2})/)
    if (match) {
      const hour = Number.parseInt(match[1], 10)
      const min = match[2]
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 === 0 ? 12 : hour % 12
      return `${displayHour}:${min} ${period}`
    }
    return timeString
  }
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatDayName(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return dateString.slice(0, 3)
  }
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

export function formatNowDateTime(): string {
  return new Date().toLocaleString('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  })
}

export function getUVLabel(index: number): string {
  if (index <= 2) return 'Low'
  if (index <= 5) return 'Moderate'
  if (index <= 7) return 'High'
  if (index <= 10) return 'Very High'
  return 'Extreme'
}

export function convertWindToImperial(kph: number): number {
  return kph * 0.621371
}

export function formatWind(kph: number, units: 'metric' | 'imperial'): string {
  if (units === 'imperial') {
    return `${convertWindToImperial(kph).toFixed(1)} mph`
  }
  return `${kph.toFixed(1)} km/h`
}

export function windDirectionLabel(degrees: number | undefined): string {
  if (degrees === undefined) return '—'
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

export function isToday(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

export function humidityStatus(humidity: number): {
  label: string
  tone: 'good' | 'warn' | 'neutral'
} {
  if (humidity < 30) return { label: 'Dry', tone: 'warn' }
  if (humidity > 70) return { label: 'Humid', tone: 'warn' }
  return { label: 'Normal', tone: 'good' }
}
