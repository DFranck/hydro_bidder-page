import { useEffect, useRef } from 'react'

interface UseClickOutsideOptions {
  enabled?: boolean
}

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  options: UseClickOutsideOptions = {}
) {
  const { enabled = true } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!enabled) return

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current
      console.log('Click outside check:', {
        element: el,
        target: event.target,
        contains: el?.contains((event?.target as Node) || null)
      })

      if (!el || el.contains((event?.target as Node) || null)) {
        console.log('Click was inside element, not calling handler')
        return
      }

      console.log('Click was outside element, calling handler')
      handler()
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [handler, enabled])

  return ref
}
