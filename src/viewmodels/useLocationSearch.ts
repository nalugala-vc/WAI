import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { geocodePlace } from '../services/geocoding.service'
import { parseCoordinates } from '../utils/coordinates'
import { prefetchWeatherForLocation } from '../utils/prefetchWeather'
import { useAppStore } from './useAppStore'

export function useLocationSearch() {
  const queryClient = useQueryClient()
  const setLocation = useAppStore((state) => state.setLocation)
  const lang = useAppStore((state) => state.lang)
  const units = useAppStore((state) => state.units)
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
        prefetchWeatherForLocation(
          queryClient,
          coords.lat,
          coords.lon,
          lang,
          units,
        )
        setLocation(coords.lat, coords.lon, trimmed, '', '', '', 'manual')
        return true
      }

      setIsSearching(true)
      try {
        const result = await geocodePlace(trimmed)
        prefetchWeatherForLocation(
          queryClient,
          result.lat,
          result.lon,
          lang,
          units,
        )
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
    [queryClient, lang, setLocation, units],
  )

  return { search, isSearching, error, clearError }
}
