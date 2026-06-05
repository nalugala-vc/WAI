import { useState } from 'react'
import { TablerIcon } from '../common/TablerIcon'
import {
  farmBtnPrimary,
  farmHeading,
  farmInput,
  farmLabel,
  farmPanel,
  farmStepBadge,
  farmSubtext,
} from './farmUi'

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
  const [showDetails, setShowDetails] = useState(false)

  return (
    <section className={`${farmPanel} overflow-hidden`}>
      <div className="border-b border-white/20 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={farmStepBadge}>
              2
            </span>
            <div>
              <p className={farmHeading}>Run the analysis</p>
              <p className={farmSubtext}>Optional plot details for your records</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/15"
          >
            <TablerIcon name="ti-list-details" className="text-sm" />
            {showDetails ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      <div className="p-5">
        {showDetails ? (
          <div className="mb-5 grid gap-4 border-b border-white/20 pb-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={farmLabel}>Plot name</span>
              <input
                type="text"
                value={location}
                onChange={(e) => onChange('location', e.target.value)}
                placeholder="Block 4, Kericho"
                className={farmInput}
              />
            </label>
            <label className="block">
              <span className={farmLabel}>County</span>
              <input
                type="text"
                value={county}
                onChange={(e) => onChange('county', e.target.value)}
                placeholder="Bomet"
                className={farmInput}
              />
            </label>
            <label className="block">
              <span className={farmLabel}>Acres</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={landAcres}
                onChange={(e) => onChange('landAcres', e.target.value)}
                className={farmInput}
              />
            </label>
            <label className="block">
              <span className={farmLabel}>Plot ID</span>
              <input
                type="text"
                value={farmerId}
                onChange={(e) => onChange('farmerId', e.target.value)}
                className={farmInput}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className={farmLabel}>Notes</span>
              <textarea
                value={notes}
                onChange={(e) => onChange('notes', e.target.value)}
                placeholder="Crop type, last prune, anything useful"
                rows={2}
                className={farmInput}
              />
            </label>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isDisabled}
          className={`${farmBtnPrimary} w-full`}
        >
          Analyse canopy
        </button>
      </div>
    </section>
  )
}
