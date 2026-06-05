import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import type { DailyForecast, HourlyForecast } from '../../../models/weather.model'
import { formatDayName, formatHour, formatTemp } from '../../../utils/formatters'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
)

export type ChartMode = 'hourly' | 'weekly'

export interface TemperatureChartProps {
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  units: 'metric' | 'imperial'
  /** When omitted, the chart manages its own Today / This week tabs. */
  mode?: ChartMode
}

interface LegendItem {
  id: string
  label: string
  description: string
  color: string
  dashed?: boolean
  filled?: boolean
}

const TAB_COPY: Record<
  ChartMode,
  {
    title: string
    subtitle: string
    source: string
    xAxis: string
    yLeft: string
    yRight?: string
  }
> = {
  hourly: {
    title: 'Today (hourly)',
    subtitle:
      'Hour-by-hour temperature and rain probability for the next 24 hours.',
    source: 'Hourly forecast · next 24 hours',
    xAxis: 'Time of day',
    yLeft: 'Temperature',
    yRight: 'Rain chance (%)',
  },
  weekly: {
    title: 'This week (daily)',
    subtitle: 'Daily high and low temperatures for the next 7 days.',
    source: '7-day forecast · one point per day',
    xAxis: 'Day of week',
    yLeft: 'Temperature',
  },
}

export function TemperatureChart({
  hourly,
  daily,
  units,
  mode: controlledMode,
}: TemperatureChartProps) {
  const [internalMode, setInternalMode] = useState<ChartMode>('hourly')
  const mode = controlledMode ?? internalMode
  const tabsControlled = controlledMode === undefined

  const tempUnit = units === 'imperial' ? '°F' : '°C'
  const copy = TAB_COPY[mode]

  const hourlyChart = useMemo(() => {
    const labels = hourly.map((point) => formatHour(point.time))
    return {
      labels,
      datasets: [
        {
          label: `Temperature (${tempUnit})`,
          data: hourly.map((point) => point.temp),
          borderColor: '#e2e8f0',
          backgroundColor: 'rgba(226, 232, 240, 0.12)',
          fill: true,
          yAxisID: 'y',
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2,
        },
        {
          label: 'Rain chance (%)',
          data: hourly.map((point) => point.rain_chance),
          borderColor: 'rgba(56, 189, 248, 0.55)',
          backgroundColor: 'rgba(56, 189, 248, 0.22)',
          fill: true,
          yAxisID: 'y1',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 1.5,
        },
      ],
    }
  }, [hourly, tempUnit])

  const weeklyChart = useMemo(() => {
    const labels = daily.map(
      (point) => point.day_of_week?.slice(0, 3) ?? formatDayName(point.date),
    )
    return {
      labels,
      datasets: [
        {
          label: `High (${tempUnit})`,
          data: daily.map((point) => point.max_temp),
          borderColor: '#1D9E75',
          backgroundColor: '#1D9E75',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#1D9E75',
          borderWidth: 2,
        },
        {
          label: `Low (${tempUnit})`,
          data: daily.map((point) => point.min_temp),
          borderColor: '#9FE1CB',
          backgroundColor: '#9FE1CB',
          borderDash: [6, 4],
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#9FE1CB',
          borderWidth: 2,
        },
      ],
    }
  }, [daily, tempUnit])

  const legendItems: LegendItem[] =
    mode === 'hourly'
      ? [
          {
            id: 'temp',
            label: 'Temperature',
            description: `Left axis · each hour (${tempUnit})`,
            color: '#e2e8f0',
            filled: true,
          },
          {
            id: 'rain',
            label: 'Rain chance',
            description: 'Right axis · 0–100% per hour',
            color: 'rgba(56, 189, 248, 0.85)',
            filled: true,
          },
        ]
      : [
          {
            id: 'high',
            label: 'Daily high',
            description: `Solid line · max temp each day (${tempUnit})`,
            color: '#1D9E75',
          },
          {
            id: 'low',
            label: 'Daily low',
            description: `Dashed line · min temp each day (${tempUnit})`,
            color: '#9FE1CB',
            dashed: true,
          },
        ]

  const chartData = mode === 'hourly' ? hourlyChart : weeklyChart

  const chartOptions =
    mode === 'hourly'
      ? {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index' as const, intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 12,
              cornerRadius: 12,
              callbacks: {
                title: (items: { label?: string }[]) => {
                  const label = items[0]?.label
                  return label ? `Today · ${label}` : 'Today'
                },
                label: (context: {
                  dataset: { label?: string }
                  parsed: { y: number | null }
                }) => {
                  const value = context.parsed.y
                  if (value === null) return ''
                  if (context.dataset.label?.includes('Rain')) {
                    return `Rain chance: ${Math.round(value)}%`
                  }
                  return `Temperature: ${formatTemp(value, units)}`
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: copy.xAxis,
                color: 'rgba(255,255,255,0.45)',
                font: { size: 11 },
              },
              grid: { display: false },
              ticks: { color: 'rgba(255,255,255,0.55)', maxTicksLimit: 8 },
            },
            y: {
              position: 'left' as const,
              title: {
                display: true,
                text: `${copy.yLeft} (${tempUnit})`,
                color: 'rgba(255,255,255,0.45)',
                font: { size: 11 },
              },
              grid: { color: 'rgba(255,255,255,0.12)' },
              ticks: {
                color: 'rgba(255,255,255,0.55)',
                callback: (value: string | number) =>
                  `${value}${tempUnit}`,
              },
            },
            y1: {
              position: 'right' as const,
              min: 0,
              max: 100,
              title: {
                display: true,
                text: copy.yRight ?? 'Rain chance (%)',
                color: 'rgba(125, 211, 252, 0.85)',
                font: { size: 11 },
              },
              grid: { drawOnChartArea: false },
              ticks: {
                color: 'rgba(125, 211, 252, 0.85)',
                callback: (value: string | number) => `${value}%`,
              },
            },
          },
        }
      : {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index' as const, intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 12,
              cornerRadius: 12,
              callbacks: {
                title: (items: { label?: string }[]) => {
                  const label = items[0]?.label
                  return label ? `This week · ${label}` : 'This week'
                },
                label: (context: {
                  dataset: { label?: string }
                  parsed: { y: number | null }
                }) => {
                  const value = context.parsed.y
                  if (value === null) return ''
                  const kind = context.dataset.label?.includes('Low')
                    ? 'Low'
                    : 'High'
                  return `${kind}: ${formatTemp(value, units)}`
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: copy.xAxis,
                color: 'rgba(255,255,255,0.45)',
                font: { size: 11 },
              },
              grid: { display: false },
              ticks: { color: 'rgba(255,255,255,0.55)' },
            },
            y: {
              title: {
                display: true,
                text: `${copy.yLeft} (${tempUnit})`,
                color: 'rgba(255,255,255,0.45)',
                font: { size: 11 },
              },
              grid: { color: 'rgba(255,255,255,0.12)' },
              ticks: {
                color: 'rgba(255,255,255,0.55)',
                callback: (value: string | number) =>
                  `${value}${tempUnit}`,
              },
            },
          },
        }

  const hasData = mode === 'hourly' ? hourly.length > 0 : daily.length > 0
  const pointCount = mode === 'hourly' ? hourly.length : daily.length

  const setMode = (next: ChartMode) => {
    if (!tabsControlled) return
    setInternalMode(next)
  }

  return (
    <section className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h2 className="text-lg font-semibold text-white">{copy.title}</h2>
          <p className="text-sm leading-relaxed text-white/70">
            {copy.subtitle}
          </p>
          <p className="text-xs text-white/45">{copy.source}</p>
        </div>

        {tabsControlled ? (
          <div
            className="flex shrink-0 rounded-full border border-white/20 bg-black/20 p-1"
            role="tablist"
            aria-label="Chart time range"
          >
            {(['hourly', 'weekly'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={mode === tab}
                onClick={() => setMode(tab)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  mode === tab
                    ? 'bg-white/20 text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {tab === 'hourly' ? 'Today (hourly)' : 'This week (daily)'}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {hasData ? (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
            <span>
              {mode === 'hourly'
                ? `${pointCount} hourly points · X: time, Y: temp + rain %`
                : `${pointCount} days · X: weekday, Y: high & low`}
            </span>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            {legendItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  {item.dashed ? (
                    <span
                      className="inline-block w-8 border-b-2 border-dashed"
                      style={{ borderColor: item.color }}
                      aria-hidden
                    />
                  ) : (
                    <span
                      className={`inline-block h-0.5 w-8 ${
                        item.filled ? 'rounded-sm' : ''
                      }`}
                      style={{
                        backgroundColor: item.color,
                        boxShadow: item.filled
                          ? `0 3px 0 0 ${item.color.replace('0.85', '0.25')}`
                          : undefined,
                      }}
                      aria-hidden
                    />
                  )}
                  <span className="text-xs font-semibold text-white/90">
                    {item.label}
                  </span>
                </div>
                <p className="mt-1 pl-10 text-[11px] leading-snug text-white/50">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </>
      ) : (
        <p className="py-16 text-center text-sm text-white/60">
          {mode === 'hourly'
            ? 'Hourly forecast is not available yet. Check your connection or try again.'
            : 'Weekly forecast is not available yet. Check your connection or try again.'}
        </p>
      )}
    </section>
  )
}
