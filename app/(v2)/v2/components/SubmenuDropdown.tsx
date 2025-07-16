'use client'

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { ReactNode, useState } from 'react'
import { createPortal } from 'react-dom'
import { twJoin } from 'tailwind-merge'

interface SubmenuDropdownProps {
  trigger: ReactNode
  children: ReactNode
  className?: string
  classNameForMenu?: string
}

export function SubmenuDropdown({
  trigger,
  children,
  className,
  classNameForMenu,
}: SubmenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'right-start',
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'menu' })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ])

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={twJoin('relative', className)}
      >
        {trigger}
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={twJoin(
              'popover z-50 min-w-[200px] py-2',
              classNameForMenu,
            )}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  )
}
