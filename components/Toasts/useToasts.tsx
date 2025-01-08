"use client"

import { CollapsibleBox } from "@/components/CollapsibleBox"
import { Toast, ToastDescriptor } from "@/components/Toasts"
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
import { Toasts } from "./Toasts"

export interface DismissibleToastDescriptor extends ToastDescriptor {
  isDismissible?: boolean
}

export const ToastContext = createContext<{
  toasts: ToastDescriptor[]
  setToasts: Dispatch<SetStateAction<DismissibleToastDescriptor[]>>
}>({
  toasts: [],
  setToasts: () => {},
})

export function ToastContextProvider({ children }: { children: ReactNode }) {
  const isClient = useIsClient()
  const [toasts, setInnerToasts] = useState<ToastDescriptor[]>([])
  const [collapsedToastIds, setCollapsedToastIds] = useState<string[]>([])

  function setToasts(
    newToasts:
      | DismissibleToastDescriptor[]
      | ((prevToasts: ToastDescriptor[]) => DismissibleToastDescriptor[])
  ) {
    setInnerToasts((currentToasts) => {
      const actualNewToasts =
        typeof newToasts === "function" ? newToasts(currentToasts) : newToasts

      let newToastsWithIdsAndDismissButtons: ToastDescriptor[]

      newToastsWithIdsAndDismissButtons = actualNewToasts.map(
        ({ isDismissible, ...toast }) => {
          const isNewToast = !toast._id

          const toastId = isNewToast ? crypto.randomUUID() : toast._id!

          const isDismissibleByDefault = [
            "info",
            "warning",
            "error",
            "success",
          ].includes(toast.variant)

          const dismissButton =
            isNewToast &&
            (isDismissible ||
              (isDismissibleByDefault && isDismissible !== false))
              ? {
                  label: "Dismiss",
                  onClick: collapseToastById.bind(null, toastId),
                }
              : undefined

          return {
            ...toast,
            _id: toastId,
            actionButtonPrimary: toast.actionButtonPrimary ?? dismissButton,
            actionButtonSecondary:
              toast.actionButtonPrimary && !toast.actionButtonSecondary
                ? dismissButton
                : toast.actionButtonSecondary,
          }
        }
      )

      return newToastsWithIdsAndDismissButtons
    })
  }

  function dismissToastById(toastId: string) {
    setInnerToasts((prevToasts) =>
      prevToasts.filter((toast) => toast._id !== toastId)
    )
  }

  function collapseToastById(toastId: string) {
    setCollapsedToastIds((prevCollapsedToastIds) => [
      ...prevCollapsedToastIds,
      toastId,
    ])
  }

  const renderedToasts = (
    <Toasts>
      {toasts.map(({ _id, message, ...toast }) => {
        const isCollapsed = !!_id && collapsedToastIds.includes(_id)

        return (
          <CollapsibleBox
            key={_id}
            isCollapsed={isCollapsed}
            onCollapseEnd={!!_id ? dismissToastById.bind(null, _id) : undefined}
          >
            <Toast id={_id} {...toast}>
              {message}
            </Toast>
          </CollapsibleBox>
        )
      })}
    </Toasts>
  )

  return isClient ? (
    <ToastContext.Provider value={{ toasts, setToasts }}>
      {children}
      {createPortal(renderedToasts, document.body)}
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
