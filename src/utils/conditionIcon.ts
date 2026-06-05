export function getConditionIcon(condition: string | undefined): string {
  if (!condition) return 'ti-cloud'
  const normalized = condition.toLowerCase().trim()

  if (normalized.includes('thunder')) return 'ti-cloud-storm'
  if (
    normalized.includes('snow') ||
    normalized.includes('sleet') ||
    normalized.includes('blizzard')
  ) {
    return 'ti-snowflake'
  }
  if (
    normalized.includes('rain') ||
    normalized.includes('drizzle') ||
    normalized.includes('shower')
  ) {
    return 'ti-cloud-rain'
  }
  if (normalized.includes('fog') || normalized.includes('mist')) {
    return 'ti-mist'
  }
  if (normalized.includes('partly')) return 'ti-cloud-sun'
  if (normalized.includes('cloud') || normalized.includes('overcast')) {
    return 'ti-cloud'
  }
  if (
    normalized.includes('sunny') ||
    normalized.includes('clear') ||
    normalized.includes('fair')
  ) {
    return 'ti-sun'
  }

  return 'ti-cloud'
}
