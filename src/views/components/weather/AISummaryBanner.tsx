import { TablerIcon } from '../common/TablerIcon'

export interface AISummaryBannerProps {
  summary: string
  unavailableReason?: string
  lang: 'en' | 'sw'
  isLoading: boolean
}

export function AISummaryBanner({
  summary,
  unavailableReason,
  lang,
  isLoading,
}: AISummaryBannerProps) {
  const label = lang === 'sw' ? 'Muhtasari wa AI' : 'AI Insights'
  const fallback =
    lang === 'sw'
      ? 'Hakuna muhtasari wa AI kwa eneo hili kwa sasa.'
      : 'No AI summary is available for this location yet.'

  if (isLoading) {
    return (
      <section className="animate-pulse rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
        <div className="mb-3 h-4 w-28 rounded-lg bg-white/20" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-white/20" />
          <div className="h-3 w-5/6 rounded bg-white/20" />
        </div>
      </section>
    )
  }

  const body = summary || unavailableReason || fallback

  return (
    <section className="rounded-3xl border border-white/20 border-l-4 border-l-white/40 bg-white/10 p-6 backdrop-blur-md">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
          <TablerIcon name="ti-sparkles" className="text-amber-300" />
        </span>
        <p className="text-sm font-semibold text-white/60">{label}</p>
      </div>
      <p
        className={`text-sm leading-relaxed ${
          summary ? 'text-white' : 'text-white/70'
        }`}
      >
        {body}
      </p>
    </section>
  )
}
