import { useCallback, useState } from 'react'
import farmBg from '../../assets/farm_bg/farm bg.jpg'
import { useTreesViewModel } from '../../viewmodels/useTreesViewModel'
import { AnalysisForm } from '../components/farm/AnalysisForm'
import { AnalysisResultCard } from '../components/farm/AnalysisResultCard'
import { CanopyAnalysisLoader } from '../components/farm/CanopyAnalysisLoader'
import { HistoryCard } from '../components/farm/HistoryCard'
import { QuotaBadge } from '../components/farm/QuotaBadge'
import { farmShell } from '../components/farm/farmUi'
import { UploadZone } from '../components/farm/UploadZone'
import { AppToolbar } from '../components/layout/AppToolbar'

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
    isHistoryError,
    quota,
    isQuotaLoading,
    isQuotaError,
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

    uploadAnalysis({
      image: selectedFile,
      farmerId: farmerId.trim() || undefined,
      county: county.trim() || undefined,
      landAcres: parseLandAcres(landAcres),
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    })
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

  const isUploading = uploadStatus === 'uploading'
  const showResult =
    uploadStatus === 'success' && currentResult !== null
  const showUploadFlow =
    !showResult && !isUploading && (uploadStatus === 'idle' || uploadStatus === 'error')

  return (
    <div className="relative min-h-screen text-white">
      {/* Background photo */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${farmBg})` }}
      />

      {/* Light overlay so text stays readable; background stays visible */}
      <div className="fixed inset-0 z-10 bg-black/40" />

      <main className="relative z-20 mx-auto max-w-6xl px-4 py-8 pb-14 lg:px-8">
        <header className={`${farmShell} mb-8 p-6 lg:p-7`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                  Tree canopy
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white lg:text-[1.65rem]">
                Count & assess your plot
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-white/70">
                Upload a photo from the field or drone. You get tree counts,
                canopy cover, and a health breakdown you can keep on record.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-4 sm:items-end">
              <AppToolbar />
              <QuotaBadge
                quota={quota}
                isLoading={isQuotaLoading}
                isError={isQuotaError}
              />
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="space-y-5">
            {isUploading && selectedFile ? (
              <CanopyAnalysisLoader file={selectedFile} />
            ) : null}

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

            {showResult ? (
              <AnalysisResultCard
                result={currentResult}
                onReset={handleReset}
              />
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-8">
            <HistoryCard
              analyses={history}
              isLoading={isHistoryLoading}
              isError={isHistoryError}
              onSelect={selectResult}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}
