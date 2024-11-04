"use client"

import { CollapsibleBox } from "@/components/CollapsibleBox"
import { Icon } from "@/components/Icon"
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

interface ToastsProps extends ComponentProps<"div"> {}

export interface Toast {
  variant: keyof typeof classNamesByVariant
  message: ReactNode
}

const classNamesByVariant = {
  error: {
    container: "bg-palette-red",
    icon: <Icon name="regular:circle-exclamation" />,
  },
  success: {
    container: "bg-palette-green",
    icon: <Icon name="regular:circle-check" />,
  },
  info: {
    container: "bg-palette-blue",
    icon: <Icon name="regular:circle-info" />,
  },
  working: {
    container: "bg-palette-beige",
    icon: (
      <div className="inline-flex animate-spin">
        <Icon name="regular:loader" />
      </div>
    ),
  },
} satisfies Record<string, { container: string; icon: ReactNode }>

const ToastContext = createContext<{
  toasts: Toast[]
  setToasts: Dispatch<SetStateAction<Toast[]>>
}>({
  toasts: [],
  setToasts: () => {},
})

export function ToastContextProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const ToastPrinter = useCallback(
    () => (
      <Toasts>
        {toasts.map((toast, index) => (
          <Toasts.Toast key={index} variant={toast.variant}>
            {toast.message}
          </Toasts.Toast>
        ))}
      </Toasts>
    ),
    [toasts]
  )

  return (
    <ToastContext.Provider value={{ toasts, setToasts }}>
      {children}
      {createPortal(<ToastPrinter />, document.body)}
    </ToastContext.Provider>
  )
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
      className={twMerge(
        `
          group
          fixed
          bottom-6
          right-6
          top-6
          z-50
          flex
          w-96
          flex-col-reverse
          items-end
          transition-opacity
          [&:not(:has(.js-toast))]:pointer-events-none
          [&:not(:has(.js-toast))]:opacity-0
        `,
        className
      )}
      {...otherProps}
    >
      <div
        className="
          from-accent-brand-500
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          -z-10
          h-1/3
          bg-gradient-to-tl
          via-transparent
          to-transparent
        "
      />

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
  variant?: keyof typeof classNamesByVariant
}) {
  const [isDismissed, setIsDismissed] = useState(false)

  function handleDismiss() {
    setIsDismissed(true)
  }

  return (
    <CollapsibleBox isCollapsed={isDismissed} {...otherProps}>
      <div
        className={twMerge(
          `
            mt-3
            grid
            grid-cols-[min-content,auto,min-content]
            grid-rows-2
            items-center
            rounded-md
            border-2
            border-white/20
            text-white
          `,
          !isDismissed && "js-toast",
          classNamesByVariant[variant].container,
          className
        )}
      >
        <div
          className="
            row-span-2
            flex
            h-full
            flex-col
            p-3
            pr-0
            text-2xl
          "
        >
          {classNamesByVariant[variant].icon}
        </div>

        <div
          className="
            row-span-2
            p-3
          "
        >
          {children}
        </div>

        {isDismissible && (
          <div
            className="
              row-span-2
              grid
              grid-rows-subgrid
              overflow-hidden
              rounded-r-md
              border-l-2
              border-white/20
            "
          >
            <button
              className="
                row-span-2
                px-3
                bg-blend-overlay
                hover:bg-black/10
              "
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
