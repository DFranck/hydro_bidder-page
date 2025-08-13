import { Icon } from "@/components/Icon"
import { Coin } from "moonkittjs"
import { MarketplaceLockup } from "../../marketplace/types"
import { isListedMarketplaceLockup } from "../../marketplace/utils/isListedMarketplaceLockup"
import { formatDenomAmount } from "../../utils/formatDenomAmount"
import { getDenomExponent } from "../../utils/getDenomExponent"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import BuyActionFields from "../components/fields/BuyActionFields"
import executeBuy from "../transactions/executeBuy"
import { ActionConfig } from "../types"
import { SupabaseHydroListingUpdate } from "../utils/SupabaseHydroListingUpdate"

// Payload for "buy" action
export type BuyPayload = {
  price: Coin // price is fixed, comes from the listing
}

// Type guard for payload validation
function isValidBuyPayload(payload: unknown): payload is BuyPayload {
  const priceCandidate = (payload as any)?.price
  const amount =
    typeof priceCandidate?.amount === "string"
      ? parseFloat(priceCandidate.amount)
      : priceCandidate?.amount
  return typeof amount === "number" && amount > 0
}

// ActionConfig for the "buy" action
export const buyActionConfig: ActionConfig<BuyPayload, MarketplaceLockup> = {
  triggerLabel: (
    <>
      <Icon name="light:cart-shopping" /> Buy
    </>
  ),
  submitLabel: ({ payload }) =>
    payload?.price?.amount ? (
      <span className="flex gap-1 font-medium">
        <Icon name="cart-shopping" />
        <span className="whitespace-nowrap">Buy for</span>
        <span className="font-extrabold">
          {formatDenomAmount(
            payload?.price?.amount,
            getDenomExponent(payload.price.denom),
          )}
        </span>
        {getDisplayDenom(payload.price.denom)}
      </span>
    ) : (
      <span className="flex gap-1 font-medium">Not for sale</span>
    ),

  modalTitle: "Lockup Details",
  FormComponent: BuyActionFields,
  tooltips: {
    disabled: "lockupNotBuyableTooltip",
    confirm: "toBuyConfirmTooltip",
  },
  toasts: {
    processing: "buyLockupInProgress",
    success: "buyLockupSuccess",
    error: "buyLockupError",
  },
  getInitialPayload: (lockup) =>
    lockup.listing?.price
      ? { price: lockup.listing.price }
      : { price: { amount: "", denom: "" } },
  isDisabled: (lockup?: MarketplaceLockup) => {
    if (!lockup) return true
    if (lockup.listing?.collection === "not-for-sale") return true
    return false
  },
  isValid: isValidBuyPayload,
  execute: async ({ address, getSigningClient, lockup, payload }) => {
    await executeBuy(address, getSigningClient, lockup, payload.price)
  },
  onSuccess: async (lockup) => {
    if (isListedMarketplaceLockup(lockup)) {
      const data = await SupabaseHydroListingUpdate(lockup.id.toString(), "buy")
      return data
    }
    return undefined
  },
  onFail: async ({ lockup, errorMessage }) => {
    const isUnlistError = errorMessage.includes(
      "This NFT is no longer available for sale.",
    )

    if (isListedMarketplaceLockup(lockup) && isUnlistError) {
      const data = await SupabaseHydroListingUpdate(
        lockup.id.toString(),
        "unlist",
      )
      return data
    }

    return undefined
  },
}
