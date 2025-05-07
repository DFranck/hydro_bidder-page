"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourTotalRewardsAllTimeTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import sumBy from "lodash/sumBy"
import { StatCard } from "../StatCard"

export function AllTimeRewardsWallet() {
  const { isLoading, claimsHistorical, claimsOutstanding } = useBackendData()
  const allTimeUsersRewardsInUsd = sumBy(
    [...claimsHistorical, ...claimsOutstanding],
    "amount.valueUsd"
  )

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip
          tipContents={yourTotalRewardsAllTimeTooltip}
          className="w-full"
        >
          Your{" "}
          <span className="inline-flex items-center gap-1">
            Rewards
            <Icon name="circle-info" />
          </span>
        </Tooltip>
      }
      subTitle="All-Time"
      value={amountToUSDString(allTimeUsersRewardsInUsd, {
        appendUsd: false,
        numberOfDecimals: 2,
        removeTrailingZeros: true,
      })}
    />
  )
}
