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
                  values: Partial<LockupActionPayloadFor<"list">>,
                ) => void
              }
            />
          </li>
        )}
        {isListed && action != "list" && (
          <li>
            <LockupActionCardValue
              className="bg-gradient-to-r from-palette-green/0 to-palette-green/20 "
              icon="solid:tag"
              leftContent="sale price"
              leftClassName="text-palette-green opacity-100  items-center"
              rightContent={
                <span className={` text-[24px] font-bold text-palette-green`}>
                  {formatDenomAmount(
                    lockup.listing.price.amount,
                    getDenomExponent(lockup.listing.price.denom),
                  )}{" "}
                  {getDisplayDenom(lockup.listing.price.denom)}
                </span>
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
        <LockupMoreDetails lockup={lockup}/>
        <li className="hidden md:block">
          <LockupActionVotingHistory lockup={lockup} />
        </li>
      </ul>
    </div>
  )
}
