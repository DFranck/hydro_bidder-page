"use client"

import { useIncompleteNotices } from "@/app/(with-backend-data)/lock-atom/useIncompleteNotices"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { Card } from "@/components/Card"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { EditLockupDurationModal } from "@/components/EditLockupDurationModal"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { ProgressBar } from "@/components/ProgressBar"
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
import { executeWalletUnlockExpired } from "@/contract-apis/executeWalletUnlockExpired"
import { SanitizedLockup } from "@/contract-apis/fetchBackendDataAfterWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { getDaysAway } from "@/lib/getDaysAway"
import { getTimeUntilDate } from "@/lib/getTimeUntilDate"
import { pluralize } from "@/lib/pluralize"
import { preventOrphans } from "@/lib/preventOrphans"
import { revalidateTag } from "@/lib/revalidateTag"
import { useChain } from "@cosmos-kit/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { twJoin, twMerge } from "tailwind-merge"

export default function LockupsPage() {
  const { incompleteNotices } = useIncompleteNotices()
  const router = useRouter()
  const [isConfirmingUnlockExpired, setIsConfirmingUnlockExpired] =
    useState(false)
  const [isShowingNextStep, setIsShowingNextStep] = useState(false)
  const {
    address,
    bidsById,
    currentRoundId,
    currentRoundEndDate,
    lockups,
    lockedAtomMaxWallet,
    lockedAtomPercentageGlobal,
    lockedAtomPercentageWallet,
    lockedAtomTotalWallet,
  } = useBackendData()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const { setToasts } = useToasts()
  const expiredLockups = lockups.filter(
    (lockup) => new Date() >= lockup.dateEnd
  )
  const [editingLockup, setEditingLockup] = useState<SanitizedLockup | null>(
    null
  )
  const [isEditingLockup, setIsEditingLockup] = useState(false)

  async function handleClickToNextUnlockingStep() {
    router.push("/lock-atom")
    router.refresh()
  }

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

    try {
      setToasts([
        {
          variant: "working",
          message: `Unlocking ${pluralizedLockupText}...`,
        },
      ])

      await executeWalletUnlockExpired({
        address,
        getSigningCosmWasmClient,
        lockIds: expiredLockups.map((lockup) => lockup.id),
      })

      await revalidateTag("backendData")

      setToasts([
        {
          variant: "info",
          message: `${pluralizedLockupText} unlocked successfully. See next step!`,
        },
      ])

      setIsShowingNextStep(true)
    } catch (error) {
      setToasts([
        {
          variant: "error",
          message: `Error unlocking ${pluralizedLockupText}: ${error}`,
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
        <StatCards.CurrentRoundAtomLockedGlobal />
        <StatCards.CurrentRoundAtomLockedWallet />
        <StatCards.CurrentRoundVotingPowerWallet />
      </StatCards>

      <ContentContainer className="gap-6 py-6">
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
            <Tooltip
              tipContents={lockupLimitTooltip}
              className="block w-96 shrink-0"
            >
              <ProgressBar
                percentage={lockedAtomPercentageWallet}
                warningZone={(percentage) => percentage >= 75}
                dangerZone={(percentage) => percentage >= 95}
              >
                <div className="flex items-center gap-1">
                  <span>
                    {lockedAtomTotalWallet.toFixed(4).replace(".0000", "")} /{" "}
                    {lockedAtomMaxWallet} ATOM max
                  </span>
                  <span>
                    <Icon name="circle-info" />
                  </span>
                </div>
              </ProgressBar>
            </Tooltip>

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
                lockedAtomPercentageWallet === 100 ||
                lockedAtomPercentageGlobal === 100
              }
              wrapper={(children) => (
                <Tooltip
                  classNamesForTooltip="-ml-12"
                  tipContents={
                    lockedAtomPercentageWallet === 100
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

        <BlurryBackdropBox className="flex flex-col gap-6">
          <StyledTable
            initialSortedColumnKey="timeLeft"
            columns={[
              {
                key: "amount",
                label: "Amount",
                isSortable: true,
              },
              {
                key: "votingPower",
                label: "Voting Power",
                isSortable: true,
                textAlign: "center",
              },
              {
                key: "timeLeft",
                label: "Time Left",
                isSortable: true,
                textAlign: "center",
                customValueGetter: (row) => {
                  return row._lockup.daysLeft ?? 0
                },
              },
              {
                key: "status",
                label: "Status",
              },
              {
                key: "actions",
                label: "Actions",
                textAlign: "right",
              },
            ]}
            rows={lockups.map((lockup) => {
              const isLocked = true // one day we might render lockups in limbo
              const votedOnBidId =
                Object.values(lockup.metaDataByTrancheId).find(
                  (trancheInfo) => trancheInfo.votedOnBidId !== null
                )?.votedOnBidId ?? null
              const hasVoted = votedOnBidId !== null
              const votedOnBid = votedOnBidId ? bidsById[votedOnBidId] : null
              const hasDeployed = !!votedOnBid?.liquidityDeployment
              const isExpired = new Date() > lockup.dateEnd
              const daysLeft = getDaysAway(lockup.dateEnd)
              const roundsLeftOnDeployment =
                votedOnBid?.liquidityDeployment?.remainingRounds ?? -1

              const {
                editLockupButtonLabel = null,
                statusTopline,
                statusBottomline = null,
                statusExplanation,
              } = hasDeployed
                ? {
                    statusTopline: "Tied to bid deployment",
                    statusBottomline:
                      roundsLeftOnDeployment > 0
                        ? `${roundsLeftOnDeployment} rounds left`
                        : roundsLeftOnDeployment === 0
                          ? "Deployment ends with current round"
                          : "Deployment complete",
                    statusExplanation: (
                      <>
                        This lockup is currently tied to the bid above, which
                        may or may not receive a deployment of some amount when
                        the round ends.
                      </>
                    ),
                  }
                : hasVoted
                  ? {
                      statusTopline: "Voted for bid in current round",
                      statusBottomline: `${getTimeUntilDate(currentRoundEndDate)} left in round`,
                      statusExplanation: (
                        <>
                          This lockup is currently tied to the bid above in the
                          current round
                        </>
                      ),
                    }
                  : isExpired
                    ? {
                        editLockupButtonLabel: "Refresh",
                        statusTopline: `Expired ${pluralize({
                          count: Math.abs(daysLeft),
                          prefixCount: true,
                          singular: "day",
                        })} ago`,
                        statusBottomline: (
                          <>You can refresh this lockup, or unlock it</>
                        ),
                        statusExplanation: (
                          <>
                            This lockup has expired and is no longer eligible to
                            vote.
                          </>
                        ),
                      }
                    : {
                        statusTopline: "Eligible to vote",
                        statusExplanation: (
                          <>
                            This lockup is eligible to vote in the current
                            round.
                          </>
                        ),
                      }

              return {
                _lockup: { ...lockup, daysLeft },

                amount: (
                  <>
                    {formatAmount(lockup.funds.amount * 1e6, undefined, 6)}{" "}
                    <StyledText variant="footnote">ATOM</StyledText>
                  </>
                ),

                votingPower: formatAmount(lockup.currentVotingPower),

                timeLeft:
                  daysLeft <= 0 ? (
                    <Icon name="solid:triangle-exclamation" />
                  ) : (
                    pluralize({
                      count: daysLeft,
                      prefixCount: true,
                      singular: "day",
                    })
                  ),

                status: (
                  <Tooltip
                    className="whitespace-nowrap"
                    classNamesForTooltip="w-80"
                    tipContents={
                      <div className="flex flex-col gap-2">
                        {!isExpired && (
                          <div
                            className={twJoin(
                              "grid grid-cols-3",
                              "-mx-4 -mt-2", // negate padding from Tooltip
                              "bg-palette-green/5"
                            )}
                          >
                            {(
                              [
                                ["locked", isLocked],
                                ["voted", hasVoted],
                                ["deployed", hasDeployed],
                              ] as const
                            ).map(([status, isActive]) => (
                              <div
                                key={status}
                                className={twMerge(
                                  "flex items-center justify-center gap-1",
                                  "px-3 py-2",
                                  "text-xs font-bold uppercase",
                                  isActive
                                    ? "bg-palette-green/10 text-palette-green"
                                    : "text-white/30"
                                )}
                              >
                                <Icon
                                  name={
                                    isActive
                                      ? "solid:check"
                                      : "solid:circle-dashed"
                                  }
                                />
                                {status}
                              </div>
                            ))}
                          </div>
                        )}

                        {hasVoted && votedOnBid && (
                          <div className="flex flex-col">
                            <StyledText variant="label">
                              Voted for bid:
                            </StyledText>
                            <StyledText
                              as="a"
                              variant="link"
                              href={`/bids/${votedOnBidId}`}
                              target="_blank"
                            >
                              {preventOrphans({
                                text: votedOnBid.title,
                                numWordsToWrap: 1,
                                append: (
                                  <Icon name="arrow-up-right-from-square" />
                                ),
                              })}
                            </StyledText>
                          </div>
                        )}

                        {statusExplanation}
                      </div>
                    }
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        {statusTopline}
                        <Icon name="circle-info" />
                      </div>
                      {statusBottomline && (
                        <StyledText variant="footnote">
                          {statusBottomline}
                        </StyledText>
                      )}
                    </div>
                  </Tooltip>
                ),

                actions: (
                  <StyledText
                    as="button"
                    variant="button.secondary"
                    onClick={() => {
                      setIsEditingLockup(true)
                      setEditingLockup(lockup)
                    }}
                  >
                    {editLockupButtonLabel ?? "Edit Lockup"}
                  </StyledText>
                ),
              }
            })}
            slotAfterHeaderRow={
              incompleteNotices.length > 0 && (
                <tr>
                  <td colSpan={99}>
                    <div
                      className={twJoin(
                        "flex items-center justify-center gap-1",
                        "rounded px-3 py-2",
                        "bg-palette-beige text-palette-text",
                        "text-xs"
                      )}
                    >
                      <Icon name="solid:triangle-exclamation" />
                      <span>
                        You have <strong>{incompleteNotices.length}</strong>{" "}
                        incomplete{" "}
                        {pluralize({
                          count: incompleteNotices.length,
                          singular: "lockup",
                        })}
                        .
                      </span>
                      <StyledText variant="link" className="text-palette-text">
                        Continue Locking <Icon name="solid:arrow-right-long" />
                      </StyledText>
                    </div>
                  </td>
                </tr>
              )
            }
            slotAfterLastRow={
              lockups.length === 0 && (
                <tr>
                  <td colSpan={99}>
                    <EmptyBox className="flex flex-col gap-1">
                      <div>
                        You don&rsquo;t have any lockups yet. To create one,
                        click the &ldquo;New Lockup&rdquo; button&nbsp;
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
                  </td>
                </tr>
              )
            }
          />
        </BlurryBackdropBox>
      </ContentContainer>

      <EditLockupDurationModal
        lockup={editingLockup}
        isOpen={isEditingLockup}
        onClose={() => setIsEditingLockup(false)}
        onCloseComplete={() => setEditingLockup(null)}
      />

      <ModalWindow
        isOpen={isConfirmingUnlockExpired}
        onClose={handleModalWindowClose}
      >
        <Card>
          <Card.Header>Refresh Lockups you Want to Keep</Card.Header>
          <Card.Body>
            <p>
              Before proceeding to unlock, be sure to refresh any lockups that
              you want to keep. If you do not refresh before proceeding you will
              be unlocking all of your lockups and will lose all of your voting
              power.
            </p>
            <p>
              Unlock{" "}
              {pluralize({
                count: expiredLockups.length,
                prefixCount: true,
                singular: "expired lockup",
              })}
              ?
            </p>
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

      <ModalWindow
        isOpen={isShowingNextStep}
        onClose={() => setIsShowingNextStep(false)}
      >
        <Card>
          <Card.Header>Unlocked! Next, Revert</Card.Header>
          <Card.Body>
            <p>You will now be able to revert your lockups on the next step:</p>
          </Card.Body>
          <Card.Footer>
            <StyledText
              as="button"
              variant="button.primary"
              onClick={handleClickToNextUnlockingStep}
              className="flex items-center gap-1"
            >
              <span>Show Revertible Lockups</span>
              <Icon name="arrow-right-long" />
            </StyledText>
          </Card.Footer>
        </Card>
      </ModalWindow>
    </>
  )
}
