/** Label under search after a manual place lookup, e.g. "Nakuru, KE". */
export function formatSearchedPlaceLabel(
  city: string,
  countryCode: string,
  country?: string,
): string {
  const place = city.trim()
  const code = countryCode.trim().toUpperCase()
  if (place && code) return `${place}, ${code}`
  if (place) return place
  if (code) return code
  return country?.trim() ?? ''
}
