'use client'

import { TabbedCarousel } from '@v2/components/TabbedCarousel'
import { useTrancheCarousel } from '@v2/hooks/useTrancheCarousel'
import { ReactNode } from 'react'

interface TrancheTabbedCarouselProps {
  containerId: string
  targetSelector: string
  threshold?: number
  className?: string
  slotOnRight?: ReactNode
  renderContent: (props: { activeIndex: number }) => ReactNode
  filterFunction?: (tranche: any) => boolean
  onActiveIndexChange?: (previousIndex: number, newIndex: number) => void
  activeIndex?: number
  disableIntersectionObserver?: boolean
}

export function TrancheTabbedCarousel({
  containerId,
  targetSelector,
  threshold = 0.5,
  className,
  slotOnRight,
  renderContent,
  filterFunction,
  onActiveIndexChange,
  activeIndex,
  disableIntersectionObserver,
}: TrancheTabbedCarouselProps) {
  const { tabs, activeTrancheIndex, handleActiveIndexChange } =
    useTrancheCarousel({
      filterFunction,
      onActiveIndexChange,
    })

  const finalActiveIndex = activeIndex ?? activeTrancheIndex
  const finalHandleActiveIndexChange =
    activeIndex !== undefined ? onActiveIndexChange : handleActiveIndexChange

  return (
    <TabbedCarousel
      containerId={containerId}
      targetSelector={targetSelector}
      threshold={threshold}
      tabs={tabs}
      activeIndex={finalActiveIndex}
      onActiveIndexChange={finalHandleActiveIndexChange}
      className={className}
      slotOnRight={slotOnRight}
      renderContent={renderContent}
      disableIntersectionObserver={disableIntersectionObserver}
    />
  )
}