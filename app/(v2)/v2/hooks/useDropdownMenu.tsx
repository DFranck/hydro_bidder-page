import { useIsMobile } from '@/lib/useIsMobile'
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { ReactNode, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { twJoin, twMerge } from 'tailwind-merge'

interface UseDropdownMenuOptions {
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end'
  offset?: number
  interaction?: 'click' | 'hover' | 'both'
  modalOnMobile?: boolean
  onOpenChange?: (open: boolean) => void
}

export function useDropdownMenu({
  placement = 'bottom',
  offset: offsetValue = 8,
  interaction = 'click',
  modalOnMobile = true,
  onOpenChange,
}: UseDropdownMenuOptions = {}) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      setIsOpen(open)
      onOpenChange?.(open)
    },
    placement,
    middleware: [offset(offsetValue), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  // Always call hooks to maintain consistent order
  const clickInteraction = useClick(context, {
    enabled: interaction === 'click' || interaction === 'both',
  })
  const hoverInteraction = useHover(context, {
    enabled: interaction === 'hover' || interaction === 'both',
    delay: {
      open: 200,
      close: 300,
    },
  })
  const dismissInteraction = useDismiss(context, {
    enabled: true, // Always enable dismiss for outside clicks and escape key
    outsidePress: true, // Close when clicking outside
    outsidePressEvent: 'pointerdown', // Use pointerdown for better mobile support
  })
  const roleInteraction = useRole(context, { role: 'menu' })

  const interactions = []

  if (interaction === 'click' || interaction === 'both') {
    interactions.push(clickInteraction)
  }

  if (interaction === 'hover' || interaction === 'both') {
    interactions.push(hoverInteraction)
  }

  interactions.push(dismissInteraction, roleInteraction)

  const { getReferenceProps, getFloatingProps } = useInteractions(interactions)

  const renderMenu = useCallback(
    (
      children: ReactNode,
      className?: string,
      onClick?: (e: React.MouseEvent) => void,
    ): ReactNode => {
      if (!isOpen) return null

      if (isMobile && modalOnMobile) {
        return createPortal(
          <div
            className={twJoin(
              'fixed',
              'inset-0',
              'z-50',
              'flex',
              'items-center',
              'justify-center',
            )}
            style={{
              transform: 'none',
            }}
            {...getFloatingProps()}
            onClick={onClick}
          >
            {children}
          </div>,
          document.body,
        )
      }

      return createPortal(
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className={twMerge('z-50', className)}
        >
          {children}
        </div>,
        document.body,
      )
    },
    [
      isOpen,
      isMobile,
      modalOnMobile,
      refs.setFloating,
      floatingStyles,
      getFloatingProps,
    ],
  )

  return {
    isOpen,
    setIsOpen,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    renderMenu,
    isMobile,
  }
}
