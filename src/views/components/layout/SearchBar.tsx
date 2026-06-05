import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppStore } from '../../../viewmodels/useAppStore'
import { TablerIcon } from '../common/TablerIcon'

function parseCoordinates(
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

export function SearchBar() {
  const [query, setQuery] = useState('')
  const locationSource = useAppStore((state) => state.locationSource)
  const setLocation = useAppStore((state) => state.setLocation)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!query.trim()) return

    // TODO: integrate geocoding API to resolve location names to lat/lon
    const coords = parseCoordinates(query)
    if (coords) {
      setLocation(coords.lat, coords.lon, query.trim(), '', 'manual')
      return
    }

    // Placeholder until geocoding is wired — accept "lat, lon" format only
    console.warn(
      'Geocoding not yet integrated. Use "latitude, longitude" format (e.g. -1.29, 36.82).',
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3"
    >
      <div className="relative flex-1">
        <TablerIcon
          name="ti-search"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search city or enter lat, lon"
          className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
        />
      </div>

      {locationSource === 'geo' ? (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          <TablerIcon name="ti-map-pin" className="text-sm" />
          Auto-detected
        </span>
      ) : null}
    </form>
  )
}
