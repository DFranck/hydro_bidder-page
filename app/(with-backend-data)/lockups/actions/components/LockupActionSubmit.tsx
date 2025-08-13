"use client"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { needsWalletConnectionTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import {
  LockupActionPayloadFor,
  LockupActionType,
  LockupTypeForAction,
} from "../types"
import { getActionTooltip } from "../utils/getActionTooltip"
import { getLockupActionConfig } from "../utils/getLockupActionConfig"
import { useChain } from '@cosmos-kit/react';

interface LockupActionSubmitProps<T extends LockupActionType> {
  action: T
  isFormValid: boolean
  isProcessing: boolean
  onClose: () => void
  onConfirm: (payload: LockupActionPayloadFor<T>) => void
  payload: LockupActionPayloadFor<T>
  lockup?: LockupTypeForAction<T>
  cancelLabel?: string
  isDisabled?: boolean
}

export function LockupActionSubmit<T extends LockupActionType>({
  action,
  isFormValid,
  isProcessing,
  onClose,
  onConfirm,
  lockup,
  payload,
  cancelLabel = "Cancel",
  isDisabled,
}: LockupActionSubmitProps<T>) {
  const { isWalletConnected } = useBackendData()
  const isActuallyConnected = isWalletConnected

  const config = getLockupActionConfig(action)

  const submitLabel =
    typeof config.submitLabel === "function"
      ? config.submitLabel({ payload, lockup })
      : config.submitLabel

  return (
    <div className="flex w-fit gap-4 self-end">
      <StyledText
        as="button"
        variant="button.secondary"
        type="button"
        className="border-none"
        onClick={onClose}
        disabled={isProcessing}
      >
        {cancelLabel}
      </StyledText>
      <StyledText
        as="button"
        variant="button.primary"
        type="button"
        tooltip={
          isDisabled
            ? getActionTooltip(
                typeof config.tooltips?.disabled === "function"
                  ? config.tooltips.disabled()
                  : (config.tooltips?.disabled ?? ""),
              )
            : !isActuallyConnected
              ? needsWalletConnectionTooltip
              : !isFormValid && config.tooltips?.confirm
                ? getActionTooltip(
                    typeof config.tooltips?.confirm === "function"
                      ? config.tooltips.confirm()
                      : (config.tooltips?.confirm ?? ""),
                  )
                : undefined
        }
        disabled={isProcessing || !isFormValid || !isActuallyConnected}
        onClick={() => onConfirm(payload)}
      >
        {isProcessing ? (
          <div className="animate-spin text-lg">
            <Icon name="solid:loader" />
          </div>
        ) : (
          submitLabel
        )}
      </StyledText>
    </div>
  )
}
