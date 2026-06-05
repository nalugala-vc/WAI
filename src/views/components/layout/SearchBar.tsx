import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocationSearch } from '../../../viewmodels/useLocationSearch'
import { useAppStore } from '../../../viewmodels/useAppStore'
import { formatSearchedPlaceLabel } from '../../../utils/placeLabel'
import { TablerIcon } from '../common/TablerIcon'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const locationSource = useAppStore((state) => state.locationSource)
  const city = useAppStore((state) => state.city)
  const region = useAppStore((state) => state.region)
  const country = useAppStore((state) => state.country)
  const countryCode = useAppStore((state) => state.countryCode)
  const { search, isSearching, error, clearError } = useLocationSearch()

  const locationLabel = [city, region, country].filter(Boolean).join(', ')
  const searchedPlace = formatSearchedPlaceLabel(city, countryCode, country)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!query.trim() || isSearching) return
    const ok = await search(query)
    if (ok) setQuery('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b border-gray-100 bg-white px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <TablerIcon
            name="ti-search"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              if (error) clearError()
            }}
            placeholder="Search city (e.g. Nakuru) or lat, lon"
            disabled={isSearching}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="shrink-0 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isSearching ? 'Searching…' : 'Go'}
        </button>

        {locationSource === 'geo' && locationLabel ? (
          <span className="inline-flex max-w-[12rem] shrink-0 text-xs text-gray-600">
            <span className="font-medium text-gray-500">Current location:</span>{' '}
            <span className="truncate font-medium text-gray-800">
              {locationLabel}
            </span>
          </span>
        ) : null}
        {locationSource === 'manual' && searchedPlace ? (
          <span className="inline-flex shrink-0 text-xs font-semibold text-gray-900">
            {searchedPlace}
          </span>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs text-amber-700" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  )
}
