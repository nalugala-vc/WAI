import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '../../viewmodels/useAppStore'
import { useGeoViewModel } from '../../viewmodels/useGeoViewModel'
import { useWeatherViewModel } from '../../viewmodels/useWeatherViewModel'
import {
  getConditionBackground,
  getOverlayOpacity,
  preloadAllConditionBackgrounds,
} from '../../utils/conditionAssets'
import { preloadImage } from '../../utils/preloadImage'
import { ErrorState } from '../components/common/ErrorState'
import { AppToolbar } from '../components/layout/AppToolbar'
import { DashboardSidebar } from '../components/weather/DashboardSidebar'
import { DashboardSkeleton } from '../components/weather/DashboardSkeleton'
import { ForecastStrip } from '../components/weather/ForecastStrip'
import { TodayHighlights } from '../components/weather/TodayHighlights'
import { TemperatureChart } from '../components/weather/TemperatureChart'
import { isToday } from '../../utils/formatters'

export interface DashboardPageProps {
  /** Render inside a device mockup frame instead of the full viewport. */
  embedded?: boolean
  /** Force layout when embedded (ignores breakpoints). */
  previewLayout?: 'mobile' | 'desktop' | 'ipad' | 'laptop'
}

export default function DashboardPage({
  embedded = false,
  previewLayout = 'mobile',
}: DashboardPageProps) {
  const lat = useAppStore((state) => state.lat)
  const lon = useAppStore((state) => state.lon)
  const lang = useAppStore((state) => state.lang)
  const units = useAppStore((state) => state.units)
  const locationSource = useAppStore((state) => state.locationSource)
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

  const loadError = geo.error ?? weather.error
  const loadErrorMessage =
    loadError instanceof Error
      ? loadError.message
      : 'Check your connection and API key, then try again.'

  const todayDaily = weather.daily.find((day) => isToday(day.date))

  const preferStore = locationSource === 'manual'
  const displayCity = preferStore
    ? storeCity || weather.location.city || geo.city
    : weather.location.city || storeCity || geo.city
  const displayRegion = preferStore
    ? storeRegion || weather.location.region || geo.region
    : weather.location.region || storeRegion || geo.region

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

  const [displayedBg, setDisplayedBg] = useState('')

  useEffect(() => {
    preloadAllConditionBackgrounds()
  }, [])

  useEffect(() => {
    if (!liveBg) return

    let cancelled = false
    void preloadImage(liveBg).then(() => {
      if (!cancelled) setDisplayedBg(liveBg)
    })

    return () => {
      cancelled = true
    }
  }, [liveBg])

  const isLaptopPreview = embedded && previewLayout === 'laptop'
  const isIpadPreview = embedded && previewLayout === 'ipad'
  const isCompactDesktop = embedded && previewLayout === 'desktop'
  const isMobilePreview = embedded && previewLayout === 'mobile'

  const rootClass = embedded
    ? 'relative h-full min-h-0 overflow-hidden'
    : 'relative min-h-screen'

  const bgClass = embedded ? 'absolute inset-0 z-0' : 'fixed inset-0 z-0'
  const overlayClass = embedded ? 'absolute inset-0 z-10' : 'fixed inset-0 z-10'
  const contentClass = embedded
    ? 'relative z-20 h-full overflow-hidden'
    : 'relative z-20 min-h-screen lg:h-screen lg:overflow-hidden'

  const innerPadClass = isLaptopPreview
    ? 'flex h-full w-full max-w-[100rem] flex-col py-6 pl-5 pr-8'
    : isIpadPreview
      ? 'flex h-full w-full flex-col py-4 pl-4 pr-5'
      : isCompactDesktop || isMobilePreview
        ? 'flex h-full w-full flex-col py-3 pl-2 pr-2'
        : 'flex h-full w-full max-w-[100rem] flex-col py-6 pl-3 pr-5 lg:py-6 lg:pl-5 lg:pr-10'

  const layoutClass = isLaptopPreview
    ? 'flex min-h-0 flex-1 flex-row items-stretch gap-6'
    : isIpadPreview
      ? 'flex min-h-0 flex-1 flex-row items-stretch gap-4'
      : isCompactDesktop
        ? 'flex min-h-0 flex-1 flex-row items-stretch gap-3'
        : isMobilePreview
          ? 'flex min-h-0 flex-1 flex-col gap-4'
          : 'flex min-h-0 flex-1 flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6'

  const sidebarWrapClass = isLaptopPreview
    ? 'h-full w-[280px] shrink-0'
    : isIpadPreview
      ? 'h-full w-[220px] shrink-0'
      : isCompactDesktop
        ? 'h-full w-[38%] shrink-0'
        : isMobilePreview
          ? 'w-full shrink-0'
          : 'w-full shrink-0 lg:sticky lg:top-0 lg:h-full lg:w-[280px]'

  const mainClass = isLaptopPreview
    ? 'min-h-0 min-w-0 flex-1 space-y-6 overflow-y-auto overscroll-contain pb-6 pr-1'
    : isIpadPreview
      ? 'min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pb-4 pr-0.5'
      : isCompactDesktop
        ? 'min-h-0 min-w-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-0.5'
        : isMobilePreview
          ? 'min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto overscroll-contain'
          : 'min-h-0 min-w-0 flex-1 space-y-6 lg:overflow-y-auto lg:overscroll-contain lg:pb-6 lg:pr-1'

  return (
    <div className={rootClass}>
      <div
        className={bgClass}
        style={{
          backgroundImage: displayedBg ? `url("${displayedBg}")` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div
        className={overlayClass}
        style={{
          backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
          transition: 'opacity 0.6s ease-in-out',
        }}
      />

      <div className={contentClass}>
        <div className={innerPadClass}>
          {showSkeleton ? <DashboardSkeleton /> : null}

          {showError && !showSkeleton ? (
            <ErrorState
              title="Couldn't load weather"
              message={loadErrorMessage}
              onRetry={handleRetry}
            />
          ) : null}

          {!showSkeleton && !showError && weather.current ? (
            <div className={layoutClass}>
              <div className={sidebarWrapClass}>
                <DashboardSidebar
                  current={weather.current}
                  units={units}
                  lang={lang}
                  aiSummary={weather.aiSummary}
                  aiUnavailableReason={weather.aiUnavailableReason}
                  aiSummaryLoading={weather.aiSummaryLoading}
                  city={displayCity}
                  region={displayRegion}
                />
              </div>

              <main className={mainClass}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2
                    className={`font-semibold text-white drop-shadow-sm ${
                      isMobilePreview || isCompactDesktop ? 'text-sm' : 'text-lg'
                    }`}
                  >
                    {dayHeading}
                  </h2>
                  <AppToolbar />
                </div>

                <ForecastStrip
                  forecasts={weather.daily}
                  units={units}
                  lang={lang}
                />

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
