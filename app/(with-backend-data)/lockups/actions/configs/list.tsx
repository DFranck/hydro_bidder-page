"use client"
import { Icon } from "@/components/Icon"
import { AugmentedLockup } from "@/contract-apis/types"
import { Coin } from "moonkittjs"
import { allowedListAmounts } from "../../marketplace/config/allowedListAmounts"
import { MarketplaceLockup } from "../../marketplace/types"
import { isListedMarketplaceLockup } from "../../marketplace/utils/isListedMarketplaceLockup"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import ListActionFields from "../components/fields/ListActionFields"
import executeApproveList from "../transactions/executeApproveList"
import { ActionConfig } from "../types"
import { SupabaseHydroListingUpdate } from "../utils/SupabaseHydroListingUpdate"
import { ALLOWED_MARKETPLACE_DENOMS } from "@/lib/tokenDenoms"
// Denominations allowed for listing lockups

// Payload for "list" action
export type ListPayload = {
  price: Coin
}

// Determines if lockup can be listed (UI-level guard)
export function isLockupListable(lockup?: AugmentedLockup): boolean {
  if (!lockup) return false
  return (
    ALLOWED_MARKETPLACE_DENOMS.includes(lockup.funds.denom) &&
    allowedListAmounts.includes(lockup.funds.amount)
  )
}

// Validates the action payload (form-level)
function isValidListPayload(payload: unknown): payload is ListPayload {
  const priceCandidate = (payload as any)?.price
  const rawAmount = priceCandidate?.amount
  const amount =
    typeof rawAmount === "string" ? parseFloat(rawAmount) : rawAmount
  const isAmountValid = typeof amount === "number"
  return isAmountValid
}

// Export config object: the single source of truth for this action.
export const listActionConfig: ActionConfig<
  ListPayload,
  AugmentedLockup | MarketplaceLockup
> = {
  triggerLabel: (lockup) => (
    <>
      <Icon name="light:cart-shopping" />
      {isListedMarketplaceLockup(lockup) ? (
        <span className="whitespace-nowrap">Update Price</span>
      ) : (
        "Sell"
      )}
    </>
  ),
  submitLabel: ({ lockup, payload }) => (
    <span className="flex gap-1 font-medium">
      <Icon name="cart-shopping" />{" "}
      <span className="whitespace-nowrap">
        {isListedMarketplaceLockup(lockup) ? "Update to" : "List for"}
      </span>
      <span className="font-extrabold">{payload?.price?.amount}</span>
      {payload?.price?.denom && getDisplayDenom(payload.price.denom)}
    </span>
  ),
  modalTitle: (lockup) =>
    isListedMarketplaceLockup(lockup) ? "Update a Lockup" : "Sell a Lockup",
  FormComponent: ListActionFields,
  tooltips: {
    disabled: (lockup) =>
      !isLockupListable(lockup) ? "lockupNotListable" : "lockupIsLSM",
    confirm: "toListConfirmTooltip",
  },
  toasts: {
    processing: "listingLockupInProgress",
    success: "listingLockupSuccess",
    error: "listingLockupError",
  },
  isDisabled: (lockup) => {
    if (!lockup) return true
    return !isLockupListable(lockup)
  },
  isValid: (payload) => {
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("price" in payload)
    ) {
      return false
    }

    return isValidListPayload(payload)
  },
  execute: async ({ address, getSigningClient, lockup, payload }) => {
    await executeApproveList(address, getSigningClient, lockup, payload.price)
  },
  onSuccess: async (lockup) => {
    if (isListedMarketplaceLockup(lockup)) {
      const data = await SupabaseHydroListingUpdate(
        lockup.id.toString(),
        "update",
      )
      return data
    } else {
      const data = await SupabaseHydroListingUpdate(
        lockup.id.toString(),
        "list",
      )
      return data
    }
  },
}
