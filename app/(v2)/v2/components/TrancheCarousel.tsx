'use client'

import { CarouselContainer } from '@v2/components/TabbedCarousel'
import { Tranche } from '@v2/components/Tranche'
import { TrancheTabbedCarousel } from '@v2/components/TrancheTabbedCarousel'
import { useTrancheFocusManagement } from '@v2/hooks/useTrancheFocusManagement'
import { useTranchesSorted } from '@v2/hooks/useTranchesSorted'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface TrancheCarouselProps {
  onActiveTrancheChange?: (previousIndex: number, newIndex: number) => void
  // New props for flexibility
  containerId?: string
  targetSelector?: string
  threshold?: number
  className?: string
  // For custom content rendering (like BidNavigation)
  renderCustomContent?: (props: { activeIndex: number }) => React.ReactNode
}

export function TrancheCarousel({
  onActiveTrancheChange,
  containerId = 'tranches-container',
  targetSelector = '[data-carousel-section="tranche"]',
  threshold = 0.8,
  className,
  renderCustomContent,
}: TrancheCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const allTranchesSorted = useTranchesSorted()

  const { handleActiveTrancheChange } = useTrancheFocusManagement({
    containerRef,
    activeTrancheIndex: 0, // This will be managed by TrancheTabbedCarousel
    onActiveTrancheChange,
    targetSelector,
  })

  const renderDefaultContent = ({ activeIndex }: { activeIndex: number }) => (
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

  return (
    <TrancheTabbedCarousel
      containerId={containerId}
      targetSelector={targetSelector}
      threshold={threshold}
      className={className}
      onActiveIndexChange={handleActiveTrancheChange}
      renderContent={renderCustomContent || renderDefaultContent}
    />
  )
}
