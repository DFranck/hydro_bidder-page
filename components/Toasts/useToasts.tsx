"use client"

import { CollapsibleBox } from "@/components/CollapsibleBox"
import { Toast, ToastDescriptor, Toasts } from "@/components/Toasts"
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { twJoin } from "tailwind-merge"
import { useIsClient } from "usehooks-ts"

export interface DismissibleToastDescriptor extends ToastDescriptor {
  isDismissible?: boolean
}

type ToastId = string

export const ToastContext = createContext<{
  toasts: ToastDescriptor[]
  addToast: (toast: DismissibleToastDescriptor) => ToastId
  setToast: (toast: DismissibleToastDescriptor) => ToastId
  addToasts: (newToasts: DismissibleToastDescriptor[]) => ToastId[]
  setToasts: (newToasts: DismissibleToastDescriptor[]) => ToastId[]
  dismissToastById: (toastId: ToastId) => void
}>({
  toasts: [],
  addToast: () => "",
  setToast: () => "",
  addToasts: () => [],
  setToasts: () => [],
  dismissToastById: () => {},
})

const dismissibleByDefault = ["info", "warning", "error", "success"]

export function ToastContextProvider({ children }: { children: ReactNode }) {
  const isClient = useIsClient()
  const [toasts, setInnerToasts] = useState<DismissibleToastDescriptor[]>([])
  const [collapsedToastIds, setCollapsedToastIds] = useState<ToastId[]>([])

  const removeToastById = useCallback((toastId: ToastId) => {
    setInnerToasts((prevToasts) =>
      prevToasts.filter((toast) => toast._id !== toastId)
    )
  }, [])

  const collapseToastsById = useCallback((toastIds: ToastId[]) => {
    setCollapsedToastIds((prevCollapsedToastIds) => [
      ...prevCollapsedToastIds,
      ...toastIds,
    ])
  }, [])

  const collapseToastById = useCallback(
    (toastId: ToastId) => {
      collapseToastsById([toastId])
    },
    [collapseToastsById]
  )

  const _createToast = useCallback(
    (toast: DismissibleToastDescriptor) => {
      const {
        _id,
        actionButtonPrimary,
        actionButtonSecondary,
        isDismissible,
        variant,
        ...rest
      } = toast
      const newToastId = _id ?? crypto.randomUUID()

      const isDismissibleByDefault = dismissibleByDefault.includes(variant)

      const dismissButton =
        isDismissible || (isDismissibleByDefault && isDismissible !== false)
          ? {
              label: "Dismiss",
              onClick: collapseToastById.bind(null, newToastId),
            }
          : undefined

      return {
        ...rest,
        _id: newToastId,
        actionButtonPrimary: actionButtonPrimary ?? dismissButton,
        actionButtonSecondary:
          actionButtonPrimary && !actionButtonSecondary
            ? dismissButton
            : actionButtonSecondary,
        variant,
      }
    },
    [collapseToastById, toasts]
  )

  /**
   * Adds new toasts to the list. If a toast has an _id, it will not be
   * recreated if it already exists.
   * @param newToasts - The toasts to add.
   * @returns An array of the IDs of the new toasts.
   */
  const addToasts = useCallback(
    (newToasts: DismissibleToastDescriptor[]) => {
      const allToastIds = toasts.map((toast) => toast._id)
      const newToastObjects = newToasts
        .filter((toast) => !toast._id || !allToastIds.includes(toast._id))
        .map(_createToast)
      setInnerToasts((prevToasts) => [...newToastObjects, ...prevToasts])
      return newToastObjects.map((toast) => toast._id) as ToastId[]
    },
    [_createToast, setInnerToasts, toasts]
  )

  /**
   * Adds a new toast to the list. If a toast has an _id, it will not be
   * recreated if it already exists.
   * @param toast - The toast to add.
   * @returns The ID of the new toast, or undefined if the toast already exists.
   */
  const addToast = useCallback(
    (newToast: DismissibleToastDescriptor) => {
      return addToasts([newToast])[0]
    },
    [addToasts]
  )

  /**
   * Replaces all currently showing toasts with a new set of toasts.
   * Unlike addToast which appends a single toast, this overwrites the entire toast list.
   * Each toast in the array will be processed through _createToast to ensure proper formatting.
   * @param newToasts - The new toasts to set.
   * @returns An array of the IDs of the new toasts.
   */
  const setToasts = useCallback(
    (newToasts: DismissibleToastDescriptor[]) => {
      const newToastObjects = newToasts.map(_createToast)
      setInnerToasts(newToastObjects)
      return newToastObjects.map((toast) => toast._id) as ToastId[]
    },
    [_createToast, setInnerToasts]
  )

  /**
   * Replaces all currently showing toasts with a new toast.
   * Unlike addToast which appends a single toast, this overwrites the entire toast list.
   * @param newToast - The toast to set.
   * @returns The ID of the new toast.
   */
  const setToast = useCallback(
    (newToast: DismissibleToastDescriptor) => {
      return setToasts([newToast])[0]
    },
    [setToasts]
  )

  const renderedToasts = useMemo(() => {
    if (!isClient) return null

    return (
      <Toasts>
        {toasts.map(({ _id, message, ...toast }) => {
          const isCollapsed = !!_id && collapsedToastIds.includes(_id)

          return (
            <CollapsibleBox
              className={twJoin(
                "nth-4:opacity-75",
                "nth-5:opacity-50",
                "nth-6:opacity-25",
                "nth-[n+7]:opacity-0"
              )}
              key={_id}
              isCollapsed={isCollapsed}
              onCollapseEnd={
                !!_id ? removeToastById.bind(null, _id) : undefined
              }
            >
              <Toast _id={_id} {...toast}>
                {message}
              </Toast>
            </CollapsibleBox>
          )
        })}
      </Toasts>
    )
  }, [isClient, toasts, collapsedToastIds, removeToastById])

  return isClient ? (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        setToast,
        addToasts,
        setToasts,
        dismissToastById: collapseToastById,
      }}
    >
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
