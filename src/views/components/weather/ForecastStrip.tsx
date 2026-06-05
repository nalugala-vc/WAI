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
    <section className="rounded-3xl bg-white p-5 shadow-sm">
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
                today ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
              }`}
            >
              <span
                className={`text-xs font-medium ${today ? 'text-slate-300' : 'text-slate-500'}`}
              >
                {dayLabel}
              </span>
              <TablerIcon
                name={icon}
                className={`text-2xl ${today ? 'text-amber-300' : 'text-amber-400'}`}
              />
              <span
                className={`text-sm font-semibold ${today ? 'text-white' : 'text-slate-900'}`}
              >
                {formatTempValue(day.max_temp, units)}
              </span>
              <span
                className={`text-xs ${today ? 'text-slate-400' : 'text-slate-500'}`}
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
