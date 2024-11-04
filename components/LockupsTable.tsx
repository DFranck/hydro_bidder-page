"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { LockEntryWithPower } from "@/app/ts_types/HydroBase.types"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { EditLockupDurationModal } from "@/components/EditLockupDurationModal"
import { Icon } from "@/components/Icon"
import { PrettyTable } from "@/components/PrettyTable"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { fetchMyAllLockups, useUserVotingData, Validator } from "@/hooks/hooks"
import { calculateTimeRemaining, formatAmount } from "@/lib/utils"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { ExtendedHttpEndpoint } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export function LockupsTable({
  validatorMap,
}: {
  validatorMap: Map<string, Validator>
}) {
  const {
    isWalletConnected,
    address,
    getSigningCosmWasmClient,
    getRestEndpoint,
  } = useChain("neutron")

  return (
    <>
      {isWalletConnected && address ? (
        <Lockups
          walletAddress={address}
          getSigningCosmWasmClient={getSigningCosmWasmClient}
          validatorMap={validatorMap}
          getRestEndpoint={getRestEndpoint}
        />
      ) : (
        <p>Connect your wallet to view your lockups</p>
      )}
    </>
  )
}

function Lockups({
  walletAddress,
  getSigningCosmWasmClient,
  validatorMap,
  getRestEndpoint,
}: {
  walletAddress: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
  validatorMap: Map<string, Validator>
  getRestEndpoint: () => Promise<string | ExtendedHttpEndpoint>
}) {
  const {
    globalState: {
      constants: { max_locked_tokens_per_address = 0 },
    },
  } = useAppContext()
  const { data: userVotingData } = useUserVotingData(walletAddress)
  const [myLockups, setMyLockups] = useState<LockEntryWithPower[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refetch, setRefetch] = useState(false)
  const lockedAtom = userVotingData?.lockups.lockedAtom ?? 0
  const maxLockedTokens = max_locked_tokens_per_address ?? 1
  const lockedPercentage = Math.min((lockedAtom / maxLockedTokens) * 100, 100)

  useEffect(() => {
    const fetchLockups = async () => {
      try {
        const myLockups = await fetchMyAllLockups(walletAddress)
        setMyLockups(myLockups)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (walletAddress && refetch) {
      fetchLockups()
      setRefetch(false)
      return
    }

    if (walletAddress) {
      fetchLockups()
    }
  }, [walletAddress, refetch])

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
                  lockedPercentage >= 98
                    ? "bg-red-500/20"
                    : "bg-palette-beige/20"
                )}
              >
                <div
                  className={twMerge(
                    "h-full",
                    lockedPercentage >= 98 ? "bg-red-500" : "bg-palette-beige"
                  )}
                  style={{
                    width: `${lockedPercentage}%`,
                  }}
                />
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={twMerge(
                    `
                      text-sm
                    `,
                    lockedPercentage >= 98
                      ? "text-red-500"
                      : "text-palette-beige"
                  )}
                >
                  {(lockedAtom / 1e6).toFixed(2)} /{" "}
                  {(maxLockedTokens / 1e6).toFixed(2)} ATOM max.
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
              condition={lockedPercentage >= 85}
              wrapper={(children) => (
                <Tooltip
                  classNamesForTooltip="-ml-12"
                  tipContents="You&rsquo;ve reached the maximum locked tokens"
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
          <PrettyTable
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
                    validatorMap={validatorMap}
                    onSuccess={() => {
                      setRefetch(true)
                    }}
                    lockup={lockup}
                    walletAddress={walletAddress}
                    getSigningCosmWasmClient={getSigningCosmWasmClient}
                    getRestEndpoint={getRestEndpoint}
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
