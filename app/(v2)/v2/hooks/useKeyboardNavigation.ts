import { useEffect } from 'react'

type Direction = 'horizontal' | 'vertical'

interface UseKeyboardNavigationOptions {
  selector: string
  direction?: Direction
  containerRef?: React.RefObject<HTMLElement | null>
  onNavigateToChild?: (currentElement: HTMLElement) => HTMLElement | null
  onNavigateToParent?: (currentElement: HTMLElement) => HTMLElement | null
  onNavigateToSibling?: (currentElement: HTMLElement, direction: 'next' | 'prev') => HTMLElement | null
  clickAfterFocus?: boolean
  disableWrapping?: boolean
  onEndReached?: (direction: 'up' | 'down') => void
}

export function useKeyboardNavigation({
  selector,
  direction = 'horizontal',
  containerRef,
  onNavigateToChild,
  onNavigateToParent,
  onNavigateToSibling,
  clickAfterFocus = false,
  disableWrapping = false,
  onEndReached,
}: UseKeyboardNavigationOptions) {
  // Add effect to focus first element on mount
  useEffect(() => {
    const container = containerRef?.current ?? document
    const elements = Array.from(
      container.querySelectorAll(selector),
    ) as HTMLElement[]

    if (elements.length && !document.activeElement?.id) {
      elements[0]?.focus()
      if (clickAfterFocus) {
        elements[0]?.click()
      }
    }
  }, [selector, containerRef, clickAfterFocus])

  useEffect(() => {
    function handleKeyUp(event: Event) {
      if (!(event instanceof KeyboardEvent)) return

      const container = containerRef?.current ?? document
      const elements = Array.from(
        container.querySelectorAll(selector),
      ) as HTMLElement[]

      if (!elements.length) return

      // Find the currently focused element within our container
      const currentIndex = elements.findIndex(
        (el) => el === document.activeElement || el.contains(document.activeElement),
      )

      const isHorizontal = direction === 'horizontal'
      const isNextKey = isHorizontal
        ? event.key === 'ArrowRight'
        : event.key === 'ArrowDown'
      const isPrevKey = isHorizontal
        ? event.key === 'ArrowLeft'
        : event.key === 'ArrowUp'

      // Handle navigation to child elements (only for horizontal navigation)
      if (isHorizontal && onNavigateToChild && event.key === 'ArrowDown') {
        event.preventDefault()
        const currentElement = document.activeElement as HTMLElement
        const childElement = onNavigateToChild(currentElement)
        if (childElement) {
          childElement.focus()
          if (clickAfterFocus) {
            childElement.click()
          }
          return
        }
      }

      // Handle navigation to parent elements (for both directions)
      if (onNavigateToParent && event.key === 'ArrowUp') {
        event.preventDefault()
        const currentElement = document.activeElement as HTMLElement
        const parentElement = onNavigateToParent(currentElement)
        if (parentElement) {
          parentElement.focus()
          if (clickAfterFocus) {
            parentElement.click()
          }
          return
        }
      }

      // Handle navigation to siblings
      if (onNavigateToSibling && (isNextKey || isPrevKey)) {
        event.preventDefault()
        const currentElement = document.activeElement as HTMLElement
        const siblingElement = onNavigateToSibling(
          currentElement,
          isNextKey ? 'next' : 'prev',
        )
        if (siblingElement) {
          siblingElement.focus()
          if (clickAfterFocus) {
            siblingElement.click()
          }
          return
        }
      }

      // Handle regular navigation
      if (isNextKey) {
        event.preventDefault()
        if (disableWrapping && currentIndex === elements.length - 1) {
          onEndReached?.('down')
          return
        }
        const nextIndex = (currentIndex + 1) % elements.length
        elements[nextIndex]?.focus()
        if (clickAfterFocus) {
          elements[nextIndex]?.click()
        }
      } else if (isPrevKey) {
        event.preventDefault()
        if (disableWrapping && currentIndex === 0) {
          onEndReached?.('up')
          return
        }
        const prevIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1
        elements[prevIndex]?.focus()
        if (clickAfterFocus) {
          elements[prevIndex]?.click()
        }
      }
    }

    const container = containerRef?.current ?? document
    container.addEventListener('keyup', handleKeyUp)

    return () => {
      container.removeEventListener('keyup', handleKeyUp)
    }
  }, [
    selector,
    direction,
    containerRef,
    onNavigateToChild,
    onNavigateToParent,
    onNavigateToSibling,
    clickAfterFocus,
    disableWrapping,
    onEndReached,
  ])
}
