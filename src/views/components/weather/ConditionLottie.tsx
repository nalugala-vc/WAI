import { useLottie } from 'lottie-react'
import { useMemo } from 'react'
import { getConditionIcon } from '../../../utils/conditionIcon'
import { TablerIcon } from '../common/TablerIcon'

interface ConditionLottieProps {
  animationData: object
  condition: string
}

export function ConditionLottie({
  animationData,
  condition,
}: ConditionLottieProps) {
  const options = useMemo(
    () => ({
      animationData,
      loop: true,
      autoplay: true,
      style: { width: 120, height: 120 },
    }),
    [animationData],
  )

  const { View } = useLottie(options)

  if (!View) {
    return (
      <TablerIcon
        name={getConditionIcon(condition)}
        className="text-[7.5rem] leading-none text-amber-300"
      />
    )
  }

  return View
}
