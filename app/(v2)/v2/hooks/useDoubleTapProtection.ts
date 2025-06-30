'use client'

import { useIsMobile } from '@/lib/useIsMobile'
import { useCallback, useRef } from 'react'

/**
 * Hook that provides double-tap protection for mobile devices.
 * On mobile: first tap focuses the element, second tap executes the action.
 * On desktop: executes the action immediately.
 *
 * @param handler - The function to execute on the second tap (mobile) or immediately (desktop)
 * @returns A click handler that implements the double-tap protection
 */
export function useDoubleTapProtection(
  handler: (e: React.MouseEvent) => void | Promise<void>
) {
  const isMobile = useIsMobile()
  const tapCounterRef = useRef(0)

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      if (!isMobile) {
        // On desktop, execute immediately
        handler(e)
        return
      }

      // On mobile, increment counter and check if we should execute
      tapCounterRef.current += 1

      if (tapCounterRef.current === 1) {
        // First tap - just focus the element
        const target = e.currentTarget as HTMLElement
        target.focus()
        e.stopPropagation()
        return
      }

      // Second tap - execute the action and reset counter
      tapCounterRef.current = 0
      handler(e)
    },
    [isMobile, handler]
  )

  const resetCounter = useCallback(() => {
    tapCounterRef.current = 0
  }, [])

  return { handleClick, resetCounter }
}
