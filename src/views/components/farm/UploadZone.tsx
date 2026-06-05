import { useCallback, useRef, useState, type DragEvent } from 'react'
import type { UploadStatus } from '../../../viewmodels/useTreesViewModel'
import { TablerIcon } from '../common/TablerIcon'

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

  const isUploading = uploadStatus === 'uploading'
  const isError = uploadStatus === 'error'
  const disabled = isUploading

  const validateAndSelect = useCallback(
    (file: File | undefined) => {
      if (!file) return
      setSizeError(null)

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setSizeError('Please upload a JPEG, PNG, or WebP image.')
        return
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setSizeError('File exceeds 20 MB limit. Choose a smaller image.')
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

  const borderClass = isError
    ? 'border-red-400 bg-red-50'
    : isDragging
      ? 'border-green-500 bg-green-50'
      : 'border-gray-300 bg-white'

  return (
    <section className="space-y-2">
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
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${borderClass} ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-green-400'}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={disabled}
          onChange={(event) => validateAndSelect(event.target.files?.[0])}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
            <p className="text-sm font-medium text-gray-700">
              Analysing image…
            </p>
          </div>
        ) : selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <TablerIcon name="ti-photo" className="text-3xl text-green-600" />
            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {formatFileSize(selectedFile.size)}
            </p>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                handleRemove()
              }}
              className="mt-1 rounded-full px-2 py-0.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              aria-label="Remove file"
            >
              × Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <TablerIcon name="ti-cloud-upload" className="text-4xl text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Drag & drop a farm canopy image
            </p>
            <p className="text-xs text-gray-500">
              or click to browse · JPEG, PNG, WebP · max 20 MB
            </p>
          </div>
        )}
      </div>

      {sizeError ? (
        <p className="text-sm text-red-600">{sizeError}</p>
      ) : null}

      {isError && !sizeError ? (
        <p className="text-sm text-red-600">
          Upload failed, try again
        </p>
      ) : null}
    </section>
  )
}
