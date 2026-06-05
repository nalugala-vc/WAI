import { TablerIcon } from '../common/TablerIcon'

export interface AISummaryBannerProps {
  summary: string
  lang: 'en' | 'sw'
  isLoading: boolean
}

export function AISummaryBanner({
  summary,
  lang,
  isLoading,
}: AISummaryBannerProps) {
  const label = lang === 'sw' ? 'Muhtasari wa AI' : 'AI Insights'

  if (isLoading) {
    return (
      <section className="animate-pulse rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-3 h-4 w-28 rounded-lg bg-slate-200" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-slate-200" />
          <div className="h-3 w-5/6 rounded bg-slate-200" />
        </div>
      </section>
    )
  }

  if (!summary) return null

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
          <TablerIcon name="ti-sparkles" className="text-amber-500" />
        </span>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">{summary}</p>
    </section>
  )
}
