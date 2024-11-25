"use client"

import { Icon } from "@/components/Icon"
import { StatCard } from "@/components/StatCards/StatCard"
import { Tooltip } from "@/components/Tooltip"
import { useContractContext } from "@/contract-apis/useContractContext"
import { sumBy } from "lodash"

export function AverageAPR() {
  const { bidsByRoundId, currentRoundMetadata, isLoading } =
    useContractContext()
  const { averageAPR, roundId } = currentRoundMetadata
  const totalTributeValue = sumBy(
    bidsByRoundId[roundId],
    (bid) => bid.onchainTributeUsdc
  )

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <div className="flex items-center gap-1">
          Average APR
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
      subTitle={`Pilot Round ${roundId + 1}`}
      value={averageAPR.toLocaleString("en-US", {
        style: "percent",
      })}
    />
  )
}
