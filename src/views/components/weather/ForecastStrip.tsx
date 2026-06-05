import type { DailyForecast } from '../../../models/weather.model'
import { getConditionIcon } from '../../../utils/conditionIcon'
import {
  formatDayName,
  formatTempValue,
  isToday,
} from '../../../utils/formatters'
import { TablerIcon } from '../common/TablerIcon'

export interface ForecastStripProps {
  forecasts: DailyForecast[]
  units: 'metric' | 'imperial'
}

export function ForecastStrip({ forecasts, units }: ForecastStripProps) {
  const days = forecasts.slice(0, 7)

  return (
    <section className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const today = isToday(day.date)
          const icon = getConditionIcon(day.condition)
          const dayLabel = today
            ? 'Today'
            : (day.day_of_week?.slice(0, 3) ?? formatDayName(day.date))

          return (
            <div
              key={day.date}
              className={`flex flex-col items-center gap-2 rounded-2xl px-2 py-4 text-center transition-colors ${
                today
                  ? 'bg-white/20 text-white backdrop-blur-md'
                  : 'bg-transparent text-white'
              }`}
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
              <span
                className={`text-xs ${today ? 'text-white/60' : 'text-white/60'}`}
              >
                {formatTempValue(day.min_temp, units)}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
