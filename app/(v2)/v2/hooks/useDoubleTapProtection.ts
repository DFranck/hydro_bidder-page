'use client'

import { useCallback, useRef } from 'react'
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts'

/**
 * Hook that provides double-tap protection for touch devices.
 * On touch devices: first tap focuses the element, second tap executes the action.
 * On non-touch devices: executes the action immediately.
 *
 * @param handler - The function to execute on the second tap (touch) or immediately (non-touch)
 * @returns A click handler that implements the double-tap protection and a ref to attach to the target element
 */
export function useDoubleTapProtection(
  handler: (e: React.MouseEvent) => void | Promise<void>
) {
  const isTouchDevice = useMediaQuery('(pointer: coarse)')
  const tapCounterRef = useRef(0)
  const targetRef = useRef<HTMLElement>(null!)

  const resetCounter = useCallback(() => {
    tapCounterRef.current = 0
  }, [])

  // Reset counter and blur target when clicking outside
  useOnClickOutside(targetRef, () => {
    if (isTouchDevice && tapCounterRef.current > 0) {
      resetCounter()
      targetRef.current?.blur()
    }
  })

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      if (!isTouchDevice) {
        // On non-touch devices, execute immediately
        handler(e)
        return
      }

      // On touch devices, increment counter and check if we should execute
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
    [isTouchDevice, handler]
  )

  return { handleClick, resetCounter, ref: targetRef }
}
