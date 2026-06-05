import { useMemo, useState } from 'react'
import { ConditionLottie } from './ConditionLottie'
import type { FormEvent } from 'react'
import type { CurrentWeather } from '../../../models/weather.model'
import { useAppStore } from '../../../viewmodels/useAppStore'
import { getConditionLottie } from '../../../utils/conditionAssets'
import { getConditionIcon } from '../../../utils/conditionIcon'
import {
  formatNowDateTime,
  formatTemp,
} from '../../../utils/formatters'
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

export interface DashboardSidebarProps {
  city: string
  region: string
  country: string
  current: CurrentWeather
  units: 'metric' | 'imperial'
}

export function DashboardSidebar({
  city,
  region,
  country,
  current,
  units,
}: DashboardSidebarProps) {
  const [query, setQuery] = useState('')
  const locationSource = useAppStore((state) => state.locationSource)
  const setLocation = useAppStore((state) => state.setLocation)

  const icon = getConditionIcon(current.condition)
  const lottieData = useMemo(
    () => getConditionLottie(current.condition, current.is_day),
    [current.condition, current.is_day],
  )
  const locationLabel = [city, region, country].filter(Boolean).join(', ')
  const rainLine = current.precip_mm > 0
    ? `Rain · ${current.precip_mm.toFixed(1)} mm`
    : `Rain chance from forecast`

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!query.trim()) return
    // TODO: integrate geocoding API to resolve location names to lat/lon
    const coords = parseCoordinates(query)
    if (coords) {
      setLocation(coords.lat, coords.lon, query.trim(), '', 'manual')
    }
  }

  return (
    <aside className="flex flex-col gap-6 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md lg:min-h-[640px]">
      <form onSubmit={handleSubmit} className="relative">
        <TablerIcon
          name="ti-search"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for places..."
          className="w-full rounded-2xl bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          aria-label="Location settings"
        >
          <TablerIcon name="ti-map-pin" />
        </button>
      </form>

      {locationSource === 'geo' ? (
        <span className="-mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          Auto-detected
        </span>
      ) : null}

      <div className="flex flex-col items-center py-4 text-center">
        <ConditionLottie
          animationData={lottieData}
          condition={current.condition}
        />
        <p className="mt-4 text-6xl font-semibold tracking-tight text-white">
          {formatTemp(current.temp, units)}
        </p>
        <p className="mt-2 text-sm font-medium text-white/70">
          {formatNowDateTime()}
        </p>
      </div>

      <div className="space-y-3 border-t border-white/20 pt-5">
        <div className="flex items-center gap-3 text-sm text-white">
          <TablerIcon name={icon} className="text-lg text-white/70" />
          <span className="capitalize">{current.condition}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <TablerIcon name="ti-cloud-rain" className="text-lg text-sky-300" />
          <span>{rainLine}</span>
        </div>
      </div>

      <div className="mt-auto overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
        <p className="p-4 text-sm font-semibold text-white">
          {locationLabel || 'Your location'}
        </p>
      </div>
    </aside>
  )
}
