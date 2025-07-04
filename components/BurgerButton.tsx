"use client"

import { Icon } from "@/components/Icon"
import { HTMLAttributes } from "react"

type BurgerButtonProps = {
  isOpen: boolean
  onClick: () => void
} & HTMLAttributes<HTMLButtonElement>

export const BurgerButton = ({
  isOpen,
  onClick,
  className,
  ...props
}: BurgerButtonProps) => {
  return (
    <button onClick={onClick} className="active:animate-spin md:hidden">
      {isOpen ? (
        <Icon name="solid:xmark" />
      ) : (
        <Icon name="light:ellipsis-vertical" />
      )}
    </button>
  )
}
