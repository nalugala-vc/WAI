import { useState } from 'react'
import type { DailyForecast } from '../../../models/weather.model'
import { getConditionIcon } from '../../../utils/conditionIcon'
import { getForecastDayLabel } from '../../../utils/forecastNarrative'
import { formatTempValue, isToday } from '../../../utils/formatters'
import { TablerIcon } from '../common/TablerIcon'
import { DayForecastModal } from './DayForecastModal'

export interface ForecastStripProps {
  forecasts: DailyForecast[]
  units: 'metric' | 'imperial'
  lang: 'en' | 'sw'
}

export function ForecastStrip({ forecasts, units, lang }: ForecastStripProps) {
  const days = forecasts.slice(0, 7)
  const [selectedDay, setSelectedDay] = useState<DailyForecast | null>(null)

  return (
    <>
      <section className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const today = isToday(day.date)
            const icon = getConditionIcon(day.condition)
            const dayLabel = getForecastDayLabel(day, true)

            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center gap-2 rounded-2xl px-2 py-4 text-center transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                  today
                    ? 'bg-white/20 text-white backdrop-blur-md'
                    : 'bg-transparent text-white'
                }`}
                aria-label={`View forecast for ${getForecastDayLabel(day)}`}
              >
                <span
                  className={`text-xs font-medium ${today ? 'text-white' : 'text-white/60'}`}
                >
                  {dayLabel}
                </span>
                <TablerIcon
                  name={icon}
                  className={`text-2xl ${today ? 'text-amber-300' : 'text-amber-400'}`}
                />
                <span className="text-sm font-semibold text-white">
                  {formatTempValue(day.max_temp, units)}
                </span>
                <span className="text-xs text-white/60">
                  {formatTempValue(day.min_temp, units)}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {selectedDay ? (
        <DayForecastModal
          day={selectedDay}
          units={units}
          lang={lang}
          onClose={() => setSelectedDay(null)}
        />
      ) : null}
    </>
  )
}
