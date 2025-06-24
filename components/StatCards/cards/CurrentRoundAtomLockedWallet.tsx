"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { yourTotalTokenLockedTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { StatCard } from "../StatCard"
import { formatAmountToUsd } from "@/lib/amountToUSDString"

export function CurrentRoundAtomLockedWallet() {
  const {
    lockedAtomTotalWalletStat,
    isLoading,
    atomPrice,
    stAtomPrice,
    dAtomPrice,
  } = useBackendData()

  return (
    <StatCard
      isLoading={isLoading}
      value={
        <>
          {lockedAtomTotalWalletStat.toLocaleString("en-US", {
            maximumFractionDigits: 4,
          })}
        </>
      }
      title={
        <Tooltip
          tipContents={yourTotalTokenLockedTooltip({
            atomLockedTotal: {
              amount: lockedAtomTotalWalletStat,
              usdAmount: formatAmountToUsd(lockedAtomTotalWalletStat, atomPrice),
            },
            dAtomLockedTotal: {
              amount: 0,
              usdAmount: formatAmountToUsd(0, dAtomPrice),
            },
            stAtomLockedTotal: {
              amount: 0,
              usdAmount: formatAmountToUsd(0, stAtomPrice),
            },
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
    />
  )
}
