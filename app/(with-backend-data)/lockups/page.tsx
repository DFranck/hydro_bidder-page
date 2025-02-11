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
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import {
  networkLimitReachedTooltip as lockupLimitReachedByNetworkTooltip,
  lockupLimitReachedByUserTooltip,
  lockupLimitTooltip,
  lockupsTableTimeLeftColumnTooltip,
  lockupsTableVotingAndMultiplierColumnTooltip,
  needsWalletConnectionTooltip,
} from "@/components/ToolTips"
import { WordWrapper } from "@/components/WordWrapper"
import { executeWalletUnlockExpired } from "@/contract-apis/executeWalletUnlockExpired"
import { SanitizedLockup } from "@/contract-apis/fetchWalletLockups"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { getTimeUntilDate } from "@/lib/getTimeUntilDate"
import { pluralize } from "@/lib/pluralize"
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
    currentRoundEndDate,
    isWalletConnected,
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
  const [lockupBeingEdited, setLockupBeingEdited] =
    useState<SanitizedLockup | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const columnDescriptors = [
    {
      key: "amount",
      label: "Amount",
      isSortable: true,
    },
    {
      key: "votingPower",
      label: (
        <Tooltip
          tipContents={lockupsTableVotingAndMultiplierColumnTooltip}
          className="flex items-center gap-1"
        >
          <span>Voting Power / Multiplier</span>
          <Icon name="circle-info" />
        </Tooltip>
      ),
      isSortable: true,
      textAlign: "center",
    },
    {
      key: "timeLeft",
      label: (
        <Tooltip
          tipContents={lockupsTableTimeLeftColumnTooltip}
          className="flex items-center gap-1"
        >
          <span>Time Left</span>
          <Icon name="circle-info" />
        </Tooltip>
      ),
      isSortable: true,
      textAlign: "center",
      customValueGetter: (row) => {
        return row._lockup.daysLeft ?? 0
      },
    },
    {
      key: "status",
      label: "Status",
      isSortable: true,
      initialSortDirection: "asc",
      customValueGetter: (row) => {
        const { isEligibleThisRoundAtAll, isExpired, isTiedToDeployment } =
          row._lockup

        return isEligibleThisRoundAtAll
          ? 0
          : isExpired
            ? 1
            : isTiedToDeployment
              ? 2
              : 3
      },
    },
    {
      key: "actions",
      label: "Actions",
      textAlign: "right",
    },
  ] as ColumnObject<
    (typeof lockupsAsRows)[number],
    keyof (typeof lockupsAsRows)[number]
  >[]

  const lockupsAsRows = lockups.map((lockup) => {
    const {
      daysLeft,
      isEligibleToChangeVote,
      isExpired,
      isTiedToDeployment,
      numRoundsLeftOnDeployment,
      votedOnBidId,
    } = lockup

    const votedOnBid = votedOnBidId ? bidsById[votedOnBidId] : null

    const {
      editLockupButtonLabel = null,
      statusTopline,
      statusBottomline = null,
      statusExplanation,
      statusIcon,
    } = isExpired
      ? {
          editLockupButtonLabel: "Refresh",
          statusIcon: (
            <Icon
              name="solid:triangle-exclamation"
              className="text-palette-red"
            />
          ),
          statusTopline:
            Math.abs(daysLeft) === 0
              ? "Expired today"
              : `Expired ${pluralize({
                  count: Math.abs(daysLeft),
                  prefixCount: true,
                  singular: "day",
                })} ago`,
          statusBottomline: <>You can refresh this lockup, or unlock it</>,
          statusExplanation: (
            <>This lockup has expired and is no longer eligible to vote.</>
          ),
        }
      : isTiedToDeployment
        ? {
            statusIcon: (
              <Icon name="solid:lock" className="text-palette-beige" />
            ),
            statusTopline: "Tied to bid deployment",
            statusBottomline:
              numRoundsLeftOnDeployment === 1
                ? "Ends with this round"
                : `${pluralize({
                    count: numRoundsLeftOnDeployment,
                    prefixCount: true,
                    singular: "round",
                  })} left`,
            statusExplanation: (
              <>This lockup is currently tied to a deployment.</>
            ),
          }
        : isEligibleToChangeVote
          ? {
              statusIcon: (
                <Icon
                  name="solid:circle-check"
                  className="text-palette-green"
                />
              ),
              statusTopline: "Voted for bid in current round",
              statusBottomline: `${getTimeUntilDate(currentRoundEndDate)} left in round`,
              statusExplanation: (
                <>
                  This lockup is currently tied to the bid above in the current
                  round, but you can still change your vote.
                </>
              ),
            }
          : {
              statusIcon: (
                <Icon
                  name="solid:circle-check"
                  className="text-palette-green"
                />
              ),
              statusTopline: "Eligible to vote",
              statusExplanation: (
                <span>
                  This lockup is eligible to vote in the current round.{" "}
                  <StyledText variant="link" href="/bids" as={Link}>
                    Browse Bids
                  </StyledText>
                </span>
              ),
            }

    const statusTooltip = (
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
                ["locked", true],
                ["voted", isEligibleToChangeVote || isTiedToDeployment],
                ["deployed", isTiedToDeployment],
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
                <Icon name={isActive ? "solid:check" : "solid:circle-dashed"} />
                {status}
              </div>
            ))}
          </div>
        )}

        {votedOnBid && (
          <div className="flex flex-col">
            <StyledText variant="label">Voted for bid:</StyledText>
            <StyledText
              as="a"
              variant="link"
              href={`/bids/${votedOnBidId}`}
              target="_blank"
            >
              <WordWrapper
                words={votedOnBid.title}
                sliceStart={-2}
                wrapper={(words) => (
                  <span className="whitespace-nowrap">
                    {words}
                    <Icon name="arrow-up-right-from-square" />
                  </span>
                )}
              />
            </StyledText>
          </div>
        )}

        {statusExplanation}
      </div>
    )

    return {
      _lockup: { ...lockup, daysLeft },

      amount: (
        <>
          {formatAmount(lockup.funds.amount * 1e6, undefined, 6)}{" "}
          <StyledText variant="footnote">ATOM</StyledText>
        </>
      ),

      votingPower: (
        <div>
          <div>{formatAmount(lockup.currentVotingPower)}</div>
          {!!lockup.multiplier && (
            <StyledText variant="footnote">
              {lockup.multiplier}&times;
            </StyledText>
          )}
        </div>
      ),

      timeLeft:
        daysLeft <= 0 ? (
          <>Expired</>
        ) : (
          pluralize({
            count: daysLeft,
            prefixCount: true,
            singular: "day",
          })
        ),

      status: (
        <Tooltip
          className="flex gap-3 whitespace-nowrap"
          classNamesForTooltip="w-80"
          tipContents={statusTooltip}
        >
          {statusIcon}
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              {statusTopline}
              <Icon name="circle-info" />
            </div>
            {statusBottomline && (
              <StyledText variant="footnote">{statusBottomline}</StyledText>
            )}
          </div>
        </Tooltip>
      ),

      actions: (
        <StyledText
          as="button"
          variant="button.secondary"
          className={twJoin(
            lockup.isExpired
              ? "border-palette-red text-palette-red"
              : lockup.isTiedToDeployment
                ? "border-palette-beige text-palette-beige"
                : undefined
          )}
          onClick={() => {
            setIsEditModalOpen(true)
            setLockupBeingEdited(lockup)
          }}
        >
          {editLockupButtonLabel ?? "Edit"}
        </StyledText>
      ),
    }
  })

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

    try {
      setToasts([toastMessages.unlockingExpiredLockups(expiredLockups.length)])

      await executeWalletUnlockExpired({
        address,
        getSigningCosmWasmClient,
        lockIds: expiredLockups.map((lockup) => lockup.id),
      })

      await revalidateTag("backendData")

      setToasts([toastMessages.unlockingExpiredLockups(expiredLockups.length)])

      setIsShowingNextStep(true)
    } catch (error) {
      setToasts([
        toastMessages.unlockingExpiredLockupsError(
          expiredLockups.length,
          error as Error
        ),
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
            items-center
            justify-between
            gap-3
            lg:flex-row
          "
        >
          <h2 className="sr-only">Your Lockups</h2>

          <Tooltip
            tipContents={lockupLimitTooltip}
            className="block w-96 shrink-0"
          >
            <ProgressBar
              percentage={lockedAtomPercentageWallet}
              warningZone={(percentage) => percentage >= 75}
              dangerZone={(percentage) => percentage >= 95}
            >
              <div className="flex items-center gap-1 opacity-60">
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

          <div
            className="
              flex
              flex-col
              items-end
              justify-between
              gap-6
              md:flex-row
              md:items-center
            "
          >
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
                !isWalletConnected ||
                lockedAtomPercentageWallet === 100 ||
                lockedAtomPercentageGlobal === 100
              }
              wrapper={(children) => (
                <Tooltip
                  classNamesForTooltip="-ml-12"
                  tipContents={
                    !isWalletConnected
                      ? needsWalletConnectionTooltip
                      : lockedAtomPercentageWallet === 100
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
          {lockups.length === 0 ? (
            <EmptyBox className="flex flex-col gap-1">
              {!isWalletConnected ? (
                <>
                  Stake to lock. Lock to vote. Vote to earn. Connect your wallet
                  to get started!
                </>
              ) : (
                <div>
                  You don&rsquo;t have any lockups yet. To create one, click the
                  &ldquo;New Lockup&rdquo; button&nbsp;
                  <Icon name="arrow-up-right" />
                </div>
              )}
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
          ) : (
            <StyledTable
              columns={columnDescriptors}
              rows={lockupsAsRows}
              initialSortedColumnKey="status"
              renderRow={({ children, row, rowProps }) => {
                const {
                  isExpired,
                  isEligibleThisRoundAtAll,
                  isTiedToDeployment,
                } = row._lockup

                return (
                  <tr
                    className={twMerge(
                      rowProps.className,
                      isExpired && "[&_td]:bg-palette-red/20",
                      isTiedToDeployment &&
                        "opacity-60 transition-opacity hover:opacity-100",
                      isEligibleThisRoundAtAll && "[&_td]:bg-palette-green/20"
                    )}
                    key={row._lockup.id}
                    {...rowProps}
                  >
                    {children}
                  </tr>
                )
              }}
              slotAfterHeaderRow={
                incompleteNotices.length > 0 && (
                  <tr>
                    <td colSpan={99}>
                      <div
                        className={twJoin(
                          "flex items-center justify-center gap-1",
                          "rounded px-3 py-2",
                          "text-palette-white bg-palette-red",
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
                        <StyledText
                          as={Link}
                          variant="link"
                          className="text-palette-white"
                          href="/lock-atom"
                        >
                          Continue Locking{" "}
                          <Icon name="solid:arrow-right-long" />
                        </StyledText>
                      </div>
                    </td>
                  </tr>
                )
              }
            />
          )}
        </BlurryBackdropBox>
      </ContentContainer>

      <EditLockupDurationModal
        lockup={lockupBeingEdited}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCloseComplete={() => setLockupBeingEdited(null)}
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
