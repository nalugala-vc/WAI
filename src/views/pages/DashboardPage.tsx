import { useAppStore } from '../../viewmodels/useAppStore'
import { useGeoDetectionQuery } from '../../viewmodels/useGeoViewModel'
import { ForecastStrip } from '../components/weather/ForecastStrip'
import { HeroWeatherCard } from '../components/weather/HeroWeatherCard'
import { StatRow } from '../components/weather/StatRow'
import { TemperatureChart } from '../components/weather/TemperatureChart'
import { SearchBar } from '../components/layout/SearchBar'
import { TopBar } from '../components/layout/TopBar'

export function DashboardPage() {
  useGeoDetectionQuery()
  const selectedLocation = useAppStore((state) => state.selectedLocation)

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <SearchBar />
      <main className="mx-auto max-w-5xl space-y-6 p-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Dashboard
          {selectedLocation ? ` — ${selectedLocation}` : ''}
        </h1>
        <HeroWeatherCard />
        <StatRow />
        <TemperatureChart />
        <ForecastStrip />
      </main>
    </div>
  )
}
