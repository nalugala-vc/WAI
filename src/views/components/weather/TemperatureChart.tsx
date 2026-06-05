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
import { useMemo } from 'react'
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
  mode: ChartMode
}

interface LegendItem {
  id: string
  label: string
  color: string
  dashed?: boolean
}

export function TemperatureChart({
  hourly,
  daily,
  units,
  mode,
}: TemperatureChartProps) {
  const hourlyChart = useMemo(() => {
    const labels = hourly.map((point) => formatHour(point.time))
    return {
      labels,
      datasets: [
        {
          label: units === 'imperial' ? 'Temperature (°F)' : 'Temperature (°C)',
          data: hourly.map((point) => point.temp),
          borderColor: '#334155',
          backgroundColor: 'rgba(51, 65, 85, 0.08)',
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
          borderColor: 'rgba(56, 189, 248, 0.5)',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          fill: true,
          yAxisID: 'y1',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 1.5,
        },
      ],
    }
  }, [hourly, units])

  const weeklyChart = useMemo(() => {
    const labels = daily.map(
      (point) => point.day_of_week?.slice(0, 3) ?? formatDayName(point.date),
    )
    return {
      labels,
      datasets: [
        {
          label: 'High',
          data: daily.map((point) => point.max_temp),
          borderColor: '#0f172a',
          backgroundColor: '#0f172a',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#0f172a',
          borderWidth: 2,
        },
        {
          label: 'Low',
          data: daily.map((point) => point.min_temp),
          borderColor: '#94a3b8',
          backgroundColor: '#94a3b8',
          borderDash: [6, 4],
          tension: 0.4,
          pointRadius: 4,
          borderWidth: 2,
        },
      ],
    }
  }, [daily])

  const legendItems: LegendItem[] =
    mode === 'hourly'
      ? [
          { id: 'temp', label: 'Temperature', color: '#334155' },
          { id: 'rain', label: 'Rain chance', color: 'rgba(56, 189, 248, 0.8)' },
        ]
      : [
          { id: 'high', label: 'High', color: '#0f172a' },
          { id: 'low', label: 'Low', color: '#94a3b8', dashed: true },
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
                label: (context: {
                  dataset: { label?: string }
                  parsed: { y: number | null }
                }) => {
                  const value = context.parsed.y
                  if (value === null) return ''
                  if (context.dataset.label?.includes('Rain')) {
                    return `${context.dataset.label}: ${Math.round(value)}%`
                  }
                  return `${context.dataset.label}: ${formatTemp(value, units)}`
                },
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: 'rgba(255,255,255,0.5)', maxTicksLimit: 8 },
            },
            y: {
              position: 'left' as const,
              grid: { color: 'rgba(255,255,255,0.15)' },
              ticks: { color: 'rgba(255,255,255,0.5)' },
            },
            y1: {
              position: 'right' as const,
              min: 0,
              max: 100,
              grid: { drawOnChartArea: false },
              ticks: { color: 'rgba(255,255,255,0.5)' },
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
                label: (context: {
                  dataset: { label?: string }
                  parsed: { y: number | null }
                }) => {
                  const value = context.parsed.y
                  if (value === null) return ''
                  return `${context.dataset.label}: ${formatTemp(value, units)}`
                },
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: 'rgba(255,255,255,0.5)' },
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.15)' },
              ticks: { color: 'rgba(255,255,255,0.5)' },
            },
          },
        }

  const hasData = mode === 'hourly' ? hourly.length > 0 : daily.length > 0
  const title = mode === 'hourly' ? 'Hourly temperature' : 'Weekly temperature'

  return (
    <section className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>

      {hasData ? (
        <>
          <div className="mb-4 flex flex-wrap gap-4">
            {legendItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 text-xs text-white/60"
              >
                {item.dashed ? (
                  <span
                    className="inline-block w-6 border-b-2 border-dashed"
                    style={{ borderColor: item.color }}
                  />
                ) : (
                  <span
                    className="inline-block h-0.5 w-6"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                {item.label}
              </div>
            ))}
          </div>
          <div className="h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </>
      ) : (
        <p className="py-16 text-center text-sm text-white/60">
          No chart data available.
        </p>
      )}
    </section>
  )
}
