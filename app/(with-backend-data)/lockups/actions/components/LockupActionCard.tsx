"use client"
import { AugmentedLockup } from "@/contract-apis/types"
import { MarketplaceLockup } from "../../marketplace/types"
import { isListedMarketplaceLockup } from "../../marketplace/utils/isListedMarketplaceLockup"
import { formatDenomAmount } from "../../utils/formatDenomAmount"
import { getDenomExponent } from "../../utils/getDenomExponent"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import { LockupActionPayloadFor, LockupActionType } from "../types"
import LockupActionCardEligibility from "./LockupActionCardEligibility"
import LockupActionCardPrice from "./LockupActionCardPrice"
import LockupActionCardValue from "./LockupActionCardValue"
import { LockupActionPendingRewards } from "./LockupActionPendingRewards"
import { LockupActionVotingHistory } from "./LockupActionVotingHistory"
import { LockupImage } from "./LockupImage"
import { LockupMoreDetails } from "./LockupMoreDetals"
import { LockupValueSummary } from "./LockupValueSummary"
import { useLockupTotals } from "../hooks/useLockupPricing"

export function LockupActionCard<
  L extends AugmentedLockup | MarketplaceLockup,
  T extends LockupActionType,
>({
  lockup,
  action,
  onChange,
}: {
  lockup: L
  action: T
  onChange?: (values: Partial<LockupActionPayloadFor<T>>) => void
}) {
  const isListed = isListedMarketplaceLockup(lockup)
  const { totalAtom } = useLockupTotals(lockup)

  let salePrice: number | null = null
  let premium: number | null = null

  if (isListedMarketplaceLockup(lockup)) {
    salePrice =
      Number(lockup.listing?.price?.amount) /
      Math.pow(10, getDenomExponent(lockup.listing?.price?.denom))
    if (totalAtom && salePrice > 0) {
      premium = (salePrice / totalAtom - 1) * 100
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="pb-2">
        <div
          className="relative mx-auto mb-4"
          style={{ width: "200px", height: "200px" }}
        >
          <LockupImage lockup={lockup} />
        </div>
        <LockupValueSummary lockup={lockup} />
      </div>
      <ul className="space-y-[2px] overflow-y-auto rounded-xl">
        {action === "list" && (
          <li>
            <LockupActionCardPrice
              lockup={lockup}
              onChange={
                onChange as (
                  values: Partial<LockupActionPayloadFor<"list">>
                ) => void
              }
            />
          </li>
        )}
        {isListed && action != "list" && (
          <li>
            <LockupActionCardValue
              className="from-palette-green/0 to-palette-green/20 flex-col bg-gradient-to-r md:flex-row"
              icon="solid:tag"
              leftContent="sale price"
              leftClassName="text-palette-green opacity-100  items-center"
              rightContent={
                <div className="flex flex-1 flex-col items-end">
                  <div className="flex flex-col items-end">
                    <span className="text-palette-green text-[24px] font-bold">
                      {formatDenomAmount(
                        lockup.listing.price.amount,
                        getDenomExponent(lockup.listing.price.denom)
                      )}{" "}
                      {getDisplayDenom(lockup.listing.price.denom)}
                    </span>
                    {premium !== null && (
                      <span className="text-palette-green text-xs opacity-80">
                        {premium.toFixed(0)}% premium
                      </span>
                    )}
                  </div>
                </div>
              }
            />
          </li>
        )}

        <li>
          <LockupActionCardValue
            icon="clock"
            leftContent="lock duration"
            leftClassName="items-center"
            rightContent={
              lockup.isExpired ? "Expired" : lockup.daysLeft + " days"
            }
          />
        </li>
        <li>
          <LockupActionPendingRewards lockup={lockup} />
        </li>
        <li>
          <LockupActionCardEligibility lockup={lockup} />
        </li>
        <LockupMoreDetails lockup={lockup} />
        <li className="hidden md:block">
          <LockupActionVotingHistory lockup={lockup} />
        </li>
      </ul>
    </div>
  )
}
