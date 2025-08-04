"use client"
import { ModalWindow } from "@/components/ModalWindow"
import { useCallback, useEffect, useState } from "react"

import { AugmentedLockup } from "@/contract-apis/types"
import { MarketplaceLockup } from "../../marketplace/types"
import {
  LockupActionFormProps,
  LockupActionPayloadFor,
  LockupActionType,
  LockupTypeForAction,
} from "../types"
import { getLockupActionConfig } from "../utils/getLockupActionConfig"
import { LockupActionCard } from "./LockupActionCard"

interface LockupActionModalProps<T extends LockupActionType> {
  isOpen: boolean
  isDisabled: boolean
  lockup: LockupTypeForAction<T>
  action: T
  onClose: () => void
  onConfirm: (payload: LockupActionPayloadFor<T>) => Promise<void>
  isProcessing: boolean
}

export default function LockupActionModal<T extends LockupActionType>({
  isOpen,
  isDisabled,
  lockup,
  action,
  onClose,
  onConfirm,
  isProcessing,
}: LockupActionModalProps<T>) {
  const config = getLockupActionConfig(action)
  const [payload, setPayload] = useState<LockupActionPayloadFor<T>>(
    config.getInitialPayload
      ? config.getInitialPayload(lockup)
      : ({} as LockupActionPayloadFor<T>)
  )
  const [isFormValid, setIsFormValid] = useState<boolean>(false)
  useEffect(() => {
    if (!isOpen) {
      setPayload(
        config.getInitialPayload
          ? config.getInitialPayload(lockup)
          : ({} as LockupActionPayloadFor<T>)
      )
      setIsFormValid(false)
    }
  }, [isOpen, config, lockup])

  const handleChange = useCallback(
    (newValues: Partial<LockupActionPayloadFor<T>>) => {
      setPayload(
        (prev) =>
          ({
            ...(typeof prev === "object" && prev !== null ? prev : {}),
            ...newValues,
          }) as LockupActionPayloadFor<T>
      )
    },
    []
  )

  useEffect(() => {
    if (action && payload) {
      const valid = config?.isValid?.(payload) ?? false
      setIsFormValid(valid)
    }
  }, [action, payload])

  const Component = config?.FormComponent as React.FC<LockupActionFormProps<T>>

  return (
    <ModalWindow isOpen={isOpen} onClose={onClose} className="max-w-[98%]">
      <div className="rounded-xl border-2 border-white/20 bg-black p-0">
        <div className="h-[48px] gap-[10px] rounded-t-xl bg-[#FFE1B81A] px-6 py-3 text-lg">
          <h2 className="font-inter text-[18px] leading-6 font-bold">
            Lockup Details
          </h2>
        </div>
        <div className="space-y-6 p-[24px]">
          <LockupActionCard
            lockup={lockup as AugmentedLockup | MarketplaceLockup}
            action={action}
            onChange={handleChange}
          />
          <form
            className="flex flex-col gap-6"
            onSubmit={async (e) => {
              e.preventDefault()
              if (!isFormValid) {
                return
              }
              await onConfirm(payload)
              setIsFormValid(false)
            }}
          >
            <Component
              isDisabled={isDisabled}
              lockup={lockup}
              onChange={handleChange}
              config={config}
              onClose={onClose}
              isProcessing={isProcessing}
              onConfirm={onConfirm}
              isFormValid={isFormValid}
              payload={payload}
            />
          </form>
        </div>
      </div>
    </ModalWindow>
  )
}
