"use client"

import { LockEntryWithPower } from "@/app/ts_types/HydroBase.types"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { EditLockupDurationModal } from "@/components/EditLockupDurationModal"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import {
  networkLimitReachedTooltip as lockupLimitReachedByNetworkTooltip,
  lockupLimitReachedByUserTooltip,
  lockupLimitTooltip,
} from "@/components/ToolTips"
import { maxLockedTokensPerAddress } from "@/contract-apis/_globals"
import { fetchWalletLockups } from "@/contract-apis/fetchWalletLockups"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useWalletVotingData } from "@/contract-apis/useWalletVotingData"
import { calculateTimeRemaining, formatAmount } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export default function LockupsPage() {
  const {
    address,
    isWalletConnected,
    maxLockedAtomGlobal: maxLockedTokensGlobal,
    totalLockedAtomGlobal: totalLockedTokensGlobal,
  } = useBackendData()

  const { data: userVotingData } = useWalletVotingData(address!)
  const [myLockups, setMyLockups] = useState<LockEntryWithPower[]>([])
  const [refetch, setRefetch] = useState(true)
  const lockedAtomInWallet = userVotingData?.lockups.lockedAtom ?? 0
  const maxLockedAtomOverall = maxLockedTokensGlobal
  const maxLockedAtomPerWallet = maxLockedTokensPerAddress ?? 0
  const percentageLockedInWallet = Math.round(
    (lockedAtomInWallet / maxLockedAtomPerWallet) * 100
  )
  const percentageLockedOverall = Math.round(
    (totalLockedTokensGlobal / maxLockedAtomOverall) * 100
  )
  const { setToasts } = useToasts()

  useEffect(() => {
    const fetchLockups = async () => {
      setToasts([
        {
          variant: "working",
          message: "Loading lockups...",
        },
      ])
      try {
        const myLockups = await fetchWalletLockups(address!)
        setMyLockups(myLockups)
      } catch (error) {
        console.log(error)
        setToasts([
          {
            variant: "error",
            message: `Error loading lockups: ${error}`,
          },
        ])
      } finally {
        setToasts([])
      }
    }

    if (address && refetch) {
      fetchLockups()
      setRefetch(false)
      return
    }
  }, [address, refetch])

  function isExpired(lockEnd: string) {
    const now = new Date().getTime()
    const end = parseInt(lockEnd) / 1000000 // Convert nanoseconds to milliseconds
    const diff = end - now
    return diff < 0
  }

  function formatDate(date: string) {
    const timestampMs = parseInt(date) / 1e6
    const dateObj = new Date(timestampMs)
    return dateObj.toISOString().split("T")[0]
  }

  if (!isWalletConnected || !address) {
    return <p>Connect your wallet to view your lockups</p>
  }

  return (
    <>
      <StatCards>
        <StatCards.TotalAtomLocked />
        <StatCards.YourTotalAtomLocked />
        <StatCards.YourVotingPower />
      </StatCards>

      <ContentContainer className="gap-6 py-12">
        <div
          className="
            flex
            flex-col
            justify-end
            gap-3
            lg:flex-row
          "
        >
          <h2 className="sr-only">Your Lockups</h2>

          <div
            className="
              flex
              flex-col
              items-end
              justify-end
              gap-6
              md:flex-row
              md:items-center
            "
          >
            <div className="flex items-center gap-4">
              <div
                className={twMerge(
                  `h-4 w-64 overflow-hidden rounded-full`,
                  percentageLockedInWallet >= 98
                    ? `bg-red-500/20`
                    : `bg-palette-beige/20`
                )}
              >
                <div
                  className={twMerge(
                    `h-full`,
                    percentageLockedInWallet >= 98
                      ? `bg-red-500`
                      : `bg-palette-beige`
                  )}
                  style={{
                    width: `${percentageLockedInWallet}%`,
                  }}
                />
              </div>

              <Tooltip tipContents={lockupLimitTooltip}>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <span
                    className={twMerge(
                      `text-sm`,
                      percentageLockedInWallet >= 98
                        ? `text-red-500`
                        : `text-palette-beige`
                    )}
                  >
                    {(lockedAtomInWallet / 1e6).toFixed(4).replace(".0000", "")}{" "}
                    / {(maxLockedAtomPerWallet / 1e6).toFixed(2)} ATOM max.
                  </span>
                  <Icon name="circle-info" />
                </div>
              </Tooltip>
            </div>

            <ConditionalWrapper
              condition={
                percentageLockedInWallet === 100 ||
                percentageLockedOverall === 100
              }
              wrapper={(children) => (
                <Tooltip
                  classNamesForTooltip="-ml-12"
                  tipContents={
                    percentageLockedInWallet === 100
                      ? lockupLimitReachedByUserTooltip
                      : lockupLimitReachedByNetworkTooltip
                  }
                >
                  <div
                    className="
                      pointer-events-none
                      cursor-not-allowed
                      opacity-50
                    "
                  >
                    {children}
                  </div>
                </Tooltip>
              )}
            >
              <StyledText as={Link} variant="button.primary" href="/lock-atom">
                New Lockup
              </StyledText>
            </ConditionalWrapper>
          </div>
        </div>

        <BlurryBackdropBox>
          {myLockups.length === 0 && (
            <EmptyBox className="flex flex-col gap-1">
              <div>
                You don&rsquo;t have any lockups yet. To create one, click the
                &ldquo;New Lockup&rdquo; button&nbsp;
                <Icon name="arrow-up-right" />
              </div>
              <div>
                <StyledText
                  as={Link}
                  variant="link"
                  href="/docs/users/locking-lsm-shares"
                  target="_blank"
                  className="flex items-center gap-1 text-xs"
                >
                  <span>Learn more about Lockups</span>{" "}
                  <Icon name="arrow-up-right-from-square" />
                </StyledText>
              </div>
            </EmptyBox>
          )}

          {myLockups.length > 0 && (
            <StyledTable
              columns={[
                {
                  key: "lockedATOM",
                  label: "Locked ATOM",
                  isSortable: true,
                },
                {
                  key: "multiplier",
                  label: "Multiplier",
                  isSortable: true,
                  textAlign: "right",
                },
                {
                  key: "votingPower",
                  label: "Voting Power",
                  isSortable: true,
                  textAlign: "right",
                },
                {
                  key: "endDate",
                  label: "End Date",
                  isSortable: true,
                  textAlign: "right",
                  customValueGetter: (row) => {
                    return row._lockup.lock_entry.lock_end
                  },
                },
                {
                  key: "actions",
                  label: "Actions",
                  textAlign: "right",
                },
              ]}
              initialSortedColumnKey="endDate"
              rows={myLockups.map((lockup, index) => {
                return {
                  _lockup: lockup,
                  lockedATOM: (
                    <>{formatAmount(lockup.lock_entry.funds.amount)} ATOM</>
                  ),
                  multiplier: (
                    <>
                      {(
                        Number(lockup.current_voting_power) /
                        Number(lockup.lock_entry.funds.amount)
                      ).toPrecision(3)}{" "}
                      &times;
                    </>
                  ),
                  votingPower: formatAmount(lockup.current_voting_power),
                  endDate: (
                    <>
                      {formatDate(lockup.lock_entry.lock_end)} (
                      {isExpired(lockup.lock_entry.lock_end) ? (
                        <Icon name="solid:triangle-exclamation" />
                      ) : (
                        calculateTimeRemaining(lockup.lock_entry.lock_end)
                      )}
                      )
                    </>
                  ),
                  actions: (
                    <EditLockupDurationModal
                      onSuccess={() => {
                        setRefetch(true)
                      }}
                      lockup={lockup}
                    />
                  ),
                }
              })}
            />
          )}
        </BlurryBackdropBox>
      </ContentContainer>
    </>
  )
}
