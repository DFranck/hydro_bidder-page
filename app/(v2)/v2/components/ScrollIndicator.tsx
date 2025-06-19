'use client'

import { Icon } from '@/components/Icon'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useEffect, useState } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

interface ScrollIndicatorProps
  extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  containerSelector: string
  targetSelector: string
  disabled?: boolean
  onChange?: (previousIndex: number, newIndex: number) => void
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
  disabled = false,
  onChange,
  renderDot,
  renderDots,
  ...otherProps
}: ScrollIndicatorProps) {
  const [targets, setTargets] = useState<Element[]>([])
  const { state } = useAppState()

  useEffect(() => {
    const container = document.querySelector(containerSelector)

    if (!container || disabled) return

    const targets = Array.from(container.querySelectorAll(targetSelector))
    setTargets(targets)

    // Check if container is visible
    const containerStyle = window.getComputedStyle(container)
    const isContainerVisible =
      containerStyle.display !== 'none' &&
      containerStyle.visibility !== 'hidden' &&
      containerStyle.opacity !== '0'

    if (!isContainerVisible) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = targets.findIndex((target) =>
              entry.target.isSameNode(target),
            )
            // Only call onChange if the index is different from current state
            if (index !== -1 && index !== state.activeTrancheIndex) {
              onChange?.(state.activeTrancheIndex, index)
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

    return () => observer.disconnect()
  }, [containerSelector, state.activeTrancheIndex, disabled, onChange])

  const handlePrevious = () => {
    if (state.activeTrancheIndex > 0) {
      targets[state.activeTrancheIndex - 1]?.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  const handleNext = () => {
    if (state.activeTrancheIndex < targets.length - 1) {
      targets[state.activeTrancheIndex + 1]?.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  const dots = targets.map((target, index) => {
    const isActive = state.activeTrancheIndex === index
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
        canGoPrevious: state.activeTrancheIndex > 0,
        canGoNext: state.activeTrancheIndex < targets.length - 1,
      }) ?? dots}
    </div>
  )
}
