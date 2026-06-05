import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../../viewmodels/useAppStore'
import { TablerIcon } from '../common/TablerIcon'

const VIEWS = [
  { path: '/', label: 'Dashboard' },
  { path: '/farm', label: 'Farm analysis' },
] as const

export function AppToolbar() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const units = useAppStore((state) => state.units)
  const setUnits = useAppStore((state) => state.setUnits)

  const activeView =
    VIEWS.find((view) => view.path === location.pathname) ?? VIEWS[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-3 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/80 hover:bg-slate-50"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {activeView.label}
          <TablerIcon
            name="ti-chevron-down"
            className={`text-sm transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open ? (
          <ul
            role="listbox"
            className="absolute right-0 z-20 mt-2 min-w-[10rem] overflow-hidden rounded-2xl bg-white py-1 shadow-lg ring-1 ring-slate-200/80"
          >
            {VIEWS.map((view) => (
              <li key={view.path}>
                <button
                  type="button"
                  role="option"
                  aria-selected={location.pathname === view.path}
                  onClick={() => {
                    navigate(view.path)
                    setOpen(false)
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    location.pathname === view.path
                      ? 'bg-slate-100 font-semibold text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {view.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200/80">
        <button
          type="button"
          onClick={() => setUnits('metric')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            units === 'metric'
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          °C
        </button>
        <button
          type="button"
          onClick={() => setUnits('imperial')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            units === 'imperial'
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          °F
        </button>
      </div>
    </div>
  )
}
