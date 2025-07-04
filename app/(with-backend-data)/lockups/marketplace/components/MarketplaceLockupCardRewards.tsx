import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import LockupActionCardValue from "../../actions/components/LockupActionCardValue"
import { formatDenomAmount } from "../../utils/formatDenomAmount"
import { getDenomExponent } from "../../utils/getDenomExponent"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import { getPriceMetaForDenom } from "../../utils/getPriceMetaForDenom"
import { getRewardsUsdTotal } from "../../utils/getRewardsUsdTotal"
import { MarketplaceLockup } from "../types"
import { getDenomColor } from "../utils/getDenomColor"

const MarketplaceLockupCardRewards = ({
  lockup,
}: {
  lockup: MarketplaceLockup
}) => {
  const { currentRoundPrices = {} } = useBackendData()
  const rewards = lockup.outstanding || []
  const totalRewards = getRewardsUsdTotal(rewards, currentRoundPrices)

  const color = getDenomColor(lockup.funds.denom) ?? "white"
  const fromClass = color === "white" ? "from-white/0" : `from-${color}/0`
  const toClass = color === "white" ? "to-white/30" : `to-${color}/30`
  const textClass = `text-${color}`

  return (
    <LockupActionCardValue
      className={`flex-1 bg-gradient-to-r ${fromClass} ${toClass} ${textClass}`}
      rightContent={
        <StyledText
          as={"span"}
          tooltip={
            <ul>
              <StyledText as="h5" className="font-bold uppercase">
                Pending rewards
              </StyledText>
              {rewards.length === 0
                ? "No pending rewards"
                : rewards.map((r, i) => {
                    const { price, exponent } = getPriceMetaForDenom(
                      currentRoundPrices,
                      r.denom,
                    )
                    const localExponent = getDenomExponent(r.denom)
                    const localDenom = getDisplayDenom(r.denom)
                    const usedExponent = exponent > 0 ? exponent : localExponent
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
          {amountToUSDString(totalRewards).replace(/\s?USD$/, "")}
          <Icon name="trophy" className="ml-2" />
        </StyledText>
      }
    />
  )
}

export default MarketplaceLockupCardRewards
