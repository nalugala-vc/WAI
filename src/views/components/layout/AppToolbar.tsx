import { useLocation } from 'react-router-dom'
import { useAppStore } from '../../../viewmodels/useAppStore'
import { ViewNav } from './ViewNav'

export function AppToolbar() {
  const location = useLocation()
  const units = useAppStore((state) => state.units)
  const setUnits = useAppStore((state) => state.setUnits)
  const onDashboard = location.pathname === '/'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ViewNav />

      {onDashboard ? (
        <div className="flex rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setUnits('metric')}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              units === 'metric'
                ? 'bg-white/20 text-white'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            °C
          </button>
          <button
            type="button"
            onClick={() => setUnits('imperial')}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              units === 'imperial'
                ? 'bg-white/20 text-white'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            °F
          </button>
        </div>
      ) : null}
    </div>
  )
}
