import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DashboardDevicePreview,
  type DemoDevice,
} from '../components/demo/DashboardDevicePreview'
import { TablerIcon } from '../components/common/TablerIcon'

const DEVICES: { id: DemoDevice; label: string; icon: string }[] = [
  { id: 'iphone', label: 'iPhone', icon: 'ti-device-mobile' },
  { id: 'android', label: 'Android', icon: 'ti-brand-android' },
  { id: 'ipad', label: 'iPad', icon: 'ti-device-tablet' },
  { id: 'laptop', label: 'Laptop', icon: 'ti-device-laptop' },
]

function deviceDescription(id: DemoDevice): string {
  switch (id) {
    case 'ipad':
      return 'Landscape tablet layout with sidebar and forecast panels.'
    case 'laptop':
      return 'Full desktop layout — sidebar, highlights, and charts at full width.'
    default:
      return 'Portrait mobile layout with stacked weather cards.'
  }
}

export default function DashboardMockupPage() {
  const [device, setDevice] = useState<DemoDevice>('laptop')

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0f14] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 lg:max-w-7xl lg:px-8 lg:py-14">
        <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Portfolio preview
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">
              Shamba Intel Dashboard
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
              Your live weather dashboard inside realistic device frames — same
              components, same data.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/15 lg:self-auto"
          >
            <TablerIcon name="ti-arrow-left" className="text-base" />
            Open live app
          </Link>
        </header>

        <div className="mb-8 flex flex-wrap gap-2">
          {DEVICES.map((item) => {
            const active = device === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setDevice(item.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'border border-white/15 bg-white/5 text-white/55 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                <TablerIcon name={item.icon} className="text-base" />
                {item.label}
              </button>
            )
          })}
        </div>

        <section
          className={`rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md ${
            device === 'laptop' || device === 'ipad'
              ? 'overflow-x-auto p-4 lg:p-6'
              : 'p-6 lg:p-10'
          }`}
        >
          <div className="flex justify-center">
            <DashboardDevicePreview device={device} />
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEVICES.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            >
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                {deviceDescription(item.id)}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
