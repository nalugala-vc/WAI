import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '../../viewmodels/useAppStore'
import { useGeoViewModel } from '../../viewmodels/useGeoViewModel'
import { useWeatherViewModel } from '../../viewmodels/useWeatherViewModel'
import {
  getConditionBackground,
  getOverlayOpacity,
} from '../../utils/conditionAssets'
import { AppToolbar } from '../components/layout/AppToolbar'
import { DashboardSidebar } from '../components/weather/DashboardSidebar'
import { DashboardSkeleton } from '../components/weather/DashboardSkeleton'
import { ForecastStrip } from '../components/weather/ForecastStrip'
import { TodayHighlights } from '../components/weather/TodayHighlights'
import { TemperatureChart } from '../components/weather/TemperatureChart'
import { isToday } from '../../utils/formatters'

export default function DashboardPage() {
  const lat = useAppStore((state) => state.lat)
  const lon = useAppStore((state) => state.lon)
  const lang = useAppStore((state) => state.lang)
  const units = useAppStore((state) => state.units)
  const geo = useGeoViewModel()
  const weather = useWeatherViewModel(lat, lon, lang)

  const hasWeatherData =
    weather.current !== undefined &&
    typeof weather.current.temp === 'number'
  const showSkeleton =
    (!hasWeatherData && geo.isLoading && lat === null) ||
    (!hasWeatherData && weather.isLoading && lat !== null)
  const showError =
    (geo.isError && lat === null) ||
    (weather.isError && lat !== null && lon !== null)

  const handleRetry = () => {
    void geo.refetch()
    if (lat !== null && lon !== null) {
      weather.refetch()
    }
  }

  const todayDaily = weather.daily.find((day) => isToday(day.date))

  const dayHeading = useMemo(() => {
    if (todayDaily?.day_of_week) return todayDaily.day_of_week
    const tz = weather.location.timezone
    try {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: tz || undefined,
      }).format(new Date())
    } catch {
      return new Date().toLocaleDateString('en-US', { weekday: 'long' })
    }
  }, [todayDaily?.day_of_week, weather.location.timezone])

  const condition = weather.current?.condition ?? null
  const isDay = weather.current?.is_day ?? false
  const timezone = weather.location.timezone

  const liveBg = condition
    ? getConditionBackground(condition, isDay, timezone)
    : null
  const overlayOpacity = condition ? getOverlayOpacity(condition, isDay) : 0.5

  // Update the displayed background whenever live data produces a new URL.
  // When liveBg is null (city loading), we skip the update so the old
  // city's background remains visible.
  const [displayedBg, setDisplayedBg] = useState('')
  useEffect(() => {
    if (liveBg) setDisplayedBg(liveBg)
  }, [liveBg])

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: displayedBg ? `url(${displayedBg})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div
        className="fixed inset-0 z-10"
        style={{
          backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
          transition: 'opacity 0.6s ease-in-out',
        }}
      />

      <div className="relative z-20 min-h-screen lg:h-screen lg:overflow-hidden">
        <div className="flex h-full w-full max-w-[100rem] flex-col py-6 pl-3 pr-5 lg:py-6 lg:pl-5 lg:pr-10">
          {showSkeleton ? <DashboardSkeleton /> : null}

          {showError && !showSkeleton ? (
            <section className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-medium text-red-800">
                Unable to load weather data. Check your API key and connection.
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Try again
              </button>
            </section>
          ) : null}

          {!showSkeleton && !showError && weather.current ? (
            <div className="flex min-h-0 flex-1 flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6">
              <div className="w-full shrink-0 lg:sticky lg:top-0 lg:h-full lg:w-[280px]">
                <DashboardSidebar
                  current={weather.current}
                  units={units}
                  lang={lang}
                  aiSummary={weather.aiSummary}
                  aiUnavailableReason={weather.aiUnavailableReason}
                  aiSummaryLoading={weather.aiSummaryLoading}
                />
              </div>

              <main className="min-h-0 min-w-0 flex-1 space-y-6 lg:overflow-y-auto lg:overscroll-contain lg:pb-6 lg:pr-1">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-white drop-shadow-sm">
                    {dayHeading}
                  </h2>
                  <AppToolbar />
                </div>

                <ForecastStrip forecasts={weather.daily} units={units} />

                <TodayHighlights
                  current={weather.current}
                  todayDaily={todayDaily}
                  units={units}
                />

                <TemperatureChart
                  hourly={weather.hourly}
                  daily={weather.daily}
                  units={units}
                />
              </main>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
