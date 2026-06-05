import { useLocation, useNavigate } from 'react-router-dom'
import { TablerIcon } from '../common/TablerIcon'

const VIEWS = [
  { path: '/', label: 'Weather', icon: 'ti-cloud' as const },
  { path: '/farm', label: 'Canopy', icon: 'ti-trees' as const },
] as const

export function ViewNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="inline-flex rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-sm"
      aria-label="App sections"
    >
      {VIEWS.map((view) => {
        const active = location.pathname === view.path
        return (
          <button
            key={view.path}
            type="button"
            onClick={() => navigate(view.path)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              active
                ? 'bg-white/20 text-white'
                : 'text-white/50 hover:text-white/80'
            }`}
            aria-current={active ? 'page' : undefined}
          >
            <TablerIcon name={view.icon} className="text-sm" />
            {view.label}
          </button>
        )
      })}
    </nav>
  )
}
