import type { TreeAnalysisResult } from '../../../models/trees.model'
import { farmHeading, farmPanel, farmSubtext } from './farmUi'

export interface HistoryCardProps {
  analyses: TreeAnalysisResult[]
  isLoading: boolean
  isError?: boolean
  onSelect: (result: TreeAnalysisResult) => void
}

function formatHistoryDate(timestamp: string): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return timestamp
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function HistoryRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-3">
      <div className="h-12 w-12 rounded-lg bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 rounded bg-white/10" />
        <div className="h-2 w-16 rounded bg-white/10" />
      </div>
    </div>
  )
}

export function HistoryCard({
  analyses,
  isLoading,
  isError,
  onSelect,
}: HistoryCardProps) {
  return (
    <section className={`${farmPanel} overflow-hidden`}>
      <div className="border-b border-white/20 px-4 py-4">
        <p className={farmHeading}>Past runs</p>
        <p className={farmSubtext}>Open a previous result</p>
      </div>

      <div className="max-h-[min(70vh,520px)] space-y-2 overflow-y-auto p-3">
        {isLoading ? (
          <>
            <HistoryRowSkeleton />
            <HistoryRowSkeleton />
            <HistoryRowSkeleton />
          </>
        ) : isError ? (
          <p className="px-2 py-10 text-center text-sm leading-relaxed text-white/50">
            Could not load history. Refresh the page to try again.
          </p>
        ) : analyses.length === 0 ? (
          <p className="px-2 py-10 text-center text-sm leading-relaxed text-white/50">
            Nothing here yet. Your analyses will show up after the first upload.
          </p>
        ) : (
          analyses.map((analysis) => {
            const title =
              analysis.location ?? analysis.county ?? 'Unnamed plot'
            const subtitle = formatHistoryDate(analysis.timestamp)
            const thumbUrl =
              analysis.overlay_image_url ?? analysis.original_image_url

            return (
              <button
                key={analysis.analysis_id}
                type="button"
                onClick={() => onSelect(analysis)}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-3 text-left transition-colors hover:bg-white/15"
              >
                <img
                  src={thumbUrl}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-white/20"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {title}
                  </p>
                  <p className="text-xs text-white/50">{subtitle}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold tabular-nums text-white">
                    {analysis.total_tree_count}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-white/40">
                    trees
                  </p>
                </div>
              </button>
            )
          })
        )}
      </div>
    </section>
  )
}
