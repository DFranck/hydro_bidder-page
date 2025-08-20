"use client"
import { ModalWindow } from "@/components/ModalWindow"
import { useCallback, useEffect, useMemo, useState } from "react"

import { StyledText } from "@/components/StyledText"
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
  showActionPanel: boolean
}

export default function LockupActionModal<T extends LockupActionType>({
  isOpen,
  isDisabled,
  lockup,
  action,
  onClose,
  onConfirm,
  isProcessing,
  showActionPanel,
}: LockupActionModalProps<T>) {
  const config = useMemo(() => getLockupActionConfig(action), [action])

  const getInitial = useMemo(() => config.getInitialPayload, [config])

  const [payload, setPayload] = useState<LockupActionPayloadFor<T>>(
    getInitial ? getInitial(lockup) : ({} as LockupActionPayloadFor<T>)
  )

  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setPayload(
        getInitial ? getInitial(lockup) : ({} as LockupActionPayloadFor<T>)
      )
      setIsFormValid(false)
    }
  }, [isOpen, lockup, getInitial])

  const handleChange = useCallback(
    (patch: Partial<LockupActionPayloadFor<T>>) => {
      setPayload((prev) => {
        const merged = {
          ...(prev ?? {}),
          ...patch,
        } as LockupActionPayloadFor<T>
        return JSON.stringify(merged) === JSON.stringify(prev) ? prev : merged
      })
    },
    []
  )

  useEffect(() => {
    if (!action) return
    const valid = config?.isValid?.(payload) ?? false
    setIsFormValid((prev) => (prev === valid ? prev : valid))
  }, [action, payload, config])

  const Component = useMemo(
    () => config?.FormComponent as React.FC<LockupActionFormProps<T>>,
    [config]
  )

  return (
    <ModalWindow
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[98%] sm:max-w-lg md:max-w-3xl"
    >
      <div className="flex max-h-[95vh] flex-col overflow-hidden rounded-xl border-2 border-white/20 bg-black p-0">
        <div className="min-h-[48px] shrink-0 gap-[10px] rounded-t-xl bg-[#FFE1B81A] px-3 py-3 sm:h-[48px] sm:px-6">
          <h2 className="font-inter text-base leading-5 font-bold sm:text-[18px] sm:leading-6">
            Lockup Details
          </h2>
        </div>
        <div className="hide-scrollbar flex-1 space-y-4 overflow-y-auto p-3 sm:space-y-6 sm:p-[24px]">
          <LockupActionCard
            lockup={lockup as AugmentedLockup | MarketplaceLockup}
            action={action}
            onChange={handleChange}
          />
          {showActionPanel ? (
            <form
              className="flex flex-col gap-4 sm:gap-6"
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
          ) : (
            <div className="flex justify-end">
              <StyledText
                as={"span"}
                variant="button.primary"
                onClick={onClose}
              >
                Close
              </StyledText>
            </div>
          )}
        </div>
      </div>
    </ModalWindow>
  )
}
