"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { Icon } from "@/components/Icon"
import { StatCard } from "@/components/StatCards/StatCard"
import { Tooltip } from "@/components/Tooltip"

export function AverageAPR() {
  const {
    assetListWithPrices,
    globalState: { currentRound, atomPrice, totalLockedTokens },
    currentProposalTributes,
  } = useAppContext()

  // Calculate total tribute value
  const totalTributeValue = Array.from(currentProposalTributes.values())
    .flat() // Flatten all tributes across all proposals
    .reduce((total, tribute) => {
      // Calculate the value of this tribute in USD
      // If the asset is not found in the price list or has no price, its value is considered 0
      const assetEntry = assetListWithPrices.get(tribute.funds.denom)
      const assetPrice = assetEntry?.priceUsd ?? 0
      const assetDecimals = assetEntry?.decimals ?? 0
      // Calculate the value of this tribute and add it to the total
      // Convert the amount to a float, divide by 10^decimals, and multiply by the price
      return (
        total +
        (parseFloat(tribute.funds.amount) / 10 ** assetDecimals) * assetPrice
      )
    }, 0)

  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          PoL Revenue
          <Tooltip
            classNamesForTooltip="flex flex-col gap-2"
            tipContents={
              <>
                <p>
                  This number is the average APR available to Hydro voters
                  during the current active round. This is separate and
                  additional to your standard staking APR as an ATOM staker.
                </p>

                <a
                  href="/docs/users/calculating-staking-apr"
                  className="inline-flex gap-1 text-palette-green underline"
                  target="_blank"
                >
                  Learn More
                  <Icon name="solid:arrow-up-right" />
                </a>
              </>
            }
          />
        </div>
      }
      subTitle={`All-Time`}
      value="$–"
    />
  )
}
