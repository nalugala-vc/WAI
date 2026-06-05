import type { ReactNode } from 'react'
import { ErrorLottie } from './ErrorLottie'

export interface ErrorStateProps {
  title: string
  message: string
  onRetry?: () => void
  retryLabel?: string
  devDetail?: string
  compact?: boolean
  action?: ReactNode
}

export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel = 'Try again',
  devDetail,
  compact = false,
  action,
}: ErrorStateProps) {
  return (
    <section
      className={`flex w-full flex-col items-center justify-center text-center ${
        compact ? 'py-6' : 'min-h-[min(60vh,480px)] px-4 py-10'
      }`}
    >
      <div
        className={`w-full rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md ${
          compact ? 'max-w-sm p-6' : 'max-w-md p-8 lg:p-10'
        }`}
      >
        <div className="mx-auto flex justify-center">
          <ErrorLottie size={compact ? 120 : 168} />
        </div>

        <h2
          className={`font-semibold text-white ${
            compact ? 'mt-3 text-base' : 'mt-5 text-lg'
          }`}
        >
          {title}
        </h2>

        <p
          className={`leading-relaxed text-white/70 ${
            compact ? 'mt-2 text-xs' : 'mt-2.5 text-sm'
          }`}
        >
          {message}
        </p>

        {import.meta.env.DEV && devDetail ? (
          <p className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-left text-xs text-white/50">
            {devDetail}
          </p>
        ) : null}

        {action ? (
          <div className="mt-6">{action}</div>
        ) : onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 rounded-2xl bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/30"
          >
            {retryLabel}
          </button>
        ) : null}
      </div>
    </section>
  )
}
