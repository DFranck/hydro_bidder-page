'use client'

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { ComponentProps, ReactNode, useState } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'
import { useIsClient } from 'usehooks-ts'

export function Tooltipped({
  children,
  className,
  classNamesForTooltip,
  tip,
  mouseEnterDelay = 350,
  mouseLeaveDelay = 350,
}: ComponentProps<'div'> & {
  classNamesForTooltip?: string
  tip: ReactNode
  mouseEnterDelay?: number
  mouseLeaveDelay?: number
}) {
  const isClient = useIsClient()
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom',
    middleware: [
      offset(8),
      flip({
        mainAxis: false, // Don't flip vertically (stay at bottom)
        crossAxis: true, // Only flip horizontally when needed
      }),
      shift({
        padding: 8,
      }),
      size({
        apply({ availableWidth, elements }) {
          // Set max-width to 14rem (equivalent to w-56) but allow content to be narrower
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.min(224, availableWidth)}px`, // 224px = 14rem = w-56
            width: 'max-content',
          })
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const hover = useHover(context, {
    delay: {
      open: mouseEnterDelay,
      close: mouseLeaveDelay,
    },
  })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ])

  if (!isClient) return null

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={twMerge(
          'group/tooltip relative z-10 inline-block w-min cursor-default',
          className,
        )}
        tabIndex={0}
      >
        {children}
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={twMerge(
              isPositioned ? 'opacity-100' : 'opacity-0',
              `
                border-palette-beige
                bg-background
                pointer-events-auto
                z-50
                rounded-sm
                border
                p-2
                text-sm
                font-normal
                whitespace-normal
                text-white
                shadow-2xl
                transition-opacity
                duration-200
              `,
              classNamesForTooltip,
            )}
          >
            {tip}
          </div>,
          document.body,
        )}
    </>
  )
}
