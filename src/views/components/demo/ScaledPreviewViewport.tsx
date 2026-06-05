import type { PropsWithChildren } from 'react'

export interface ScaledPreviewViewportProps extends PropsWithChildren {
  /** Visible width inside the device screen (px). */
  screenWidth: number
  /** Layout canvas width before scaling (px). */
  designWidth: number
  /** Layout canvas height before scaling (px). */
  designHeight: number
}

export function ScaledPreviewViewport({
  screenWidth,
  designWidth,
  designHeight,
  children,
}: ScaledPreviewViewportProps) {
  const scale = screenWidth / designWidth
  const screenHeight = Math.round(designHeight * scale)

  return (
    <div
      className="overflow-hidden bg-black"
      style={{ width: screenWidth, height: screenHeight }}
    >
      <div
        className="origin-top-left"
        style={{
          width: designWidth,
          height: designHeight,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
