import type { ReactNode } from 'react'
import type { CurrentWeather, DailyForecast } from '../../../models/weather.model'
import {
  formatTemp,
  formatTimeShort,
  formatWind,
  getUVLabel,
  humidityStatus,
  windDirectionLabel,
} from '../../../utils/formatters'
import { TablerIcon } from '../common/TablerIcon'

export interface TodayHighlightsProps {
  current: CurrentWeather
  todayDaily: DailyForecast | undefined
  units: 'metric' | 'imperial'
}

function UvGauge({ value }: { value: number }) {
  const clamped = Math.min(11, Math.max(0, value))
  const pct = clamped / 11

  return (
    <div className="relative mx-auto flex h-24 w-40 items-end justify-center">
      <svg viewBox="0 0 120 70" className="h-full w-full">
        <path
          d="M 12 60 A 48 48 0 0 1 108 60"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 12 60 A 48 48 0 0 1 108 60"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${pct * 151} 151`}
        />
      </svg>
      <span className="absolute bottom-0 text-3xl font-semibold text-white">
        {value.toFixed(0)}
      </span>
    </div>
  )
}

function VerticalMeter({
  value,
  max,
  color,
}: {
  value: number
  max: number
  color: string
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="flex h-16 w-3 overflow-hidden rounded-full bg-slate-100">
      <div
        className={`mt-auto w-full rounded-full ${color}`}
        style={{ height: `${pct}%` }}
      />
    </div>
  )
}

interface HighlightCardProps {
  title: string
  children: ReactNode
  className?: string
}

function HighlightCard({ title, children, className = '' }: HighlightCardProps) {
  return (
    <div
      className={`flex flex-col rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md ${className}`}
    >
      <p className="mb-3 text-sm font-medium text-white/60">{title}</p>
      {children}
    </div>
  )
}

export function TodayHighlights({
  current,
  todayDaily,
  units,
}: TodayHighlightsProps) {
  const humidity = humidityStatus(current.humidity)
  const uvLabel = getUVLabel(current.uv_index)

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-white">
        Today&apos;s Highlights
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <HighlightCard title="UV Index">
          <UvGauge value={current.uv_index} />
          <p className="mt-2 text-center text-xs text-white/60">{uvLabel}</p>
        </HighlightCard>

        <HighlightCard title="Wind Status">
          <p className="text-3xl font-semibold text-white">
            {formatWind(current.wind_kph, units)}
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-white/60">
            <TablerIcon name="ti-navigation" className="text-sky-500" />
            {windDirectionLabel(current.wind_direction)}
          </div>
        </HighlightCard>

        <HighlightCard title="Sunrise & Sunset">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white/60">
                <TablerIcon name="ti-arrow-up" className="text-amber-500" />
                Sunrise
              </span>
              <span className="font-medium text-white">
                {formatTimeShort(todayDaily?.sunrise)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white/60">
                <TablerIcon name="ti-arrow-down" className="text-indigo-400" />
                Sunset
              </span>
              <span className="font-medium text-white">
                {formatTimeShort(todayDaily?.sunset)}
              </span>
            </div>
          </div>
        </HighlightCard>

        <HighlightCard title="Humidity">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold text-white">
                {Math.round(current.humidity)}%
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/60">
                {humidity.label}
                {humidity.tone === 'good' ? (
                  <TablerIcon name="ti-thumb-up" className="text-emerald-500" />
                ) : (
                  <TablerIcon name="ti-alert-circle" className="text-amber-500" />
                )}
              </p>
            </div>
            <VerticalMeter
              value={current.humidity}
              max={100}
              color="bg-sky-400"
            />
          </div>
        </HighlightCard>

        <HighlightCard title="Rainfall">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold text-white">
                {current.precip_mm.toFixed(1)} mm
              </p>
              <p className="mt-1 text-sm text-white/60">Today&apos;s total</p>
            </div>
            <VerticalMeter
              value={Math.min(current.precip_mm, 20)}
              max={20}
              color="bg-blue-400"
            />
          </div>
        </HighlightCard>

        <HighlightCard title="Feels Like">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold text-white">
                {formatTemp(current.feels_like, units)}
              </p>
              <p className="mt-1 text-sm text-white/60">
                {current.is_day ? 'Daytime' : 'Nighttime'}
              </p>
            </div>
            <TablerIcon
              name={current.is_day ? 'ti-sun' : 'ti-moon'}
              className="text-4xl text-amber-400"
            />
          </div>
        </HighlightCard>
      </div>
    </section>
  )
}
