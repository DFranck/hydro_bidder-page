'use client'

import {
  autoUpdate,
  flip,
  offset,
  shift,
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

export function Tooltip({
  children,
  className,
  classNamesForTooltip,
  tipContents,
  mouseEnterDelay = 350,
  mouseLeaveDelay = 350,
}: ComponentProps<'div'> & {
  classNamesForTooltip?: string
  tipContents: ReactNode
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
        fallbackAxisSideDirection: 'start',
      }),
      shift({
        padding: 8,
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
                w-56
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
            {tipContents}
          </div>,
          document.body,
        )}
    </>
  )
}
