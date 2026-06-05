import type { CSSProperties, PropsWithChildren } from 'react'
import { ScaledPreviewViewport } from './ScaledPreviewViewport'

export interface LaptopMockupProps extends PropsWithChildren {
  screenWidth: number
  designWidth?: number
  designHeight?: number
  className?: string
  containerStyle?: CSSProperties
}

const FRAME = '#1c1c1e'
const BEZEL = '#3a3a3c'

export function LaptopMockup({
  screenWidth,
  designWidth = 1280,
  designHeight = 800,
  children,
  className = '',
  containerStyle,
}: LaptopMockupProps) {
  const lidWidth = screenWidth + 28

  return (
    <div
      className={`inline-flex flex-col items-center ${className}`}
      style={containerStyle}
    >
      <div
        className="rounded-t-2xl border border-[#3a3a3c] p-3.5 pb-4 shadow-2xl"
        style={{ width: lidWidth, backgroundColor: FRAME }}
      >
        <div className="mb-2.5 flex justify-center">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: BEZEL }}
          />
        </div>

        <ScaledPreviewViewport
          screenWidth={screenWidth}
          designWidth={designWidth}
          designHeight={designHeight}
        >
          {children}
        </ScaledPreviewViewport>
      </div>

      <div
        className="h-2 rounded-sm bg-gradient-to-b from-[#2a2a2c] to-[#1c1c1e]"
        style={{ width: lidWidth + 16 }}
      />

      <div
        className="relative rounded-b-2xl border border-t-0 border-[#3a3a3c] shadow-xl"
        style={{
          width: lidWidth + 36,
          height: 20,
          backgroundColor: FRAME,
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-1 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: `${BEZEL}99` }}
        />
      </div>
    </div>
  )
}
