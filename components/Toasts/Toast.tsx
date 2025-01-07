"use client"

import { Icon } from "@/components/Icon"
import { IconString } from "@/components/Icon/types"
import { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { classNamesAndVariants } from "./classNamesAndVariants"

interface ToastProps
  extends ComponentProps<"div">,
    Omit<ToastDescriptor, "message" | "variant" | "_id"> {
  icon?: IconString
  variant?: keyof (typeof classNamesAndVariants)["variants"]
}

export interface ToastDescriptor {
  _id?: string
  message: ReactNode
  variant: keyof (typeof classNamesAndVariants)["variants"]
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
  id,
  children,
  className,
  actionButtonPrimary,
  actionButtonSecondary,
  icon,
  variant = "info",
}: ToastProps) {
  return (
    <div
      className={twMerge(
        "js-toast",
        classNamesAndVariants.toastContainer,
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
        <div className={classNamesAndVariants.actionButtonsContainer}>
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
