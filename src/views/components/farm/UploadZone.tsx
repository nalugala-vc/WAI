import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react'
import type { UploadStatus } from '../../../viewmodels/useTreesViewModel'
import { TablerIcon } from '../common/TablerIcon'
import { farmHeading, farmPanel, farmStepBadge, farmSubtext } from './farmUi'

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface UploadZoneProps {
  onFileSelect: (file: File) => void
  onClear?: () => void
  selectedFile: File | null
  uploadStatus: UploadStatus
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadZone({
  onFileSelect,
  onClear,
  selectedFile,
  uploadStatus,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [sizeError, setSizeError] = useState<string | null>(null)

  const isError = uploadStatus === 'error'
  const disabled = uploadStatus === 'uploading'

  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const validateAndSelect = useCallback(
    (file: File | undefined) => {
      if (!file) return
      setSizeError(null)

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setSizeError('Use JPEG, PNG, or WebP.')
        return
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setSizeError('Image must be under 20 MB.')
        return
      }

      onFileSelect(file)
    },
    [onFileSelect],
  )

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)
      if (disabled) return
      validateAndSelect(event.dataTransfer.files[0])
    },
    [disabled, validateAndSelect],
  )

  const handleRemove = () => {
    setSizeError(null)
    onClear?.()
    if (inputRef.current) inputRef.current.value = ''
  }

  const dropzoneClass = isError
    ? 'border-red-400/60 bg-red-500/10'
    : isDragging
      ? 'border-white/50 bg-white/15'
      : selectedFile
        ? 'border-white/30 bg-white/5'
        : 'border-white/25 border-dashed bg-white/5 hover:border-white/40 hover:bg-white/10'

  return (
    <section className={`${farmPanel} overflow-hidden`}>
      <div className="border-b border-white/20 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className={farmStepBadge}>
            1
          </span>
          <div>
            <p className={farmHeading}>Add your photo</p>
            <p className={farmSubtext}>Field shot or drone image works best</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              if (!disabled) inputRef.current?.click()
            }
          }}
          onClick={() => {
            if (!disabled) inputRef.current?.click()
          }}
          onDragOver={(event) => {
            event.preventDefault()
            if (!disabled) setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative overflow-hidden rounded-xl border-2 p-2 transition-all ${dropzoneClass} ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={disabled}
            onChange={(event) => validateAndSelect(event.target.files?.[0])}
          />

          {selectedFile && previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Selected canopy"
                className="aspect-[16/10] w-full rounded-lg object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 rounded-b-lg bg-gradient-to-t from-black/90 to-transparent px-4 py-3">
                <p className="truncate text-sm font-medium text-white">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-white/60">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  handleRemove()
                }}
                className="absolute right-3 top-3 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/90"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                <TablerIcon name="ti-photo-up" className="text-2xl text-white/80" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Drop image here or click to browse
                </p>
                <p className="mt-1 text-xs text-white/50">
                  JPEG, PNG, WebP · max 20 MB
                </p>
              </div>
            </div>
          )}
        </div>

        {sizeError ? (
          <p className="mt-3 text-sm text-red-300">{sizeError}</p>
        ) : null}

        {isError && !sizeError ? (
          <p className="mt-3 text-sm text-red-300">
            Something went wrong — try another image.
          </p>
        ) : null}
      </div>
    </section>
  )
}
