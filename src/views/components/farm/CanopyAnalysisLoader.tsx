import { useEffect, useMemo, useState } from 'react'
import { TablerIcon } from '../common/TablerIcon'
import { farmHeading, farmPanel } from './farmUi'

const STEPS = [
  { id: 'upload', label: 'Uploading image', icon: 'ti-upload' },
  { id: 'scan', label: 'Scanning canopy', icon: 'ti-radar' },
  { id: 'detect', label: 'Detecting trees', icon: 'ti-trees' },
  { id: 'cover', label: 'Measuring coverage', icon: 'ti-chart-area-line' },
  { id: 'health', label: 'Assessing tree health', icon: 'ti-heart-rate-monitor' },
  { id: 'report', label: 'Preparing your report', icon: 'ti-file-description' },
] as const

export interface CanopyAnalysisLoaderProps {
  file: File
}

export function CanopyAnalysisLoader({ file }: CanopyAnalysisLoaderProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(8)

  const previewUrl = useMemo(() => URL.createObjectURL(file), [file])

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  useEffect(() => {
    const stepTimer = window.setInterval(() => {
      setActiveStep((current) =>
        current < STEPS.length - 1 ? current + 1 : current,
      )
    }, 2200)

    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) return current
        const bump = current < 40 ? 4 : current < 75 ? 2 : 0.6
        return Math.min(92, current + bump)
      })
    }, 400)

    return () => {
      window.clearInterval(stepTimer)
      window.clearInterval(progressTimer)
    }
  }, [])

  return (
    <section className={`${farmPanel} overflow-hidden`}>
      <div className="border-b border-white/20 px-5 py-4">
        <p className={farmHeading}>Running analysis</p>
        <p className="text-sm text-white/70">This usually takes under a minute</p>
      </div>

      <div className="p-5">
        <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl border border-white/20 bg-white/5">
          <img
            src={previewUrl}
            alt="Analysing canopy"
            className="h-full w-full object-cover opacity-70"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/20" />
          <div className="canopy-scan-line absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="canopy-pulse-ring flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-sm">
              <TablerIcon name="ti-trees" className="text-3xl text-white" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-white/80">Analysing your photo</span>
            <span className="tabular-nums text-white/50">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-white/50 to-white/80 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="mb-4 text-sm font-medium text-white">
          {STEPS[activeStep].label}…
        </p>

        <ul className="space-y-2">
          {STEPS.map((step, index) => {
            const done = index < activeStep
            const current = index === activeStep
            return (
              <li
                key={step.id}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  current
                    ? 'bg-white/10 text-white'
                    : done
                      ? 'text-white/55'
                      : 'text-white/30'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                    done
                      ? 'border-white/30 bg-white/15 text-white'
                      : current
                        ? 'border-white/40 bg-white/10 text-white'
                        : 'border-white/15 bg-white/5 text-white/35'
                  }`}
                >
                  {done ? (
                    <TablerIcon name="ti-check" className="text-sm" />
                  ) : current ? (
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <TablerIcon name={step.icon} className="text-sm" />
                  )}
                </span>
                <span>{step.label}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
