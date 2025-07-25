"use client"

import { StyledText, StyledTextVariant } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useChain } from "@cosmos-kit/react"
import { useRouter } from "next/navigation"
import { useCallback, useContext, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { useMarketplaceData } from "../../marketplace/context/MarketplaceDataProvider"
import { MarketplaceLockup } from "../../marketplace/types"
import {
  LockupActionPayloadFor,
  LockupActionType,
  LockupTypeForAction,
} from "../types"
import { extractRelevantErrorMessage } from "../utils/extractRelevantErrorMessage"
import { ToastKey, getActionToast } from "../utils/getActionToast"
import { getActionTooltip } from "../utils/getActionTooltip"
import { getLockupActionConfig } from "../utils/getLockupActionConfig"
import { DropdownContext } from "./Dropdown"
import LockupActionModal from "./LockupActionModal"

export function LockupActionTrigger<T extends LockupActionType>({
  lockup,
  action,
  children,
  variant,
  className,
}: {
  lockup: LockupTypeForAction<T>
  action: T
  children?: React.ReactNode
  variant?: StyledTextVariant
  className?: string
}) {
  const { setToasts } = useToasts()
  const { refetchWalletData } = useBackendData()
  const { getSigningCosmWasmClient, address } = useChain("neutron")
  const router = useRouter()
  const { updateLocal } = useMarketplaceData()
  const { close, setDisableClickAway } = useContext(DropdownContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setDisableClickAway(isModalOpen)
  }, [isModalOpen, setDisableClickAway])

  const config = getLockupActionConfig(action)

  const isDisabled = config.isDisabled?.(lockup) ?? false
  const tooltip = isDisabled
    ? getActionTooltip(
        typeof config.tooltips?.disabled === "function"
          ? (config.tooltips.disabled(lockup) ?? "")
          : (config.tooltips?.disabled ?? ""),
      )
    : undefined

  const handleOpen = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleConfirm = useCallback(
    async (payload?: LockupActionPayloadFor<T>) => {
      if (!payload || isProcessing || !address || isDisabled) return

      setIsProcessing(true)
      setToasts([getActionToast(config.toasts.processing as ToastKey)])
      try {
        await config.execute({
          address,
          getSigningClient: getSigningCosmWasmClient,
          lockup,
          payload,
        })
        if (typeof config.onSuccess === "function") {
          const updateDB = await config.onSuccess(lockup)
          if (updateDB !== undefined) {
            updateLocal(lockup as AugmentedLockup | MarketplaceLockup, updateDB)
          }
        }
        refetchWalletData()
        setToasts([getActionToast(config.toasts.success as ToastKey)])
        close()
      } catch (err: unknown) {
        const relevantMessage = extractRelevantErrorMessage(err)
        console.error("🚨 Error during lockup action:", err)
        if (typeof config.onFail === "function") {
          const update = await config.onFail({
            lockup,
            errorMessage: relevantMessage,
          })
          if (update !== undefined) {
            updateLocal(lockup as AugmentedLockup | MarketplaceLockup, update)
          }
        }
        const normalizedError = new Error(relevantMessage)
        setToasts([
          getActionToast(config.toasts.error as ToastKey, normalizedError),
        ])
      } finally {
        setIsProcessing(false)
        setIsModalOpen(false)
      }
    },
    [
      address,
      close,
      config,
      getSigningCosmWasmClient,
      isDisabled,
      lockup,
      router,
      setToasts,
    ],
  )

  const triggerNode = children ? (
    <span
      tabIndex={isDisabled ? -1 : 0}
      className={twMerge("block focus:outline-none", className)}
      role="button"
      aria-disabled={isProcessing || isDisabled}
      onClick={handleOpen}
    >
      {children}
    </span>
  ) : (
    <StyledText
      as="button"
      variant={variant}
      aria-label={action}
      className={twMerge(
        className,
        "flex w-full items-center justify-start gap-2 px-4 py-2",
        isDisabled
          ? "opacity-50"
          : "hover:bg-palette-green hover:text-palette-text",
      )}
      tooltip={tooltip}
      disabled={isProcessing || isDisabled}
      onClick={handleOpen}
    >
      {typeof config.triggerLabel === "function"
        ? config.triggerLabel(lockup)
        : config.triggerLabel}
    </StyledText>
  )

  return (
    <>
      {triggerNode}
      {isModalOpen && action && (
        <LockupActionModal<T>
          isDisabled={isDisabled}
          isOpen={true}
          lockup={lockup}
          action={action}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          isProcessing={isProcessing}
        />
      )}
    </>
  )
}
