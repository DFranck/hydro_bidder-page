'use client'

import { Icon } from '@/components/Icon'
import { useEffect, useState } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

interface ScrollIndicatorProps extends React.ComponentProps<'div'> {
  containerSelector: string
  targetSelector: string
  renderDot?: (props: {
    target: Element
    index: number
    isActive: boolean
    spreadProps: React.ComponentProps<'button'>
  }) => React.ReactNode
  renderDots?: (props: {
    dots: React.ReactNode[]
    onPrevious: () => void
    onNext: () => void
    canGoPrevious: boolean
    canGoNext: boolean
  }) => React.ReactNode
}

export function ScrollIndicator({
  containerSelector,
  targetSelector,
  className,
  renderDot,
  renderDots,
  ...otherProps
}: ScrollIndicatorProps) {
  const [targets, setTargets] = useState<Element[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = document.querySelector(containerSelector)

    if (!container) return

    const targets = Array.from(container.querySelectorAll(targetSelector))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = targets.findIndex((target) =>
              entry.target.isSameNode(target),
            )
            if (index !== -1) {
              setActiveIndex(index)
            }
          }
        })
      },
      {
        root: container,
        threshold: 0.8,
      },
    )

    targets.forEach((target) => {
      observer.observe(target)
    })

    setTargets(targets)

    return () => observer.disconnect()
  }, [containerSelector])

  const handlePrevious = () => {
    if (activeIndex > 0) {
      targets[activeIndex - 1]?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleNext = () => {
    if (activeIndex < targets.length - 1) {
      targets[activeIndex + 1]?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const dots = targets.map((target, index) => {
    const isActive = activeIndex === index
    const spreadProps = {
      'aria-label': `Go to tranche ${index + 1}`,
      onClick: () => {
        targets[index]?.scrollIntoView({ behavior: 'smooth' })
      },
    }

    if (renderDot) {
      return renderDot({
        target,
        index,
        isActive,
        spreadProps,
      })
    }

    return (
      <button
        {...spreadProps}
        key={index}
        className={twJoin(
          'group',
          'px-2 py-4',
          'transition-all',
          isActive ? 'scale-150' : 'group-hover:scale-125',
        )}
      >
        <Icon name="solid:circle" />
      </button>
    )
  })

  return (
    <div
      className={twMerge('flex items-center justify-center', className)}
      {...otherProps}
    >
      {renderDots?.({
        dots,
        onPrevious: handlePrevious,
        onNext: handleNext,
        canGoPrevious: activeIndex > 0,
        canGoNext: activeIndex < targets.length - 1,
      }) ?? dots}
    </div>
  )
}
