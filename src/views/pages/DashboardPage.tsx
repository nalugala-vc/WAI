import { useEffect, useState } from 'react'
import { useAppStore } from '../../viewmodels/useAppStore'
import { useGeoViewModel } from '../../viewmodels/useGeoViewModel'
import { useWeatherViewModel } from '../../viewmodels/useWeatherViewModel'
import {
  getConditionBackground,
  getOverlayOpacity,
} from '../../utils/conditionAssets'
import { AppToolbar } from '../components/layout/AppToolbar'
import { AISummaryBanner } from '../components/weather/AISummaryBanner'
import { DashboardSidebar } from '../components/weather/DashboardSidebar'
import { DashboardSkeleton } from '../components/weather/DashboardSkeleton'
import { ForecastStrip } from '../components/weather/ForecastStrip'
import { TodayHighlights } from '../components/weather/TodayHighlights'
import { TemperatureChart } from '../components/weather/TemperatureChart'
import { isToday } from '../../utils/formatters'

type ViewTab = 'today' | 'week'

export default function DashboardPage() {
  const [viewTab, setViewTab] = useState<ViewTab>('week')

  const lat = useAppStore((state) => state.lat)
  const lon = useAppStore((state) => state.lon)
  const lang = useAppStore((state) => state.lang)
  const units = useAppStore((state) => state.units)
  const storeCity = useAppStore((state) => state.city)
  const storeRegion = useAppStore((state) => state.region)

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

  const city = weather.location.city || storeCity || geo.city
  const region = weather.location.region || storeRegion || geo.region
  const country = weather.location.country

  const todayDaily = weather.daily.find((day) => isToday(day.date))

  const condition = weather.current?.condition ?? 'clear'
  const isDay = weather.current?.is_day ?? true
  const bg = getConditionBackground(condition, isDay)
  const overlayOpacity = getOverlayOpacity(condition, isDay)

  const [displayedBg, setDisplayedBg] = useState(bg)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (bg !== displayedBg) {
      setFading(true)
      const timer = setTimeout(() => {
        setDisplayedBg(bg)
        setFading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [bg, displayedBg])

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${displayedBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.6s ease-in-out',
        }}
      />

      <div
        className="fixed inset-0 z-10"
        style={{
          backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
          transition: 'opacity 0.6s ease-in-out',
        }}
      />

      <div className="relative z-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-6 pb-12 lg:px-6">
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
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <DashboardSidebar
                city={city}
                region={region}
                country={country}
                current={weather.current}
                units={units}
              />

              <main className="min-w-0 flex-1 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-8">
                    <button
                      type="button"
                      onClick={() => setViewTab('today')}
                      className={`pb-2 text-sm font-semibold transition-colors ${
                        viewTab === 'today'
                          ? 'border-b-2 border-slate-900 text-slate-900'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewTab('week')}
                      className={`pb-2 text-sm font-semibold transition-colors ${
                        viewTab === 'week'
                          ? 'border-b-2 border-slate-900 text-slate-900'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Week
                    </button>
                  </div>

                  <AppToolbar />
                </div>

                {viewTab === 'week' ? (
                  <ForecastStrip
                    forecasts={weather.daily}
                    units={units}
                  />
                ) : null}

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

                <AISummaryBanner
                  summary={weather.aiSummary}
                  unavailableReason={weather.aiUnavailableReason}
                  lang={lang}
                  isLoading={weather.aiSummaryLoading}
                />
              </main>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
