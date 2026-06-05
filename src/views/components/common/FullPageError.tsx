import { ErrorState } from './ErrorState'

export interface FullPageErrorProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  devDetail?: string
}

export function FullPageError({
  title = "Something went wrong",
  message = "The app hit an unexpected error. Reload and try again.",
  onRetry,
  retryLabel = 'Reload page',
  devDetail,
}: FullPageErrorProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at top, rgba(56,189,248,0.25), transparent 55%), radial-gradient(ellipse at bottom, rgba(15,23,42,0.9), rgba(2,6,23,1))',
        }}
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 w-full max-w-lg px-4">
        <ErrorState
          title={title}
          message={message}
          onRetry={onRetry ?? (() => window.location.reload())}
          retryLabel={retryLabel}
          devDetail={devDetail}
        />
      </div>
    </div>
  )
}
