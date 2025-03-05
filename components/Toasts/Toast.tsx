"use client"

import { Icon } from "@/components/Icon"
import { IconString } from "@/components/Icon/types"
import { useToasts } from "@/components/Toasts/useToasts"
import { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { classNamesAndVariants } from "./classNamesAndVariants"

export type ToastVariant = keyof (typeof classNamesAndVariants)["variants"]

interface ToastProps
  extends ComponentProps<"div">,
    Omit<ToastDescriptor, "message" | "variant"> {
  icon?: IconString
  variant?: ToastVariant
}

export interface ToastDescriptor {
  _id?: string
  message: ReactNode
  variant: ToastVariant
  actionButtonPrimary?: {
    label: ReactNode
    onClick: () => void
  }
  actionButtonSecondary?: {
    label: ReactNode
    onClick: () => void
  }
}

export function Toast({
  _id,
  children,
  className,
  actionButtonPrimary,
  actionButtonSecondary,
  icon,
  variant = "info",
}: ToastProps) {
  const { dismissToastById } = useToasts()

  return (
    <div
      id={`toast-${_id}`}
      className={twMerge(
        "js-toast",
        "grid grid-rows-2 items-center",
        "grid-cols-[min-content,auto,min-content]",
        "rounded-md text-xs text-white backdrop-blur-md",
        classNamesAndVariants.variants[variant].container,
        className
      )}
    >
      <div className={classNamesAndVariants.iconContainer}>
        {icon ? (
          <Icon name={icon} variant="light" />
        ) : (
          classNamesAndVariants.variants[variant].icon
        )}
      </div>

      {children && (
        <div className={classNamesAndVariants.messageContainer}>{children}</div>
      )}

      {(actionButtonPrimary || actionButtonSecondary) && (
        <div
          className={classNamesAndVariants.actionButtonsContainer}
          onClick={dismissToastById.bind(null, _id!)}
        >
          {actionButtonPrimary && (
            <button
              className={classNamesAndVariants.actionButton}
              onClick={actionButtonPrimary.onClick}
            >
              {actionButtonPrimary.label}
            </button>
          )}
          {actionButtonSecondary && (
            <button
              className={classNamesAndVariants.actionButton}
              onClick={actionButtonSecondary.onClick}
            >
              {actionButtonSecondary.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
