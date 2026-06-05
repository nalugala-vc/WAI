import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { fetchGeoWeather } from '../services/geo.service'
import { useAppStore } from './useAppStore'

export const geoQueryKeys = {
  all: ['geo'] as const,
  detect: (lang: 'en' | 'sw') => [...geoQueryKeys.all, 'detect', lang] as const,
}

export function useGeoViewModel() {
  const lang = useAppStore((state) => state.lang)
  const setLocation = useAppStore((state) => state.setLocation)
  const locationSource = useAppStore((state) => state.locationSource)

  const query = useQuery({
    queryKey: geoQueryKeys.detect(lang),
    queryFn: () => fetchGeoWeather({ days: 7, lang, ai: false }),
    staleTime: Infinity,
    retry: 2,
  })

  useEffect(() => {
    if (!query.data || locationSource === 'manual') return

    const { geo } = query.data
    setLocation(
      geo.lat,
      geo.lon,
      geo.city,
      geo.region,
      geo.country,
      geo.country.length === 2 ? geo.country.toUpperCase() : '',
      'geo',
    )
  }, [query.data, locationSource, setLocation])

  const city = query.data?.geo?.city ?? query.data?.location?.city ?? ''
  const region = query.data?.geo?.region ?? query.data?.location?.region ?? ''

  return {
    geoWeather: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    city,
    region,
    refetch: query.refetch,
  }
}
