"use client"

import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { useIsClient } from "usehooks-ts"
import { classNamesAndVariants } from "./classNamesAndVariants"

interface ToastsProps extends ComponentProps<"div"> {}

export function Toasts({ children, className, ...otherProps }: ToastsProps) {
  const isClient = useIsClient()

  if (!isClient) return null

  return (
    <div
      className={twMerge(classNamesAndVariants.toastsContainer, className)}
      {...otherProps}
    >
      <div className={classNamesAndVariants.gradientOverlay} />

      {children}
    </div>
  )
}
