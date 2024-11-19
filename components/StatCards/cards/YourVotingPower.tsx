"use client"

import { StatCard } from "@/components/StatCards/StatCard"
import { Tooltip } from "@/components/Tooltip"
import { useUserVotingData } from "@/contract-apis/useUserVotingData"
import { formatAmount } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"

export function YourVotingPower() {
  const { address } = useChain("neutron")
  const { data: userVotingData, isPending: userVotingDataIsPending } =
    useUserVotingData(address ?? "")
  const votingPower = userVotingData?.votingPower ?? 0
  const firstExpireTs = userVotingData?.lockups.firstExpireTs

  return (
    <StatCard
      isLoading={userVotingDataIsPending}
      value={
        (!!votingPower && votingPower > 0 && formatAmount(votingPower)) ||
        "0.00"
      }
      title={
        <div className="flex items-center gap-1">
          Voting Power{" "}
          <Tooltip
            tipContents={
              <>
                Your Hydro voting power. The more power you have, the larger
                share of tributes you will receive
              </>
            }
          />
        </div>
      }
      subTitle={
        votingPower === 0 ? null : firstExpireTs && firstExpireTs > 0 ? (
          <>until {new Date(firstExpireTs / 1e6).toLocaleDateString()}</>
        ) : (
          "Your current Voting Power"
        )
      }
    />
  )
}
