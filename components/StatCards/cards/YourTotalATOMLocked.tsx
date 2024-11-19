"use client"

import { StatCard } from "@/components/StatCards/StatCard"
import { Tooltip } from "@/components/Tooltip"
import { maxLockedTokensPerAddress } from "@/contract-apis/_globals"
import { useUserVotingData } from "@/contract-apis/useUserVotingData"
import { formatAmount } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"

export function YourTotalATOMLocked() {
  const { address } = useChain("neutron")
  const { data: userVotingData, isPending: userVotingDataIsPending } =
    useUserVotingData(address)
  const lockedAtom = userVotingData?.lockups.lockedAtom
  const percentLocked = maxLockedTokensPerAddress
    ? ((lockedAtom ?? 0) / maxLockedTokensPerAddress) * 100
    : 0

  return (
    <StatCard
      isLoading={userVotingDataIsPending}
      value={
        <>
          {((lockedAtom ?? 0) / 1e6).toLocaleString("en-US", {
            maximumFractionDigits: 4,
          })}
        </>
      }
      title={
        <div className="flex items-center gap-1">
          Your Locked ATOM{" "}
          <Tooltip
            tipContents={
              <>
                Your staked ATOM locked in Hydro. The more ATOMs you lock, the
                higher your voting power will be
              </>
            }
          />
        </div>
      }
      subTitle={
        <>
          <strong>{percentLocked.toFixed(2)}%</strong> of{" "}
          <strong>{formatAmount(maxLockedTokensPerAddress ?? 0)}</strong> max.
        </>
      }
    />
  )
}
