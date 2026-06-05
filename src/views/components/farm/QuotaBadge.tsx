import type { TreeQuota } from '../../../models/trees.model'

export interface QuotaBadgeProps {
  quota: TreeQuota | null
  isLoading?: boolean
  isError?: boolean
}

export function QuotaBadge({ quota, isLoading, isError }: QuotaBadgeProps) {
  if (isLoading) {
    return (
      <div className="h-10 w-52 animate-pulse rounded-2xl bg-white/10" />
    )
  }

  if (isError || !quota) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-right backdrop-blur-md">
        <p className="text-xs text-white/50">Quota unavailable</p>
      </div>
    )
  }

  if (quota.unlimited) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-right backdrop-blur-md">
        <p className="text-xs font-medium text-white/80">
          Unlimited analyses
        </p>
      </div>
    )
  }

  const usedPct =
    quota.limit > 0 ? Math.min(100, (quota.used / quota.limit) * 100) : 0
  const remainingPct =
    quota.limit > 0 ? (quota.remaining / quota.limit) * 100 : 0

  const barColor =
    remainingPct > 50
      ? 'bg-white/70'
      : remainingPct > 10
        ? 'bg-amber-400'
        : 'bg-red-400'

  return (
    <div className="min-w-[200px] rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
      <p className="text-xs text-white/60">
        <span className="text-lg font-bold tabular-nums text-white">
          {quota.remaining}
        </span>
        <span className="text-white/50"> / {quota.limit}</span>
        <span className="ml-1">runs left</span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${usedPct}%` }}
        />
      </div>
    </div>
  )
}
