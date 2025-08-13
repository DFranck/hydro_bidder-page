import { toastMessages } from "@/components/ToastMessages"
import { DismissibleToastDescriptor } from "@/components/Toasts/useToasts"

export type ToastKey = keyof typeof toastMessages

type ToastMessageFunction = (...args: any[]) => DismissibleToastDescriptor

export function getActionToast(
  key: ToastKey,
  ...args: unknown[]
): DismissibleToastDescriptor {
  const toast = toastMessages[key] as
    | ToastMessageFunction
    | DismissibleToastDescriptor

  if (!toast) {
    throw new Error(`Unknown toast key "${key}"`)
  }

  if (typeof toast === "function") {
    return (toast as ToastMessageFunction)(...args)
  }

  return toast
}
