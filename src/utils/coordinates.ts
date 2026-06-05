/** True when store coordinates match API location (~1° tolerance). */
export function coordsRoughlyMatch(
  storeLat: number | null,
  storeLon: number | null,
  apiLat: number,
  apiLon: number,
): boolean {
  if (storeLat == null || storeLon == null) return false
  return Math.abs(storeLat - apiLat) < 1 && Math.abs(storeLon - apiLon) < 1
}

export function parseCoordinates(
  input: string,
): { lat: number; lon: number } | null {
  const trimmed = input.trim()
  const match = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/)
  if (!match) return null
  const lat = Number.parseFloat(match[1])
  const lon = Number.parseFloat(match[2])
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null
  return { lat, lon }
}
