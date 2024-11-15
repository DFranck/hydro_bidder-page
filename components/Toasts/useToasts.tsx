"use client"

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { useIsClient } from "usehooks-ts"
import { classNames } from "./classNames"
import { Toasts } from "./Toasts"

export interface Toast {
  _id?: string
  variant: keyof (typeof classNames)["variants"]
  message: ReactNode
  isDismissible?: boolean
}

export const ToastContext = createContext<{
  toasts: Toast[]
  setToasts: Dispatch<SetStateAction<Toast[]>>
}>({
  toasts: [],
  setToasts: () => {},
})

export function ToastContextProvider({ children }: { children: ReactNode }) {
  const isClient = useIsClient()
  const [toasts, setInnerToasts] = useState<Toast[]>([])

  function setToasts(newToasts: Toast[] | ((prevToasts: Toast[]) => Toast[])) {
    let newToastsWithIds: Toast[]

    if (typeof newToasts === "function") {
      newToastsWithIds = newToasts(toasts).map((toast) => ({
        ...toast,
        _id: toast._id ?? crypto.randomUUID(),
      }))
    } else {
      newToastsWithIds = newToasts.map((toast) => ({
        ...toast,
        _id: toast._id ?? crypto.randomUUID(),
      }))
    }

    setInnerToasts(newToastsWithIds)
  }

  return isClient ? (
    <ToastContext.Provider value={{ toasts, setToasts }}>
      {children}
      {createPortal(
        <Toasts>
          {toasts.map((toast) => (
            <Toasts.Toast
              id={toast._id}
              key={toast._id}
              isDismissible={toast.isDismissible}
              variant={toast.variant}
            >
              {toast.message}
            </Toasts.Toast>
          ))}
        </Toasts>,
        document.body
      )}
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
