"use client"

import { CollapsibleBox } from "@/components/CollapsibleBox"
import {
  ComponentProps,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"
import { useIsClient } from "usehooks-ts"
import { classNames } from "./classNames"
interface ToastsProps extends ComponentProps<"div"> {}

export interface Toast {
  variant: keyof (typeof classNames)["variants"]
  message: ReactNode
  isDismissible?: boolean
}

const ToastContext = createContext<{
  toasts: Toast[]
  setToasts: Dispatch<SetStateAction<Toast[]>>
}>({
  toasts: [],
  setToasts: () => {},
})

export function ToastContextProvider({ children }: { children: ReactNode }) {
  const isClient = useIsClient()
  const [toasts, setToasts] = useState<Toast[]>([])

  const ToastPrinter = useCallback(
    () => (
      <Toasts>
        {toasts.map((toast, index) => (
          <Toasts.Toast
            key={index}
            isDismissible={toast.isDismissible}
            variant={toast.variant}
          >
            {toast.message}
          </Toasts.Toast>
        ))}
      </Toasts>
    ),
    [toasts]
  )

  return isClient ? (
    <ToastContext.Provider value={{ toasts, setToasts }}>
      {children}
      {createPortal(<ToastPrinter />, document.body)}
    </ToastContext.Provider>
  ) : null
}

export function useToasts() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToasts must be used within a ToastContextProvider")
  }
  return context
}

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

Toasts.Toast = function Toast({
  children,
  className,
  isDismissible = true,
  variant = "info",
  ...otherProps
}: ComponentProps<"div"> & {
  isDismissible?: boolean
  variant?: keyof (typeof classNames)["variants"]
}) {
  const [isDismissed, setIsDismissed] = useState(false)

  function handleDismiss() {
    setIsDismissed(true)
  }

  return (
    <CollapsibleBox
      className="js-toast-container"
      isCollapsed={isDismissed}
      {...otherProps}
    >
      <div
        className={twMerge(
          classNames.toastContainer,
          !isDismissed && "js-toast",
          classNames.variants[variant].container,
          className
        )}
      >
        <div className={classNames.iconContainer}>
          {classNames.variants[variant].icon}
        </div>

        <div className={classNames.messageContainer}>{children}</div>

        {isDismissible && (
          <div className={classNames.dismissButtonContainer}>
            <button
              className={classNames.dismissButton}
              onClick={handleDismiss}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </CollapsibleBox>
  )
}
