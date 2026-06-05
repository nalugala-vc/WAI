import { getConditionIcon } from '../../../utils/conditionIcon'
import { formatTemp } from '../../../utils/formatters'
import { TablerIcon } from '../common/TablerIcon'

export interface HeroWeatherCardProps {
  city: string
  region: string
  temp: number
  feelsLike: number
  condition: string
  isDay: boolean
  aiSummary: string
  units: 'metric' | 'imperial'
}

export function HeroWeatherCard({
  city,
  region,
  temp,
  feelsLike,
  condition,
  isDay,
  aiSummary,
  units,
}: HeroWeatherCardProps) {
  const icon = getConditionIcon(condition)

  return (
    <section className="rounded-2xl bg-gradient-to-br from-sky-50 to-green-50 p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">
            {city}
            {region ? `, ${region}` : ''}
          </p>
          <p className="text-6xl font-light tracking-tight text-gray-900">
            {formatTemp(temp, units)}
          </p>
          <p className="text-lg capitalize text-gray-700">{condition}</p>
          <p className="text-sm text-gray-500">
            Feels like {formatTemp(feelsLike, units)}
            {!isDay ? ' · Night' : ''}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 md:items-end">
          <TablerIcon
            name={icon}
            className="text-7xl text-amber-500 md:text-8xl"
          />

          <div className="w-full max-w-sm rounded-xl border border-green-100 bg-white/80 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-700">
              <TablerIcon name="ti-sparkles" className="text-sm" />
              AI summary
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              {aiSummary || 'No summary available yet.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
