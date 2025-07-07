'use client'

import { Icon } from '@/components/Icon'
import { useIsMobile } from '@/lib/useIsMobile'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { CarouselNavigationButton } from './CarouselComponents'
import { TabButton } from './TabButton'
import { useCarouselIntersection } from './useCarouselIntersection'

interface TabbedCarouselProps {
  // Content configuration
  containerId: string
  targetSelector: string
  threshold?: number

  // Tab configuration
  tabs: Array<{
    id: string
    label: string
    icon?: ReactNode
    disabled?: boolean
    dataProps?: Record<string, any>
  }>

  // Content rendering
  renderContent: (props: { activeIndex: number }) => ReactNode

  // Navigation configuration
  showNavigationButtons?: boolean
  navigationButtonClassName?: string

  // Layout configuration
  className?: string
  tabsClassName?: string
  contentClassName?: string

  // State management
  activeIndex?: number
  onActiveIndexChange?: (previousIndex: number, newIndex: number) => void

  // Mobile considerations
  isEnabled?: boolean

  // Additional slots
  slotOnRight?: ReactNode

  // Intersection observer control
  disableIntersectionObserver?: boolean
}

export function TabbedCarousel({
  containerId,
  targetSelector,
  threshold = 0.5,
  tabs,
  renderContent,
  showNavigationButtons = true,
  navigationButtonClassName,
  className,
  tabsClassName,
  contentClassName,
  activeIndex: controlledActiveIndex,
  onActiveIndexChange,
  isEnabled = true,
  slotOnRight,
  disableIntersectionObserver,
}: TabbedCarouselProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [targets, setTargets] = useState<Element[]>([])
  const [internalActiveIndex, setInternalActiveIndex] = useState(0)
  const isMobile = useIsMobile()
  const activeIndexRef = useRef(controlledActiveIndex ?? internalActiveIndex)

  const activeIndex = controlledActiveIndex ?? internalActiveIndex

  // Update ref when activeIndex changes
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Set up targets when component mounts or container changes
  useEffect(() => {
    const container = document.querySelector(`#${containerId}`)
    if (!container) return

    const targets = Array.from(container.querySelectorAll(targetSelector))
    setTargets(targets)
  }, [containerId, targetSelector])

  // Stabilize the onIndexChange callback to prevent infinite re-renders
  const handleIndexChange = useCallback(
    (newIndex: number) => {
      if (onActiveIndexChange) {
        onActiveIndexChange(activeIndexRef.current, newIndex)
      } else {
        setInternalActiveIndex(newIndex)
      }
    },
    [onActiveIndexChange], // Remove activeIndex from dependencies
  )

  // Use the reusable carousel intersection hook
  useCarouselIntersection({
    containerSelector: `#${containerId}`,
    targetSelector,
    isEnabled: isMounted && isEnabled && !(isMobile && false), // TODO: Add sidebar state if needed
    onIndexChange: handleIndexChange,
    threshold,
    initialIndex: controlledActiveIndex,
    disableIntersectionObserver,
  })

  const handleTabClick = (index: number) => {
    if (tabs[index]?.disabled) return

    // Navigate to the anchor URL - browser will handle smooth scrolling
    const targetTranche = targets[index]
    if (targetTranche && targetTranche.id) {
      window.location.hash = targetTranche.id
    }
  }

  const handlePrevious = () => {
    if (activeIndex > 0) {
      handleTabClick(activeIndex - 1)
    }
  }

  const handleNext = () => {
    if (activeIndex < targets.length - 1) {
      handleTabClick(activeIndex + 1)
    }
  }

  return (
    <div className={twMerge('flex h-full flex-col overflow-hidden', className)}>
      {/* Tab Navigation */}
      <div
        className={twMerge(
          'rounded-standard grid w-full grid-cols-[min-content_auto_min-content]',
          tabsClassName,
        )}
      >
        {/* Left navigation button */}
        {showNavigationButtons && (
          <CarouselNavigationButton
            id={`${containerId}-nav-previous`}
            className={navigationButtonClassName}
            disabled={!targets.length || activeIndex === 0}
            onClick={handlePrevious}
          >
            <Icon name="solid:chevron-left" />
          </CarouselNavigationButton>
        )}

        {/* Tabs in middle column */}
        <div className="overflow-x-auto scroll-smooth">
          <div className="gap-tight px-tight flex">
            {tabs.map((tab, index) => {
              const isActive = activeIndex === index
              // Shorten label for mobile (first 4 chars + ellipsis if longer)
              const shortLabel =
                tab.label.length > 4 ? tab.label.slice(0, 4) + '…' : tab.label

              return (
                <TabButton
                  data-is-active={isActive ? 'true' : undefined}
                  key={tab.id}
                  isActive={isActive}
                  disabled={tab.disabled}
                  shortLabel={shortLabel}
                  fullLabel={tab.label}
                  voteStatus={tab.dataProps?.['data-has-voted-within']}
                  icon={tab.icon}
                  onClick={() => handleTabClick(index)}
                  {...tab.dataProps}
                />
              )
            })}
          </div>
        </div>

        {/* Right navigation button and additional slot */}
        <div className="flex gap-1">
          {showNavigationButtons && (
            <CarouselNavigationButton
              id={`${containerId}-nav-next`}
              className={navigationButtonClassName}
              disabled={!targets.length || activeIndex === targets.length - 1}
              onClick={handleNext}
            >
              <Icon name="solid:chevron-right" />
            </CarouselNavigationButton>
          )}

          {slotOnRight}
        </div>
      </div>

      {/* Content */}
      <div
        className={twMerge('min-h-0 flex-1 overflow-hidden', contentClassName)}
      >
        {renderContent({ activeIndex })}
      </div>
    </div>
  )
}
