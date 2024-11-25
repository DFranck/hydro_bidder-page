"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourTotalATOMLockedTooltip } from "@/components/ToolTips"
import { maxLockedTokensPerAddress } from "@/contract-apis/_globals"
import { useContractContext } from "@/contract-apis/useContractContext"
import { formatAmount } from "@/lib/utils"
import { sumBy } from "lodash"
import { StatCard } from "../StatCard"

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
        <Tooltip tipContents={yourTotalATOMLockedTooltip}>
          <div className="flex items-center gap-1">
            Your Locked ATOM
            <Icon name="circle-info" />
          </div>
        </Tooltip>
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
