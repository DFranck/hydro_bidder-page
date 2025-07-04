"use client"
import { StyledText } from "@/components/StyledText"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { MarketplaceLockup } from "../../marketplace/types"
import { formatDenomAmount } from "../../utils/formatDenomAmount"
import { getDenomExponent } from "../../utils/getDenomExponent"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import { getPriceMetaForDenom } from "../../utils/getPriceMetaForDenom"
import { getRewardsUsdTotal } from "../../utils/getRewardsUsdTotal"
import LockupActionCardValue from "./LockupActionCardValue"

export function LockupActionPendingRewards({
  lockup,
}: {
  lockup: AugmentedLockup | MarketplaceLockup
}) {
  const { currentRoundPrices = {} } = useBackendData()
  const rewards = lockup.outstanding || []
  const totalRewards = getRewardsUsdTotal(rewards, currentRoundPrices)

  return (
    <>
      <LockupActionCardValue
        icon="trophy"
        leftContent="pending rewards"
        leftClassName="items-center"
        rightContent={
          <StyledText
            as={"span"}
            tooltip={
              <ul>
                {rewards.length === 0
                  ? "No pending rewards"
                  : rewards.map((r, i) => {
                      const { price, exponent } = getPriceMetaForDenom(
                        currentRoundPrices,
                        r.denom,
                      )
                      const localExponent = getDenomExponent(r.denom)
                      const localDenom = getDisplayDenom(r.denom)
                      const usedExponent =
                        exponent > 0 ? exponent : localExponent
                      const realAmount =
                        Number(r.amount) / Math.pow(10, usedExponent)
                      const usedPrice = price > 0 ? price : 0
                      const usdPrice = amountToUSDString(realAmount * usedPrice)

                      return (
                        <li
                          key={i}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="whitespace-nowrap">
                            {Number(
                              formatDenomAmount(
                                r.amount,
                                exponent > 0 ? exponent : localExponent,
                              ),
                            ).toFixed(2)}{" "}
                            <span className="opacity-70">
                              {currentRoundPrices[r.denom]?.token_symbol
                                ? currentRoundPrices[r.denom]?.token_symbol
                                : localDenom}
                            </span>
                          </span>
                          {Number(usdPrice) > 0 ? (
                            <span>({usdPrice})</span>
                          ) : (
                            <span className="whitespace-nowrap italic opacity-50">
                              (price unavailable)
                            </span>
                          )}
                        </li>
                      )
                    })}
              </ul>
            }
          >
            {amountToUSDString(totalRewards).replace("USD", "")}
          </StyledText>
        }
      />
    </>
  )
}
