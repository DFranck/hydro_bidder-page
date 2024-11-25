"use client"

import { StatCard } from "@/components/StatCards/StatCard"
import { Tooltip } from "@/components/Tooltip"
import { maxLockedTokensPerAddress } from "@/contract-apis/_globals"
import { useContractContext } from "@/contract-apis/useContractContext"
import { formatAmount } from "@/lib/utils"
import { sumBy } from "lodash"

export function YourTotalATOMLocked() {
  const { globalMetadata, isLoading } = useContractContext()
  const lockedAtom =
    sumBy(globalMetadata.usersLockups, "lock_entry.funds.amount") ?? 0
  const percentLocked = maxLockedTokensPerAddress
    ? (lockedAtom / maxLockedTokensPerAddress) * 100
    : 0

  return (
    <StatCard
      isLoading={isLoading}
      value={
        <>
          {(lockedAtom / 1e6).toLocaleString("en-US", {
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
