import { useState } from 'react'
import type { TreeAnalysisResult } from '../../../models/trees.model'
import { TablerIcon } from '../common/TablerIcon'

export interface AnalysisResultCardProps {
  result: TreeAnalysisResult
  onReset: () => void
}

type ImageView = 'original' | 'overlay'

function confidenceColor(score: number): string {
  if (score >= 80) return 'text-green-700 bg-green-50 border-green-200'
  if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200'
  return 'text-red-700 bg-red-50 border-red-200'
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return timestamp
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function AnalysisResultCard({ result, onReset }: AnalysisResultCardProps) {
  const [imageView, setImageView] = useState<ImageView>('overlay')

  const health = result.tree_health
  const healthTotal =
    health.healthy + health.needs_care + health.needs_replacement || 1

  const healthyPct = (health.healthy / healthTotal) * 100
  const carePct = (health.needs_care / healthTotal) * 100
  const replacePct = (health.needs_replacement / healthTotal) * 100

  const imageUrl =
    imageView === 'original'
      ? result.original_image_url
      : result.overlay_image_url

  const handleDownload = () => {
    // TODO: generate and download PDF/CSV report
    console.log('Download report:', result.analysis_id)
  }

  return (
    <section className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setImageView('original')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                imageView === 'original'
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Original
            </button>
            <button
              type="button"
              onClick={() => setImageView('overlay')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                imageView === 'overlay'
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Annotated
            </button>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              {imageView === 'original' ? 'Original' : 'Annotated'}
            </p>
            <img
              src={imageUrl}
              alt={imageView === 'original' ? 'Original farm image' : 'Annotated canopy overlay'}
              className="h-64 w-full rounded-xl object-cover"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Total trees
            </p>
            <p className="text-4xl font-semibold text-gray-900">
              {result.total_tree_count.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Canopy coverage</p>
              <p className="text-lg font-semibold text-gray-900">
                {result.canopy_coverage_pct.toFixed(1)}%
              </p>
            </div>
            {result.tree_density_per_acre !== null ? (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Density / acre</p>
                <p className="text-lg font-semibold text-gray-900">
                  {result.tree_density_per_acre.toFixed(1)}
                </p>
              </div>
            ) : null}
          </div>

          <div
            className={`inline-flex rounded-lg border px-3 py-2 text-sm font-medium ${confidenceColor(result.confidence_score)}`}
          >
            Confidence: {result.confidence_score.toFixed(0)}%
          </div>

          {result.tree_species_guess ? (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Species guess:</span>{' '}
              {result.tree_species_guess}
            </p>
          ) : null}

          {result.low_confidence ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Low confidence — consider retaking the image with clearer canopy
              visibility.
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-900">
          Tree health breakdown
        </p>
        <div className="flex h-4 overflow-hidden rounded-full">
          <div
            className="bg-green-500"
            style={{ width: `${healthyPct}%` }}
            title={`${health.healthy} healthy`}
          />
          <div
            className="bg-amber-400"
            style={{ width: `${carePct}%` }}
            title={`${health.needs_care} need care`}
          />
          <div
            className="bg-red-500"
            style={{ width: `${replacePct}%` }}
            title={`${health.needs_replacement} need replacement`}
          />
        </div>
        <p className="mt-2 text-xs text-gray-600">
          {health.healthy} healthy · {health.needs_care} need care ·{' '}
          {health.needs_replacement} need replacement
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
            <TablerIcon name="ti-eye" className="text-green-600" />
            Observations
          </h3>
          {result.observations.length > 0 ? (
            <ul className="space-y-2">
              {result.observations.map((item, index) => (
                <li
                  key={`obs-${index}`}
                  className="flex gap-2 text-sm text-gray-700"
                >
                  <TablerIcon
                    name="ti-eye"
                    className="mt-0.5 shrink-0 text-gray-400"
                  />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No observations recorded.</p>
          )}
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
            <TablerIcon name="ti-bulb" className="text-green-600" />
            Recommendations
          </h3>
          {result.recommendations.length > 0 ? (
            <ul className="space-y-2">
              {result.recommendations.map((item, index) => (
                <li
                  key={`rec-${index}`}
                  className="flex gap-2 text-sm text-gray-700"
                >
                  <TablerIcon
                    name="ti-bulb"
                    className="mt-0.5 shrink-0 text-gray-400"
                  />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recommendations recorded.</p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        {formatTimestamp(result.timestamp)} · ID {result.analysis_id}
      </p>

      <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Analyse another farm
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Download report
        </button>
      </div>
    </section>
  )
}
