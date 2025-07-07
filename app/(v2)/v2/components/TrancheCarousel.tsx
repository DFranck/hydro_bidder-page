'use client'

import { GradientOverlay } from '@v2/components/GradientOverlay'
import { CarouselContainer } from '@v2/components/TabbedCarousel'
import { Tranche } from '@v2/components/Tranche'
import { TrancheTabbedCarousel } from '@v2/components/TrancheTabbedCarousel'
import { useAdjacentTrancheThemeColors } from '@v2/hooks/useAdjacentThemeColors'
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
  showGradientOverlays?: boolean
  className?: string
  // For custom content rendering (like BidNavigation)
  renderCustomContent?: (props: { activeIndex: number }) => React.ReactNode
}

export function TrancheCarousel({
  onActiveTrancheChange,
  containerId = 'tranches-container',
  targetSelector = '[data-carousel-section="tranche"]',
  threshold = 0.8,
  showGradientOverlays = true,
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

  // Get all adjacent theme colors upfront to avoid calling hooks in callbacks
  const adjacentThemeColorsMap = allTranchesSorted.reduce(
    (acc, { id, sourceId }) => {
      acc[`${sourceId}-${id}`] = useAdjacentTrancheThemeColors(sourceId, id)
      return acc
    },
    {} as Record<string, ReturnType<typeof useAdjacentTrancheThemeColors>>,
  )

  // Default content renderer for TrancheBrowser
  const renderDefaultContent = ({ activeIndex }: { activeIndex: number }) => (
    <CarouselContainer ref={containerRef} id={containerId}>
      {allTranchesSorted.map(({ id, sourceId }, index) => {
        const hasTrancheToLeft = index > 0
        const hasTrancheToRight = index < allTranchesSorted.length - 1
        const adjacentThemeColors = adjacentThemeColorsMap[`${sourceId}-${id}`]

        return (
          <Tranche
            key={`${sourceId}-${id}`}
            sourceId={sourceId}
            trancheId={id}
            isActive={index === activeIndex}
            renderViewbox={({ className, children }) => (
              <div className={twMerge(className, 'relative h-full')}>
                {children}

                {showGradientOverlays && (
                  <>
                    <GradientOverlay
                      direction="down"
                      currentThemeColor="var(--color-palette-blue)"
                    />
                    {hasTrancheToLeft && (
                      <GradientOverlay
                        direction="left"
                        previousThemeColor={adjacentThemeColors.previous}
                      />
                    )}
                    {hasTrancheToRight && (
                      <GradientOverlay
                        direction="right"
                        nextThemeColor={adjacentThemeColors.next}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          />
        )
      })}
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
