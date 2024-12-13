"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourTotalAtomLockedTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"

export function CurrentRoundAtomLockedWallet() {
  const {
    lockedAtomTotalWallet,
    lockedAtomMaxWallet,
    lockedAtomPercentageWallet,
    isLoading,
  } = useBackendData()

  return (
    <StatCard
      isLoading={isLoading}
      value={
        <>
          {lockedAtomTotalWallet.toLocaleString("en-US", {
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
          <strong>{lockedAtomPercentageWallet}%</strong> of{" "}
          <strong>{lockedAtomMaxWallet}</strong> max
        </>
      }
    />
  )
}
