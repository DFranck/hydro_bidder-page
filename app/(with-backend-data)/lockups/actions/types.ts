import { StyledTextVariant } from "@/components/StyledText"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { lockupActionConfigs } from "./configs/lockupActionConfigs"

// Discriminant: all action names
export type LockupActionType = keyof typeof lockupActionConfigs

// Infer payload type for a given action
export type LockupActionPayloadFor<T extends LockupActionType> =
  (typeof lockupActionConfigs)[T] extends ActionConfig<infer P, any> ? P : never

// Infer lockup type for a given action
export type LockupTypeForAction<T extends LockupActionType> =
  (typeof lockupActionConfigs)[T] extends ActionConfig<any, infer L> ? L : never

// Generic props for any action form component
export type LockupActionFormProps<T extends LockupActionType> =
  ActionComponentProps<LockupActionPayloadFor<T>, LockupTypeForAction<T>>

export type ActionComponentProps<P, L> = {
  className?: string
  variant?: StyledTextVariant
  lockup: L
  config: ActionConfig<P, L>
  payload: P
  onChange: (values: Partial<P>) => void
  onClose: () => void
  onConfirm: (payload: P) => void | Promise<void>
  isFormValid: boolean
  isProcessing: boolean
  [key: string]: unknown
}

// Standard shape for any action config (payload P, lockup L)
export interface ActionConfig<P, L, R = void> {
  triggerLabel: string | React.ReactNode | ((lockup?: L) => React.ReactNode)
  submitLabel:
    | string
    | React.ReactNode
    | ((args: { lockup?: L; payload?: P }) => React.ReactNode)
  modalTitle: string | ((lockup?: L) => React.ReactNode)
  FormComponent: React.FC<ActionComponentProps<P, L>>
  tooltips?: {
    disabled?: string | ((lockup?: L, payload?: P) => string | undefined)
    confirm?: string | ((lockup?: L, payload?: P) => string | undefined)
  }
  toasts: {
    processing: string
    success: string
    error: string
  }
  getInitialPayload?: (lockup: L) => P
  isDisabled: (lockup?: L) => boolean
  isValid: (payload: P) => boolean
  execute: (args: {
    address: string
    getSigningClient: () => Promise<SigningCosmWasmClient>
    lockup: L
    payload: P
  }) => Promise<void>
  onSuccess?: (lockup: L) => Promise<R> | R
  onFail?: (params: { lockup?: L; errorMessage: string }) => Promise<R> | R
}
