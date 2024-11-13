"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { LockEntryWithPower } from "@/app/ts_types/HydroBase.types"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { EditLockupDurationModal } from "@/components/EditLockupDurationModal"
import { Icon } from "@/components/Icon"
import { StyledTable } from "@/components/StyledTable"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import { networkLimitReachedTooltip } from "@/components/ToolTips"
import { fetchMyAllLockups, useUserVotingData } from "@/hooks/hooks"
import { calculateTimeRemaining, formatAmount } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export function LockupsTable() {
  const { address, isWalletConnected } = useChain("neutron")

  return (
    <>
      {isWalletConnected && address ? (
        <Lockups />
      ) : (
        <p>Connect your wallet to view your lockups</p>
      )}
    </>
  )
}

function Lockups() {
  const {
    globalState: {
      constants: { max_locked_tokens, max_locked_tokens_per_address },
      totalLockedTokens: atomLockedOverall,
    },
  } = useAppContext()
  const { address } = useChain("neutron")
  const { data: userVotingData } = useUserVotingData(address!)
  const [myLockups, setMyLockups] = useState<LockEntryWithPower[]>([])
  const [refetch, setRefetch] = useState(true)
  const lockedAtomInWallet = userVotingData?.lockups.lockedAtom ?? 0
  const maxLockedAtomOverall = max_locked_tokens ?? 0
  const maxLockedAtomPerWallet = max_locked_tokens_per_address ?? 0
  const percentageLockedInWallet = Math.round(
    (lockedAtomInWallet / maxLockedAtomPerWallet) * 100
  )
  const percentageLockedOverall = Math.round(
    (atomLockedOverall / maxLockedAtomOverall) * 100
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
        const myLockups = await fetchMyAllLockups(address!)
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

  return (
    <div>
      <div
        className="
          -mx-3
          overflow-hidden
          rounded-md
          bg-palette-text/20
          px-3
          backdrop-blur-md
        "
      >
        <div
          className="
            flex
            flex-col
            justify-between
            gap-3
            p-5
            lg:flex-row
          "
        >
          <StyledText as="h2" variant="h3">
            Your Lockups
          </StyledText>

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
                  "h-4 w-64 overflow-hidden rounded-full",
                  percentageLockedInWallet >= 98
                    ? "bg-red-500/20"
                    : "bg-palette-beige/20"
                )}
              >
                <div
                  className={twMerge(
                    "h-full",
                    percentageLockedInWallet >= 98
                      ? "bg-red-500"
                      : "bg-palette-beige"
                  )}
                  style={{
                    width: `${percentageLockedInWallet}%`,
                  }}
                />
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={twMerge(
                    `
                      text-sm
                    `,
                    percentageLockedInWallet >= 98
                      ? "text-red-500"
                      : "text-palette-beige"
                  )}
                >
                  {(lockedAtomInWallet / 1e6).toFixed(4)} /{" "}
                  {(maxLockedAtomPerWallet / 1e6).toFixed(2)} ATOM max.
                </span>

                <Tooltip
                  tipContents={
                    <>
                      For the pilot round, there is a maximum limit of ATOM you
                      can lockup.{" "}
                      <a
                        href="/docs#pilot-rounds"
                        className="inline-flex items-center gap-1 text-palette-green underline"
                      >
                        Learn More
                        <Icon name="solid:arrow-up-right" />
                      </a>
                    </>
                  }
                />
              </div>
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
                      ? "You&rsquo;ve reached the maximum locked tokens"
                      : networkLimitReachedTooltip
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

        {myLockups.length === 0 && (
          <div
            className="
              !mb-6
              rounded-md
              border
              border-dashed
              border-palette-beige/20
              py-12
              text-center
              text-xs
              text-white/60
            "
          >
            <p>
              You don&rsquo;t have any lockups. Use the &ldquo;New Lockup&rdquo;
              button on the page to add one.
            </p>
          </div>
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
      </div>
    </div>
  )
}
