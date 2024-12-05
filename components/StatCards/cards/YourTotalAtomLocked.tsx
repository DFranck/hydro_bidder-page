"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourTotalAtomLockedTooltip } from "@/components/ToolTips"
import { maxLockedTokensPerAddress } from "@/contract-apis/_globals"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { StatCard } from "../StatCard"

export function YourTotalAtomLocked() {
  const { totalLockedAtomUser, maxLockedAtomUser, isLoading } = useBackendData()
  const percentLocked = (totalLockedAtomUser / maxLockedAtomUser) * 100

  return (
    <StatCard
      isLoading={isLoading}
      value={
        <>
          {(totalLockedAtomUser).toLocaleString("en-US", {
            maximumFractionDigits: 4,
          })}
        </>
      }
      title={
        <Tooltip tipContents={yourTotalAtomLockedTooltip}>
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
