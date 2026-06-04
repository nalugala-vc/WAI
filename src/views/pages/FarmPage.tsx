import { useAppStore } from '../../viewmodels/useAppStore'
import { useTreeAnalysisMutation } from '../../viewmodels/useTreesViewModel'
import { AnalysisResultCard } from '../components/farm/AnalysisResultCard'
import { UploadZone } from '../components/farm/UploadZone'
import { TopBar } from '../components/layout/TopBar'

export function FarmPage() {
  const language = useAppStore((state) => state.language)
  const { isAnalyzing } = useTreeAnalysisMutation()

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <main className="mx-auto max-w-5xl space-y-6 p-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Farm — Canopy Analysis ({language.toUpperCase()})
        </h1>
        {isAnalyzing ? (
          <p className="text-sm text-gray-500">Analyzing…</p>
        ) : null}
        <UploadZone />
        <AnalysisResultCard />
      </main>
    </div>
  )
}
