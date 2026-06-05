import { useState } from 'react'

export type AnalysisFormField =
  | 'farmerId'
  | 'county'
  | 'landAcres'
  | 'location'
  | 'notes'

export interface AnalysisFormProps {
  farmerId: string
  county: string
  landAcres: string
  location: string
  notes: string
  onChange: (field: string, value: string) => void
  onSubmit: () => void
  isDisabled: boolean
}

export function AnalysisForm({
  farmerId,
  county,
  landAcres,
  location,
  notes,
  onChange,
  onSubmit,
  isDisabled,
}: AnalysisFormProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Add farm details (optional)
        <span className="text-gray-400">{expanded ? '▴' : '▾'}</span>
      </button>

      {expanded ? (
        <div className="space-y-4 border-t border-gray-100 px-4 pb-4 pt-3">
          <label className="block">
            <span className="text-xs font-medium text-gray-600">
              Farmer / Plot ID
            </span>
            <input
              type="text"
              value={farmerId}
              onChange={(event) => onChange('farmerId', event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-gray-600">County</span>
            <input
              type="text"
              value={county}
              onChange={(event) => onChange('county', event.target.value)}
              placeholder="e.g. Bomet, Nakuru"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-gray-600">
              Land size (acres)
            </span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={landAcres}
              onChange={(event) => onChange('landAcres', event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-gray-600">
              Location / farm name
            </span>
            <input
              type="text"
              value={location}
              onChange={(event) => onChange('location', event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-gray-600">Notes for AI</span>
            <textarea
              value={notes}
              onChange={(event) => onChange('notes', event.target.value)}
              placeholder="e.g. Tea plantation, recently pruned"
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </label>
        </div>
      ) : null}

      <div className="border-t border-gray-100 p-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isDisabled}
          className="w-full rounded-lg bg-green-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Analyse farm
        </button>
      </div>
    </section>
  )
}
