import type { TreeQuota } from '../../../models/trees.model'

export interface QuotaBadgeProps {
  quota: TreeQuota | null
}

export function QuotaBadge({ quota }: QuotaBadgeProps) {
  if (!quota) {
    return (
      <div className="animate-pulse rounded-full bg-gray-200 px-4 py-2">
        <div className="h-4 w-48 rounded bg-gray-300" />
      </div>
    )
  }

  if (quota.unlimited) {
    return (
      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
        Unlimited analyses
      </span>
    )
  }

  const usedPct =
    quota.limit > 0 ? Math.min(100, (quota.used / quota.limit) * 100) : 0
  const remainingPct =
    quota.limit > 0 ? (quota.remaining / quota.limit) * 100 : 0

  const barColor =
    remainingPct > 50
      ? 'bg-green-500'
      : remainingPct > 10
        ? 'bg-amber-500'
        : 'bg-red-500'

  const textColor =
    remainingPct > 50
      ? 'text-green-700'
      : remainingPct > 10
        ? 'text-amber-700'
        : 'text-red-700'

  return (
    <div
      className={`inline-flex min-w-[220px] flex-col gap-1.5 rounded-full border px-3 py-2 ${remainingPct > 50 ? 'border-green-200 bg-green-50' : remainingPct > 10 ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50'}`}
    >
      <span className={`text-xs font-medium ${textColor}`}>
        {quota.used} of {quota.limit} analyses used this month
      </span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/80">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${usedPct}%` }}
        />
      </div>
    </div>
  )
}
