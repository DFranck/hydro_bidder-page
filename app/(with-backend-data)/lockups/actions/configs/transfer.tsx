"use client"
import { Icon } from "@/components/Icon"
import { AugmentedLockup } from "@/contract-apis/types"
import { getParsedNftDenomsFromEnv } from "@/lib/getParsedNftDenomsFromEnv"
import { isValidBech32 } from "@/lib/isValidBech32"
import { MarketplaceLockup } from "../../marketplace/types"
import { isListedMarketplaceLockup } from "../../marketplace/utils/isListedMarketplaceLockup"
import TransferActionFields from "../components/fields/TransferActionFields"
import executeTransferNft from "../transactions/executeTransferNft"
import executeTransferNftUnlist from "../transactions/executeTransferNftUnlist"
import { ActionConfig } from "../types"
import { SupabaseHydroListingUpdate } from "../utils/SupabaseHydroListingUpdate"

// Token denominations supported for transfer
const transferAllowedDenoms = getParsedNftDenomsFromEnv()

// Transfer payload
export type TransferPayload = {
  receiverAddress: string
}

// A lockup can be transferred if the denom is in transferAllowedDenoms list.
// This affects whether the "Transfer" action is enabled on the lockups page or not.
function isLockupTransferable(
  lockup?: AugmentedLockup | MarketplaceLockup,
): boolean {
  if (!lockup) return false
  return transferAllowedDenoms.includes(lockup.funds.denom)
}

// check if payload is valid
function isValidTransferPayload(payload: unknown): payload is TransferPayload {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("receiverAddress" in payload)
  ) {
    return false
  }

  const receiver = (payload as any).receiverAddress
  return typeof receiver === "string" && isValidBech32(receiver, "neutron1")
}

export const transferActionConfig: ActionConfig<
  TransferPayload,
  AugmentedLockup
> = {
  triggerLabel: (
    <>
      <Icon name="light:arrow-right-arrow-left" /> Transfer
    </>
  ),
  submitLabel: (
    <>
      <Icon name="arrow-right-arrow-left" /> Transfer Lockup
    </>
  ),
  modalTitle: "Transfer a Lockup",
  FormComponent: TransferActionFields,
  tooltips: {
    disabled: "lockupIsLSM",
    confirm: "toTransferConfirmTooltip",
  },
  toasts: {
    processing: "transferringLockupInProgress",
    success: "transferringLockupSuccess",
    error: "transferringLockupError",
  },
  isDisabled: (lockup) => {
    if (!lockup) return true
    return !isLockupTransferable(lockup)
  },
  isValid: isValidTransferPayload,
  execute: async ({ address, getSigningClient, lockup, payload }) => {
    if (isListedMarketplaceLockup(lockup)) {
      await executeTransferNftUnlist(
        address,
        getSigningClient,
        lockup,
        payload.receiverAddress,
      )
    } else {
      await executeTransferNft(
        address,
        getSigningClient,
        lockup,
        payload.receiverAddress,
      )
    }
  },
  onSuccess: async (lockup) => {
    if (isListedMarketplaceLockup(lockup)) {
      const data = await SupabaseHydroListingUpdate(
        lockup.id.toString(),
        "unlist",
      )
      return data
    }
    return undefined
  },
}
