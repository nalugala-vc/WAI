import { useMemo, useState } from 'react'
import { ConditionLottie } from './ConditionLottie'
import type { FormEvent } from 'react'
import type { CurrentWeather } from '../../../models/weather.model'
import { useLocationSearch } from '../../../viewmodels/useLocationSearch'
import { useAppStore } from '../../../viewmodels/useAppStore'
import { formatSearchedPlaceLabel } from '../../../utils/placeLabel'
import { getConditionLottie } from '../../../utils/conditionAssets'
import { getConditionIcon } from '../../../utils/conditionIcon'
import { formatNowDateTime, formatTemp } from '../../../utils/formatters'
import { TablerIcon } from '../common/TablerIcon'
import { AISummaryBanner } from './AISummaryBanner'

export interface DashboardSidebarProps {
  current: CurrentWeather
  units: 'metric' | 'imperial'
  lang: 'en' | 'sw'
  aiSummary: string
  aiUnavailableReason?: string
  aiSummaryLoading: boolean
  /** Fallback place names from weather / geo when the store is empty */
  city?: string
  region?: string
}

export function DashboardSidebar({
  current,
  units,
  lang,
  aiSummary,
  aiUnavailableReason,
  aiSummaryLoading,
  city: fallbackCity = '',
  region: fallbackRegion = '',
}: DashboardSidebarProps) {
  const [query, setQuery] = useState('')
  const { search, isSearching, error, clearError } = useLocationSearch()
  const locationSource = useAppStore((state) => state.locationSource)
  const storeCity = useAppStore((state) => state.city)
  const storeRegion = useAppStore((state) => state.region)
  const storeCountry = useAppStore((state) => state.country)
  const storeCountryCode = useAppStore((state) => state.countryCode)

  const geoLocationLabel = [storeCity || fallbackCity, storeRegion || fallbackRegion]
    .filter(Boolean)
    .join(', ')
  const searchedPlace = formatSearchedPlaceLabel(
    storeCity,
    storeCountryCode,
    storeCountry,
  )

  const icon = getConditionIcon(current.condition)
  const lottieData = useMemo(
    () => getConditionLottie(current.condition, current.is_day),
    [current.condition, current.is_day],
  )
  const rainLine = current.precip_mm > 0
    ? `Rain · ${current.precip_mm.toFixed(1)} mm`
    : `Rain chance from forecast`

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!query.trim() || isSearching) return
    const ok = await search(query)
    if (ok) setQuery('')
  }

  return (
    <aside className="flex h-full min-h-0 flex-col rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-md lg:p-5">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <form onSubmit={handleSubmit} className="relative shrink-0">
          <TablerIcon
            name="ti-search"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              if (error) clearError()
            }}
            placeholder="Search city…"
            disabled={isSearching}
            className="w-full rounded-2xl border border-white/25 bg-white/10 py-3 pl-10 pr-11 text-sm text-white placeholder:text-white/45 backdrop-blur-sm focus:border-white/40 focus:bg-white/15 focus:outline-none focus:ring-1 focus:ring-white/30 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/70 hover:bg-white/10 disabled:opacity-40"
            aria-label={isSearching ? 'Searching…' : 'Search location'}
          >
            {isSearching ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <TablerIcon name="ti-map-pin" />
            )}
          </button>
        </form>

        {error ? (
          <p className="-mt-2 shrink-0 text-xs text-amber-200" role="alert">
            {error}
          </p>
        ) : null}

        {locationSource === 'geo' && geoLocationLabel ? (
          <p className="-mt-1 shrink-0 text-xs font-medium text-white/80">
            <span className="text-white/55">Current location:</span>{' '}
            {geoLocationLabel}
          </p>
        ) : null}
        {locationSource === 'manual' && searchedPlace ? (
          <p className="-mt-1 shrink-0 text-xs font-semibold text-white">
            {searchedPlace}
          </p>
        ) : null}

        <div className="flex shrink-0 flex-col items-center py-1 text-center">
          <ConditionLottie
            animationData={lottieData}
            condition={current.condition}
          />
          <p className="mt-3 text-5xl font-semibold tracking-tight text-white">
            {formatTemp(current.temp, units)}
          </p>
          <p className="mt-1.5 text-xs font-medium text-white/70">
            {formatNowDateTime()}
          </p>
        </div>

        <div className="shrink-0 space-y-2.5 border-t border-white/20 pt-3">
          <div className="flex items-center gap-2.5 text-sm text-white">
            <TablerIcon name={icon} className="text-base text-white/70" />
            <span className="capitalize">{current.condition}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-white/70">
            <TablerIcon name="ti-cloud-rain" className="text-base text-sky-300" />
            <span>{rainLine}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto shrink-0 pt-4">
        <AISummaryBanner
          summary={aiSummary}
          unavailableReason={aiUnavailableReason}
          lang={lang}
          isLoading={aiSummaryLoading}
          compact
        />
      </div>
    </aside>
  )
}
