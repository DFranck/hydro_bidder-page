'use client'

import { Icon } from '@/components/Icon'
import { IconString } from '@/components/Icon/types'
import { useDropdownMenu } from '@v2/hooks/useDropdownMenu'
import { ReactNode } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

export interface DropdownMenuItem {
  disabled?: boolean
  href?: string
  iconLeft?: IconString
  iconRight?: IconString
  label: ReactNode
  onClick?: () => void
  tooltip?: ReactNode
}

interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuItem[]
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
  interaction?: 'click' | 'hover' | 'both'
  modalOnMobile?: boolean
  className?: string
  classNameForMenu?: string
  classNameForItem?: string
  onOpenChange?: (open: boolean) => void
}

export function DropdownMenu({
  trigger,
  items,
  placement = 'bottom',
  interaction = 'click',
  modalOnMobile = true,
  className,
  classNameForMenu,
  classNameForItem,
  onOpenChange,
}: DropdownMenuProps) {
  const { isOpen, refs, getReferenceProps, renderMenu } = useDropdownMenu({
    placement,
    interaction,
    modalOnMobile,
    onOpenChange,
  })

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.disabled) return
    item.onClick?.()
  }

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={twMerge('inline-block', className)}
      >
        {trigger}
      </div>

      {renderMenu(
        <div
          className={twMerge(
            'bg-background border-palette-beige rounded-standard min-w-[200px] border py-2 shadow-lg',
            classNameForMenu,
          )}
        >
          {items.map((item, index) => (
            <button
              key={index}
              className={twJoin(
                'hover:bg-palette-beige/20 w-full px-4 py-2 text-left transition-colors',
                'flex items-center gap-2',
                item.disabled && 'cursor-not-allowed opacity-50',
                classNameForItem,
              )}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
            >
              {item.iconLeft && <Icon name={item.iconLeft} />}
              <span>{item.label}</span>
              {item.iconRight && <Icon name={item.iconRight} />}
            </button>
          ))}
        </div>,
      )}
    </>
  )
}
