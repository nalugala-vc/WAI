import { useEffect, useMemo } from 'react'
import type { DailyForecast } from '../../../models/weather.model'
import { getConditionLottie } from '../../../utils/conditionAssets'
import {
  buildDayForecastNarrative,
  getForecastDayLabel,
  isDayFromForecastIcon,
} from '../../../utils/forecastNarrative'
import { formatTempValue } from '../../../utils/formatters'
import { TablerIcon } from '../common/TablerIcon'
import { ConditionLottie } from './ConditionLottie'

export interface DayForecastModalProps {
  day: DailyForecast
  units: 'metric' | 'imperial'
  lang: 'en' | 'sw'
  onClose: () => void
}

export function DayForecastModal({
  day,
  units,
  lang,
  onClose,
}: DayForecastModalProps) {
  const isDay = isDayFromForecastIcon(day.condition_icon)
  const lottieData = useMemo(
    () => getConditionLottie(day.condition, isDay),
    [day.condition, isDay],
  )
  const narrative = buildDayForecastNarrative(day, units, lang)
  const title = getForecastDayLabel(day)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-forecast-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/25 bg-white/15 p-6 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
          aria-label="Close"
        >
          <TablerIcon name="ti-x" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="scale-125">
            <ConditionLottie
              animationData={lottieData}
              condition={day.condition}
            />
          </div>

          <h3
            id="day-forecast-title"
            className="mt-2 text-lg font-semibold text-white"
          >
            {title}
          </h3>

          <p className="mt-1 text-sm capitalize text-white/70">
            {day.condition}
          </p>

          <p className="mt-2 text-sm font-medium text-white/90">
            {formatTempValue(day.max_temp, units)}{' '}
            <span className="text-white/50">/</span>{' '}
            {formatTempValue(day.min_temp, units)}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-white">
            {narrative}
          </p>
        </div>
      </div>
    </div>
  )
}
