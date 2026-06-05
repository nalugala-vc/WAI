import type { TreeAnalysisResult } from '../../../models/trees.model'
import { TablerIcon } from '../common/TablerIcon'

export interface HistoryCardProps {
  analyses: TreeAnalysisResult[]
  isLoading: boolean
  onSelect: (result: TreeAnalysisResult) => void
}

function formatHistoryDate(timestamp: string): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return timestamp
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function HistoryRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-lg border border-gray-100 p-3">
      <div className="h-10 w-10 rounded-lg bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 rounded bg-gray-200" />
        <div className="h-2 w-24 rounded bg-gray-200" />
      </div>
      <div className="h-5 w-12 rounded-full bg-gray-200" />
    </div>
  )
}

export function HistoryCard({
  analyses,
  isLoading,
  onSelect,
}: HistoryCardProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">Past analyses</h2>

      {isLoading ? (
        <div className="space-y-2">
          <HistoryRowSkeleton />
          <HistoryRowSkeleton />
          <HistoryRowSkeleton />
        </div>
      ) : analyses.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">
          No analyses yet — upload your first farm image above
        </p>
      ) : (
        <ul className="space-y-2">
          {analyses.map((analysis) => {
            const title =
              analysis.location ?? analysis.analysis_id.slice(0, 12)
            const subtitle = [
              analysis.county,
              formatHistoryDate(analysis.timestamp),
            ]
              .filter(Boolean)
              .join(' · ')

            return (
              <li key={analysis.analysis_id}>
                <button
                  type="button"
                  onClick={() => onSelect(analysis)}
                  className="flex w-full items-center gap-3 rounded-lg border border-gray-100 p-3 text-left transition-colors hover:border-green-200 hover:bg-green-50/50"
                >
                  <img
                    src={analysis.overlay_image_url}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {title}
                    </p>
                    <p className="truncate text-xs text-gray-500">{subtitle}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                    {analysis.total_tree_count}
                  </span>
                  <TablerIcon
                    name="ti-chevron-right"
                    className="shrink-0 text-gray-400"
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
