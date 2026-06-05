import { useCallback, useState } from 'react'
import { geocodePlace } from '../services/geocoding.service'
import { parseCoordinates } from '../utils/coordinates'
import { useAppStore } from './useAppStore'

export function useLocationSearch() {
  const setLocation = useAppStore((state) => state.setLocation)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const search = useCallback(
    async (query: string): Promise<boolean> => {
      const trimmed = query.trim()
      if (!trimmed) return false

      setError(null)

      const coords = parseCoordinates(trimmed)
      if (coords) {
        setLocation(coords.lat, coords.lon, trimmed, '', '', '', 'manual')
        return true
      }

      setIsSearching(true)
      try {
        const result = await geocodePlace(trimmed)
        setLocation(
          result.lat,
          result.lon,
          result.city,
          result.region,
          result.country,
          result.countryCode,
          'manual',
        )
        return true
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Could not find that place. Try another name.'
        setError(message)
        return false
      } finally {
        setIsSearching(false)
      }
    },
    [setLocation],
  )

  return { search, isSearching, error, clearError }
}
