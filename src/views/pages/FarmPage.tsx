import { useCallback, useState } from 'react'
import type { AnalyzeTreesPayload } from '../../models/trees.model'
import { useTreesViewModel } from '../../viewmodels/useTreesViewModel'
import { AnalysisForm } from '../components/farm/AnalysisForm'
import { AnalysisResultCard } from '../components/farm/AnalysisResultCard'
import { HistoryCard } from '../components/farm/HistoryCard'
import { QuotaBadge } from '../components/farm/QuotaBadge'
import { UploadZone } from '../components/farm/UploadZone'
import { AppToolbar } from '../components/layout/AppToolbar'
import { TablerIcon } from '../components/common/TablerIcon'

function parseLandAcres(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number.parseFloat(trimmed)
  return Number.isNaN(parsed) ? undefined : parsed
}

export default function FarmPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    uploadStatus,
    uploadAnalysis,
    currentResult,
    farmerId,
    county,
    landAcres,
    location,
    notes,
    setFarmerId,
    setCounty,
    setLandAcres,
    setLocation,
    setNotes,
    history,
    isHistoryLoading,
    quota,
    selectResult,
    reset,
  } = useTreesViewModel()

  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      switch (field) {
        case 'farmerId':
          setFarmerId(value)
          break
        case 'county':
          setCounty(value)
          break
        case 'landAcres':
          setLandAcres(value)
          break
        case 'location':
          setLocation(value)
          break
        case 'notes':
          setNotes(value)
          break
        default:
          break
      }
    },
    [
      setFarmerId,
      setCounty,
      setLandAcres,
      setLocation,
      setNotes,
    ],
  )

  const handleSubmit = useCallback(() => {
    if (!selectedFile || uploadStatus === 'uploading') return

    const payload: AnalyzeTreesPayload = {
      image: selectedFile,
      farmerId: farmerId.trim() || undefined,
      county: county.trim() || undefined,
      landAcres: parseLandAcres(landAcres),
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    }

    uploadAnalysis(payload)
  }, [
    selectedFile,
    uploadStatus,
    farmerId,
    county,
    landAcres,
    location,
    notes,
    uploadAnalysis,
  ])

  const handleReset = useCallback(() => {
    reset()
    setSelectedFile(null)
  }, [reset])

  const showUploadFlow =
    uploadStatus === 'idle' || uploadStatus === 'error'
  const showResult =
    uploadStatus === 'success' && currentResult !== null
  const showHistory = uploadStatus !== 'uploading'

  return (
    <div className="min-h-screen bg-[#f6f6f8]">
      <main className="mx-auto max-w-5xl space-y-6 p-4 pb-10 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <TablerIcon name="ti-trees" className="text-2xl text-emerald-600" />
            Farm canopy analysis
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <AppToolbar />
            <QuotaBadge quota={quota} />
          </div>
        </div>

        {showUploadFlow ? (
          <>
            <UploadZone
              onFileSelect={setSelectedFile}
              onClear={() => setSelectedFile(null)}
              selectedFile={selectedFile}
              uploadStatus={uploadStatus}
            />
            <AnalysisForm
              farmerId={farmerId}
              county={county}
              landAcres={landAcres}
              location={location}
              notes={notes}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              isDisabled={!selectedFile}
            />
          </>
        ) : null}

        {uploadStatus === 'uploading' ? (
          <UploadZone
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
            uploadStatus={uploadStatus}
          />
        ) : null}

        {showResult ? (
          <AnalysisResultCard
            result={currentResult}
            onReset={handleReset}
          />
        ) : null}

        {showHistory ? (
          <HistoryCard
            analyses={history}
            isLoading={isHistoryLoading}
            onSelect={selectResult}
          />
        ) : null}
      </main>
    </div>
  )
}
