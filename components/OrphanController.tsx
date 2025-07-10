'use client'

import { ComponentProps, useEffect, useRef } from 'react'
import { useIsClient, useMediaQuery } from 'usehooks-ts'

const NonBreakingSpace = String.fromCharCode(160)

export function OrphanController({
  children,
  disabledInPortrait = true,
  ...otherProps
}: ComponentProps<'div'> & {
  disabledInPortrait?: boolean
}) {
  const isClient = useIsClient()
  const isPortrait =
    useMediaQuery('(orientation: portrait)') && isClient && disabledInPortrait
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = innerRef.current

    if (!element) return

    const containsNonBreakingSpace = element.innerHTML.includes('&nbsp;')

    if (isPortrait || containsNonBreakingSpace) {
      if (isPortrait) {
        element.innerHTML = element.innerHTML.replaceAll('&nbsp;', ' ')
      }
      return
    }

    const words = element.innerHTML.split(' ')

    if (words.length < 2) {
      return
    }

    const allWordsExceptLast = words.slice(0, words.length - 1).join(' ')
    const lastWord = words.slice(-1)

    element.innerHTML = `${allWordsExceptLast}${NonBreakingSpace}${lastWord}`
  }, [children, disabledInPortrait, isPortrait])

  return (
    <div
      ref={innerRef}
      {...otherProps}
    >
      {children}
    </div>
  )
}
