"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { Card } from "@/components/Card"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { EditLockupDurationModal } from "@/components/EditLockupDurationModal"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
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
import { executeWalletUnlockExpired } from "@/contract-apis/executeWalletUnlockExpired"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { getTimeUntilDate } from "@/lib/getTimeUntilDate"
import { pluralize } from "@/lib/pluralize"
import { useChain } from "@cosmos-kit/react"
import Link from "next/link"
import { useState } from "react"
import { twMerge } from "tailwind-merge"

export default function LockupsPage() {
  const [isConfirmingUnlockExpired, setIsConfirmingUnlockExpired] =
    useState(false)
  const {
    address,
    lockups,
    maxLockedAtomGlobal,
    totalLockedAtomGlobal,
    totalLockedAtomUser,
  } = useBackendData()
  const maxLockedAtomOverall = maxLockedAtomGlobal
  const maxLockedAtomPerWallet = maxLockedTokensPerAddress ?? 0
  const percentageLockedInWallet = Math.round(
    (totalLockedAtomUser / maxLockedAtomPerWallet) * 100
  )
  const percentageLockedOverall = Math.round(
    (totalLockedAtomGlobal / maxLockedAtomOverall) * 100
  )
  const { getSigningCosmWasmClient } = useChain("neutron")
  const { setToasts } = useToasts()
  const expiredLockups = lockups.filter((lockup) => new Date() > lockup.dateEnd)

  function handleClickUnlockExpired() {
    setIsConfirmingUnlockExpired(true)
  }

  async function executeUnlockExpired() {
    if (expiredLockups.length === 0) {
      return
    }

    setIsConfirmingUnlockExpired(false)

    const pluralizedLockupText = pluralize({
      count: expiredLockups.length,
      prefixCount: true,
      singular: "expired lockup",
    })

    setToasts([
      {
        message: `Unlocking ${pluralizedLockupText}...`,
        variant: "working",
      },
    ])

    try {
      await executeWalletUnlockExpired({
        address,
        getSigningCosmWasmClient,
      })

      setToasts([
        {
          message: `${pluralizedLockupText} unlocked successfully`,
          variant: "success",
        },
      ])
    } catch (error) {
      setToasts([
        {
          message: `Error unlocking ${pluralizedLockupText}: ${error}`,
          variant: "error",
        },
      ])
    }
  }

  function handleModalWindowClose() {
    setIsConfirmingUnlockExpired(false)
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
                    {(totalLockedAtomUser / 1e6)
                      .toFixed(4)
                      .replace(".0000", "")}{" "}
                    / {(maxLockedAtomPerWallet / 1e6).toFixed(2)} ATOM max.
                  </span>
                  <Icon name="circle-info" />
                </div>
              </Tooltip>
            </div>

            {expiredLockups.length > 0 && (
              <StyledText
                as="button"
                variant="button.secondary"
                className="flex items-center gap-1"
                onClick={handleClickUnlockExpired}
              >
                <Icon name="solid:lock-open" />
                Unlock {expiredLockups.length} Expired
              </StyledText>
            )}

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
          {lockups.length === 0 && (
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

          {lockups.length > 0 && (
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
                    return row._lockup.dateEnd?.getTime() ?? 0
                  },
                },
                {
                  key: "actions",
                  label: "Actions",
                  textAlign: "right",
                },
              ]}
              initialSortedColumnKey="endDate"
              rows={lockups.map((lockup) => {
                return {
                  _lockup: lockup,
                  lockedATOM: <>{lockup.funds.amount} ATOM</>,
                  multiplier: <>{lockup.multiplier.toPrecision(3)} &times;</>,
                  votingPower: formatAmount(lockup.currentVotingPower),
                  endDate: (
                    <div className="inline-flex items-center gap-1">
                      {new Date() > lockup.dateEnd && (
                        <Icon name="solid:triangle-exclamation" />
                      )}
                      {lockup.dateEnd.toLocaleString("en", {
                        dateStyle: "medium",
                      })}{" "}
                      ({getTimeUntilDate(lockup.dateEnd)})
                    </div>
                  ),
                  actions: <EditLockupDurationModal lockup={lockup} />,
                }
              })}
            />
          )}
        </BlurryBackdropBox>
      </ContentContainer>

      <ModalWindow
        isOpen={isConfirmingUnlockExpired}
        onClose={handleModalWindowClose}
      >
        <Card>
          <Card.Body>
            <div>
              Refresh any lockups you want to keep before proceeding. Unlock{" "}
              {pluralize({
                count: expiredLockups.length,
                prefixCount: true,
                singular: "expired lockup",
              })}
              ?
            </div>
          </Card.Body>
          <Card.Footer>
            <StyledText
              as="button"
              variant="button.primary"
              onClick={executeUnlockExpired}
            >
              Unlock
            </StyledText>
            <StyledText
              as="button"
              variant="button.secondary"
              onClick={() => setIsConfirmingUnlockExpired(false)}
            >
              Cancel
            </StyledText>
          </Card.Footer>
        </Card>
      </ModalWindow>
    </>
  )
}
