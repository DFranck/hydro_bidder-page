"use client"

import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { useIsClient } from "usehooks-ts"
import { classNames } from "./classNames"
import { Toast } from "./Toast"

interface ToastsProps extends ComponentProps<"div"> {}

export function Toasts({ children, className, ...otherProps }: ToastsProps) {
  const isClient = useIsClient()

  if (!isClient) return null

  return (
    <div
      className={twMerge(classNames.toastsContainer, className)}
      {...otherProps}
    >
      <div className={classNames.gradientOverlay} />

      {children}
    </div>
  )
}

Toasts.Toast = Toast
