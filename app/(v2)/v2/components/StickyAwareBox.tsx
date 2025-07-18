'use client'

import React, { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface StickyAwareBoxProps {
  children?: React.ReactNode
  className?: string
}

type StickyEdge = 'top' | 'bottom' | 'left' | 'right' | null

export function StickyAwareBox({ children, className }: StickyAwareBoxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [stickyEdge, setStickyEdge] = useState<StickyEdge>(null)
  const [containerTop, setContainerTop] = useState<number>(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const findScrollingContainer = (el: Element): Element | Window => {
      let parent = el.parentElement
      while (parent) {
        const style = window.getComputedStyle(parent)
        if (
          style.overflow === 'auto' ||
          style.overflow === 'scroll' ||
          style.overflowX === 'auto' ||
          style.overflowX === 'scroll' ||
          style.overflowY === 'auto' ||
          style.overflowY === 'scroll'
        ) {
          return parent
        }
        parent = parent.parentElement
      }
      return window
    }

    const scrollingContainer = findScrollingContainer(element)
    if (scrollingContainer !== window) {
      const containerRect = (
        scrollingContainer as Element
      ).getBoundingClientRect()
      setContainerTop(containerRect.top)
    } else {
      setContainerTop(0)
    }
  }, [])

  const checkStickyState = () => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const computedStyle = window.getComputedStyle(element)
    const position = computedStyle.position

    if (position === 'sticky') {
      const top = computedStyle.top
      const topValue = top !== 'auto' ? parseFloat(top) : 0

      const isStuck = rect.top <= containerTop + topValue

      setStickyEdge(isStuck ? 'top' : null)
    } else {
      setStickyEdge(null)
    }
  }

  const handleScroll = () => {
    checkStickyState()
  }

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const findScrollingContainer = (el: Element): Element | Window => {
      let parent = el.parentElement
      while (parent) {
        const style = window.getComputedStyle(parent)
        if (
          style.overflow === 'auto' ||
          style.overflow === 'scroll' ||
          style.overflowX === 'auto' ||
          style.overflowX === 'scroll' ||
          style.overflowY === 'auto' ||
          style.overflowY === 'scroll'
        ) {
          return parent
        }
        parent = parent.parentElement
      }
      return window
    }

    const scrollingContainer = findScrollingContainer(element)
    scrollingContainer.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    const resizeObserver = new ResizeObserver(() => {
      checkStickyState()
    })

    resizeObserver.observe(element)

    checkStickyState()

    return () => {
      resizeObserver.disconnect()
      scrollingContainer.removeEventListener('scroll', handleScroll)
    }
  }, [containerTop])

  return (
    <div
      ref={ref}
      data-sticky-edge={stickyEdge || undefined}
      data-is-stuck={!!stickyEdge || undefined}
      className={twMerge('sticky z-10', className)}
    >
      {children}
    </div>
  )
}
