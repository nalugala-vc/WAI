export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

export function formatDate(date: Date | string, locale = 'en-US'): string {
  const value = typeof date === 'string' ? new Date(date) : date
  return value.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}
