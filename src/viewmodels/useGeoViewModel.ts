import { useQuery } from '@tanstack/react-query'
import { fetchWeatherGeo } from '../services/geo.service'

export const geoQueryKeys = {
  all: ['geo'] as const,
  detect: () => [...geoQueryKeys.all, 'detect'] as const,
}

export function useGeoDetectionQuery(enabled = true) {
  return useQuery({
    queryKey: geoQueryKeys.detect(),
    queryFn: fetchWeatherGeo,
    enabled,
    staleTime: Infinity,
  })
}
