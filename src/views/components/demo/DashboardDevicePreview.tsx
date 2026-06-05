import {
  AndroidMockup,
  IPhoneMockup,
  IPadMockup,
} from 'react-device-mockup'
import DashboardPage from '../../pages/DashboardPage'
import { LaptopMockup } from './LaptopMockup'
import { ScaledPreviewViewport } from './ScaledPreviewViewport'

export type DemoDevice = 'iphone' | 'android' | 'ipad' | 'laptop'

const FRAME_COLOR = '#1c1c1e'

/** iPad landscape aspect (4.3:3) — height matches mockup bezel. */
const IPAD_DESIGN_WIDTH = 1024
const IPAD_DESIGN_HEIGHT = Math.round((IPAD_DESIGN_WIDTH * 3) / 4.3)
const IPAD_SCREEN_WIDTH = 640

interface DashboardDevicePreviewProps {
  device: DemoDevice
}

function PreviewScreen({
  previewLayout,
}: {
  previewLayout: 'mobile' | 'desktop' | 'ipad' | 'laptop'
}) {
  if (previewLayout === 'laptop' || previewLayout === 'ipad') {
    return (
      <div className="h-full w-full bg-black">
        <DashboardPage embedded previewLayout={previewLayout} />
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-hidden bg-black">
      <DashboardPage embedded previewLayout={previewLayout} />
    </div>
  )
}

export function DashboardDevicePreview({ device }: DashboardDevicePreviewProps) {
  switch (device) {
    case 'iphone':
      return (
        <IPhoneMockup
          screenWidth={320}
          screenType="island"
          frameColor={FRAME_COLOR}
          hideStatusBar
          transparentNavBar
          hideNavBar
        >
          <PreviewScreen previewLayout="mobile" />
        </IPhoneMockup>
      )

    case 'android':
      return (
        <AndroidMockup
          screenWidth={320}
          frameColor={FRAME_COLOR}
          hideStatusBar
          transparentNavBar
          hideNavBar
        >
          <PreviewScreen previewLayout="mobile" />
        </AndroidMockup>
      )

    case 'ipad':
      return (
        <IPadMockup
          screenWidth={IPAD_SCREEN_WIDTH}
          screenType="modern"
          isLandscape
          frameColor={FRAME_COLOR}
          hideStatusBar
          transparentNavBar
          hideNavBar
        >
          <ScaledPreviewViewport
            screenWidth={IPAD_SCREEN_WIDTH}
            designWidth={IPAD_DESIGN_WIDTH}
            designHeight={IPAD_DESIGN_HEIGHT}
          >
            <PreviewScreen previewLayout="ipad" />
          </ScaledPreviewViewport>
        </IPadMockup>
      )

    case 'laptop':
      return (
        <LaptopMockup
          screenWidth={1024}
          designWidth={1280}
          designHeight={800}
        >
          <PreviewScreen previewLayout="laptop" />
        </LaptopMockup>
      )
  }
}
