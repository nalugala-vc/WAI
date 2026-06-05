import { useLottie } from 'lottie-react'
import { useMemo } from 'react'
import errorAnimation from '../../../assets/lotties/error.json'

interface ErrorLottieProps {
  size?: number
}

export function ErrorLottie({ size = 160 }: ErrorLottieProps) {
  const animationData = useMemo(() => structuredClone(errorAnimation), [])

  const options = useMemo(
    () => ({
      animationData,
      loop: true,
      autoplay: true,
      style: { width: size, height: size },
    }),
    [animationData, size],
  )

  const { View } = useLottie(options)
  return View
}
