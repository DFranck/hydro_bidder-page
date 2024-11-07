"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { StatCard } from "@/components/StatCards/StatCard"
import { Tooltip } from "@/components/Tooltip"
import { useUserVotingData } from "@/hooks/hooks"
import { formatAmount } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"

export function YourTotalATOMLocked() {
  const {
    globalState: {
      constants: { max_locked_tokens_per_address },
    },
  } = useAppContext()
  const { address } = useChain("neutron")
  const { data: userVotingData, isPending: userVotingDataIsPending } =
    useUserVotingData(address ?? "")
  const lockedAtom = userVotingData?.lockups.lockedAtom
  const percentLocked = max_locked_tokens_per_address
    ? ((lockedAtom ?? 0) / max_locked_tokens_per_address) * 100
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
          <strong>{formatAmount(max_locked_tokens_per_address ?? 0)}</strong>{" "}
          max.
        </>
      }
    />
  )
}
