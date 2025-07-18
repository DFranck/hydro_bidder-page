'use client'

import {
  CarouselContainer,
  TabbedCarousel,
} from '@v2/components/TabbedCarousel'
import { Tranche } from '@v2/components/Tranche'
import { useTrancheCarousel } from '@v2/hooks/useTrancheCarousel'
import { useTrancheFocusManagement } from '@v2/hooks/useTrancheFocusManagement'
import { useTranchesSorted } from '@v2/hooks/useTranchesSorted'
import { ReactNode, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface TrancheTabbedCarouselProps {
  activeIndex?: number
  className?: string
  containerId: string
  disableIntersectionObserver?: boolean
  filterFunction?: (tranche: any) => boolean
  renderContent?: (props: { activeIndex: number }) => ReactNode
  slotOnRight?: ReactNode
  targetSelector: string
  threshold?: number
  onActiveIndexChange?: (previousIndex: number, newIndex: number) => void
  enableDefaultTrancheRendering?: boolean
}

export function TrancheTabbedCarousel({
  activeIndex,
  className,
  containerId,
  disableIntersectionObserver,
  filterFunction,
  renderContent,
  slotOnRight,
  targetSelector,
  threshold = 0.5,
  onActiveIndexChange,
  enableDefaultTrancheRendering = false,
}: TrancheTabbedCarouselProps) {
  const allTranchesSorted = useTranchesSorted()
  const containerRef = enableDefaultTrancheRendering
    ? useRef<HTMLDivElement>(null)
    : undefined

  const { tabs, activeTrancheIndex, handleActiveIndexChange } =
    useTrancheCarousel({
      filterFunction,
      onActiveIndexChange,
    })

  // Only use focus management for default rendering
  const { handleActiveTrancheChange } =
    enableDefaultTrancheRendering && containerRef
      ? useTrancheFocusManagement({
          containerRef,
          activeTrancheIndex: activeIndex ?? activeTrancheIndex,
          onActiveTrancheChange: onActiveIndexChange,
          targetSelector,
        })
      : { handleActiveTrancheChange: undefined }

  const finalActiveIndex = activeIndex ?? activeTrancheIndex
  const finalHandleActiveIndexChange =
    enableDefaultTrancheRendering && handleActiveTrancheChange
      ? handleActiveTrancheChange
      : activeIndex !== undefined
        ? onActiveIndexChange
        : handleActiveIndexChange

  // Default tranche rendering when enableDefaultTrancheRendering is true
  const renderDefaultTrancheContent = ({
    activeIndex,
  }: {
    activeIndex: number
  }) => (
    <CarouselContainer ref={containerRef} id={containerId}>
      {allTranchesSorted.map(({ id, sourceId }, index) => (
        <Tranche
          key={`${sourceId}-${id}`}
          sourceId={sourceId}
          trancheId={id}
          isActive={index === activeIndex}
          renderViewbox={({ className, children }) => (
            <div className={twMerge(className, 'relative h-full')}>
              {children}
            </div>
          )}
        />
      ))}
    </CarouselContainer>
  )

  // Ensure we always have a renderContent function
  const finalRenderContent =
    renderContent ||
    (enableDefaultTrancheRendering ? renderDefaultTrancheContent : () => null)

  return (
    <TabbedCarousel
      activeIndex={finalActiveIndex}
      className={className}
      classNameForContent="rounded-small"
      containerId={containerId}
      disableIntersectionObserver={disableIntersectionObserver}
      renderContent={finalRenderContent}
      slotOnRight={slotOnRight}
      tabs={tabs}
      targetSelector={targetSelector}
      threshold={threshold}
      onActiveIndexChange={finalHandleActiveIndexChange}
    />
  )
}
