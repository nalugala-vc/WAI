import { useState } from 'react'
import type { TreeAnalysisResult } from '../../../models/trees.model'
import {
  farmBtnPrimary,
  farmBtnSecondary,
  farmHeading,
  farmPanel,
  farmStatBox,
} from './farmUi'

export interface AnalysisResultCardProps {
  result: TreeAnalysisResult
  onReset: () => void
}

type ImageView = 'original' | 'overlay'

function confidenceTone(score: number): string {
  if (score >= 80) return 'text-emerald-300 border-emerald-500/30 bg-emerald-500/15'
  if (score >= 60) return 'text-amber-200 border-amber-500/30 bg-amber-500/15'
  return 'text-red-200 border-red-500/30 bg-red-500/15'
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return timestamp
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function formatPercent(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return `${value.toFixed(digits)}%`
}

function formatNumber(value: number | null | undefined, digits = 0): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return value.toFixed(digits)
}

export function AnalysisResultCard({ result, onReset }: AnalysisResultCardProps) {
  const hasOverlay = Boolean(result.overlay_image_url)
  const [imageView, setImageView] = useState<ImageView>(
    hasOverlay ? 'overlay' : 'original',
  )

  const health = result.tree_health
  const healthTotal =
    health.healthy + health.needs_care + health.needs_replacement || 1

  const healthyPct = (health.healthy / healthTotal) * 100
  const carePct = (health.needs_care / healthTotal) * 100
  const replacePct = (health.needs_replacement / healthTotal) * 100

  const imageUrl =
    imageView === 'overlay' && result.overlay_image_url
      ? result.overlay_image_url
      : result.original_image_url

  const tabClass = (active: boolean, disabled = false) =>
    `rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
      disabled
        ? 'cursor-not-allowed text-white/25'
        : active
          ? 'bg-white/20 text-white'
          : 'text-white/55 hover:bg-white/10 hover:text-white/80'
    }`

  const showIncomplete =
    result.low_confidence ||
    result.total_tree_count === 0 ||
    Boolean(result.gemini_error)

  return (
    <section className={`${farmPanel} overflow-hidden`}>
      <div className="border-b border-white/20 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className={farmHeading}>Results</p>
            <p className="text-xs text-white/50">
              {formatTimestamp(result.timestamp)}
            </p>
          </div>
          <div className="flex gap-1 rounded-lg border border-white/15 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setImageView('overlay')}
              disabled={!hasOverlay}
              className={tabClass(imageView === 'overlay', !hasOverlay)}
            >
              Annotated
            </button>
            <button
              type="button"
              onClick={() => setImageView('original')}
              className={tabClass(imageView === 'original')}
            >
              Original
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 lg:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <img
            src={imageUrl}
            alt={
              imageView === 'overlay' && hasOverlay
                ? 'Annotated canopy overlay'
                : 'Original farm image'
            }
            className="aspect-[4/3] w-full rounded-2xl border border-white/15 object-cover"
          />

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-white/60">Trees detected</p>
              <p className="text-4xl font-semibold tabular-nums tracking-tight text-white">
                {result.total_tree_count.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={farmStatBox}>
                <p className="text-xs text-white/50">Canopy cover</p>
                <p className="text-lg font-semibold text-white">
                  {formatPercent(result.canopy_coverage_pct)}
                </p>
              </div>
              {result.tree_density_per_acre !== null ? (
                <div className={farmStatBox}>
                  <p className="text-xs text-white/50">Per acre</p>
                  <p className="text-lg font-semibold text-white">
                    {formatNumber(result.tree_density_per_acre)}
                  </p>
                </div>
              ) : (
                <div className={farmStatBox}>
                  <p className="text-xs text-white/50">Species</p>
                  <p className="text-sm font-medium text-white">
                    {result.tree_species_guess ?? '—'}
                  </p>
                </div>
              )}
            </div>

            <span
              className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-medium ${confidenceTone(result.confidence_score)}`}
            >
              {formatNumber(result.confidence_score)}% model confidence
            </span>

            {showIncomplete ? (
              <div className="space-y-2">
                {result.gemini_error ? (
                  <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-100/90">
                    AI insights unavailable — tree count may still be partial.
                    Try another photo with a clear overhead or field view.
                  </p>
                ) : null}
                {result.low_confidence && !result.gemini_error ? (
                  <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-100/90">
                    Low confidence — try a clearer photo with the full canopy in
                    frame.
                  </p>
                ) : null}
                {result.total_tree_count === 0 ? (
                  <p className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/70">
                    No trees were detected in this image. Upload a photo that
                    shows the canopy or treeline more clearly.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between text-xs text-white/50">
            <span>Health mix</span>
            <span>
              {health.healthy} ok · {health.needs_care} care ·{' '}
              {health.needs_replacement} replace
            </span>
          </div>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="bg-emerald-500"
              style={{ width: `${healthyPct}%` }}
            />
            <div className="bg-amber-400" style={{ width: `${carePct}%` }} />
            <div className="bg-red-500" style={{ width: `${replacePct}%` }} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {result.observations.length > 0 ? (
            <div className={`${farmStatBox} p-4`}>
              <h3 className="text-xs font-medium uppercase tracking-wide text-white/50">
                Observations
              </h3>
              <ul className="mt-3 space-y-2">
                {result.observations.map((item, index) => (
                  <li
                    key={`obs-${index}`}
                    className="flex gap-2 text-sm leading-relaxed text-white/80"
                  >
                    <span className="text-white/35">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.recommendations.length > 0 ? (
            <div className={`${farmStatBox} p-4`}>
              <h3 className="text-xs font-medium uppercase tracking-wide text-white/50">
                Recommendations
              </h3>
              <ul className="mt-3 space-y-2">
                {result.recommendations.map((item, index) => (
                  <li
                    key={`rec-${index}`}
                    className="flex gap-2 text-sm leading-relaxed text-white/80"
                  >
                    <span className="text-white/35">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-white/20 pt-4">
          <button type="button" onClick={onReset} className={farmBtnPrimary}>
            New analysis
          </button>
          <button
            type="button"
            disabled
            title="Report export coming soon"
            className={`${farmBtnSecondary} cursor-not-allowed opacity-50`}
          >
            Export report
          </button>
        </div>
      </div>
    </section>
  )
}
