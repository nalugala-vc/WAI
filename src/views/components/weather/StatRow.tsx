import {
  formatWind,
  getUVLabel,
} from '../../../utils/formatters'
import { TablerIcon } from '../common/TablerIcon'

export interface StatRowProps {
  humidity: number
  windKph: number
  uvIndex: number
  precipMm: number
  units: 'metric' | 'imperial'
}

interface StatCardProps {
  label: string
  value: string
  sublabel?: string
  icon: string
}

function StatCard({ label, value, sublabel, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </span>
        <TablerIcon name={icon} className="text-lg text-green-600" />
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {sublabel ? (
        <p className="mt-1 text-xs text-gray-500">{sublabel}</p>
      ) : null}
    </div>
  )
}

export function StatRow({
  humidity,
  windKph,
  uvIndex,
  precipMm,
  units,
}: StatRowProps) {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard
        label="Humidity"
        value={`${Math.round(humidity)}%`}
        icon="ti-droplet"
      />
      <StatCard
        label="Wind"
        value={formatWind(windKph, units)}
        icon="ti-wind"
      />
      <StatCard
        label="UV Index"
        value={uvIndex.toFixed(1)}
        sublabel={getUVLabel(uvIndex)}
        icon="ti-sun"
      />
      <StatCard
        label="Rainfall"
        value={`${precipMm.toFixed(1)} mm`}
        icon="ti-cloud-rain"
      />
    </section>
  )
}
