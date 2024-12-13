"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourTotalRewardsAllTimeTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { sumBy } from "lodash"
import { StatCard } from "../StatCard"

export function AllTimeRewardsWallet() {
  const { isLoading, claimsHistorical, claimsOutstanding } = useBackendData()
  const allTimeUsersRewardsInUsd = sumBy(
    [...claimsHistorical, ...claimsOutstanding],
    "amount.valueInUsd"
  )

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <Tooltip tipContents={yourTotalRewardsAllTimeTooltip}>
          <div className="flex items-center gap-1">
            <span>Your Rewards</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle="All-Time"
      value={amountToUSDString(allTimeUsersRewardsInUsd)}
    />
  )
}
