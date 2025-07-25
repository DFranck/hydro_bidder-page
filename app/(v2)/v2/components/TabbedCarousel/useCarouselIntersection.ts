import { useEffect, useRef } from 'react'

interface UseCarouselIntersectionOptions {
  containerSelector: string
  targetSelector: string
  isEnabled: boolean
  onIndexChange: (newIndex: number) => void
  threshold?: number
  initialIndex?: number
  disableIntersectionObserver?: boolean
}

export function useCarouselIntersection({
  containerSelector,
  targetSelector,
  isEnabled,
  onIndexChange,
  threshold = 0.5,
  initialIndex,
  disableIntersectionObserver = false,
}: UseCarouselIntersectionOptions) {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (!isEnabled || disableIntersectionObserver) return

    const container = document.querySelector(containerSelector)
    if (!container) return

    // Scope the target selector to the container to prevent conflicts
    const targets = Array.from(container.querySelectorAll(targetSelector))
    if (targets.length === 0) return

    // Set initial index if provided
    if (
      initialIndex !== undefined &&
      initialIndex >= 0 &&
      initialIndex < targets.length
    ) {
      onIndexChange(initialIndex)

      // Scroll to the initial target
      const initialTarget = targets[initialIndex]
      if (initialTarget) {
        initialTarget.scrollIntoView({
          behavior: 'instant',
          block: 'nearest',
        })
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = targets.findIndex((target) =>
              entry.target.isSameNode(target),
            )
            if (index !== -1) {
              // Clear any existing timeout
              if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
              }

              // Simple debounce to prevent rapid firing
              debounceTimeoutRef.current = setTimeout(() => {
                onIndexChange(index)
              }, 50)
            }
          }
        })
      },
      {
        root: container,
        threshold,
      },
    )

    targets.forEach((target) => {
      observer.observe(target)
    })

    return () => {
      observer.disconnect()
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [
    containerSelector,
    targetSelector,
    isEnabled,
    onIndexChange,
    threshold,
    initialIndex,
    disableIntersectionObserver,
  ])
}
