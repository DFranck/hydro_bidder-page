"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import {
  yourTotalTokenLockedTooltip,
} from "@/components/ToolTips"
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
        <Tooltip
          tipContents={yourTotalTokenLockedTooltip({
            atomLockedTotal: lockedAtomTotalWallet,
            dAtomLockedTotal: 0,
            stAtomLockedTotal: 0,
          })}
          classNamesForTooltip="w-80"
          className="w-full"
        >
          Your Locked{" "}
          <span className="inline-flex items-center gap-1">
            Tokens
            <Icon name="circle-info" />
          </span>
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
