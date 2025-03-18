"use client"

import { useIncompleteNotices } from "@/app/(with-backend-data)/lock-atom/useIncompleteNotices"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { Card } from "@/components/Card"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { EditLockupDurationModal } from "@/components/EditLockupDurationModal"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { LockupStatus } from "@/components/LockupStatus"
import { ModalWindow } from "@/components/ModalWindow"
import { ProgressBar } from "@/components/ProgressBar"
import { StatCards } from "@/components/StatCards"
import { StyledTable, TD, TR } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import {
  lockupLimitReachedByNetworkTooltip,
  lockupLimitReachedByUserTooltip,
  lockupLimitTooltip,
  lockupsTableTimeLeftColumnTooltip,
  needsWalletConnectionTooltip,
} from "@/components/ToolTips"
import { executeWalletUnlockExpired } from "@/contract-apis/executeWalletUnlockExpired"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { pluralize } from "@/lib/pluralize"
import { revalidateTag } from "@/lib/revalidateTag"
import { useChain } from "@cosmos-kit/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { twJoin, twMerge } from "tailwind-merge"

export default function LockupsPage() {
  const { incompleteNotices } = useIncompleteNotices()
  const router = useRouter()
  const [isConfirmingUnlockExpired, setIsConfirmingUnlockExpired] =
    useState(false)
  const [isShowingNextStep, setIsShowingNextStep] = useState(false)
  const {
    address,
    isWalletConnected,
    lockups,
    lockedAtomMaxWallet,
    lockedAtomPercentageGlobal,
    lockedAtomPercentageWallet,
    lockedAtomTotalWallet,
    tranches,
  } = useBackendData()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const { setToasts, addToast } = useToasts()
  const expiredLockups = lockups.filter(
    (lockup) => new Date() >= lockup.dateEnd
  )
  const [lockupBeingEdited, setLockupBeingEdited] =
    useState<AugmentedLockup | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const statusColumnDescriptors = tranches.map(({ id, name }) => ({
    key: `trancheStatus${id}` as const,
    label: name,
    isSortable: true,
    initialSortDirection: "asc",
    propsForCells: {
      className: "w-1/4 border-x-2 border-palette-beige/50",
    },
    propsForHeaderCell: {
      className: [
        "py-3",
        "border-x-2 border-t-2 border-palette-beige/50",
        "bg-palette-beige text-palette-text font-bold",
        "hover:bg-palette-beige/90",
      ],
    },
    customValueGetter: (row: (typeof lockupsAsRows)[number]) => {
      const { isExpired, isEligibleToVote } = row._lockup
      return isExpired ? 0 : isEligibleToVote ? 1 : 2
    },
  }))

  const columnDescriptors = [
    {
      key: "amount",
      label: "Amount",
      isSortable: true,
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
    ...statusColumnDescriptors,
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
    const { daysLeft } = lockup

    const statusCells = Object.fromEntries(
      tranches.map(({ id }) => {
        return [
          `trancheStatus${id}` as const,
          <LockupStatus
            key={`trancheStatus${id}`}
            lockupId={lockup.id}
            trancheId={id}
          />,
        ]
      })
    )

    const cells = {
      _lockup: { ...lockup, daysLeft },

      amount: (
        <>
          {formatAmount(lockup.funds.amount * 1e6, undefined, 6)}{" "}
          <StyledText variant="footnote">ATOM</StyledText>
        </>
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

      ...statusCells,

      actions: (
        <StyledText
          as="button"
          variant="button.secondary"
          className={twJoin(
            lockup.isExpired ? "border-palette-red text-palette-red" : undefined
          )}
          onClick={() => {
            setIsEditModalOpen(true)
            setLockupBeingEdited(lockup)
          }}
        >
          {lockup.isExpired ? "Refresh" : "Edit"}
        </StyledText>
      ),
    }

    return cells
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

  useEffect(() => {
    if (!incompleteNotices.length) {
      return
    }

    addToast({
      variant: "warning",
      message: (
        <>
          You have <strong>{incompleteNotices.length}</strong> incomplete{" "}
          {pluralize({
            count: incompleteNotices.length,
            singular: "lockup",
          })}
          .
        </>
      ),
      isDismissible: true,
      actionButtonPrimary: {
        label: "Continue",
        onClick: () => {
          router.push("/lock-atom")
        },
      },
    })
  }, [incompleteNotices])

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
              className="border-collapse"
              columns={columnDescriptors}
              rows={lockupsAsRows}
              initialSortedColumnKey="timeLeft"
              renderCells={
                {
                  trancheStatus1: ({ cell, cellProps, row }: any) => {
                    const { isExpired } = row._lockup
                    return (
                      <TD
                        {...cellProps}
                        className={twMerge(
                          cellProps.className,
                          isExpired && "border-x-0"
                        )}
                        colSpan={isExpired ? tranches.length : undefined}
                        key={cellProps.key}
                      >
                        {cell}
                      </TD>
                    )
                  },
                  trancheStatus2: ({ cell, cellProps, row }: any) => {
                    const { isExpired } = row._lockup
                    console.log({ isExpired })
                    return isExpired ? (
                      <></>
                    ) : (
                      <TD key={cellProps.key} {...cellProps}>
                        {cell}
                      </TD>
                    )
                  },
                } as any
              }
              renderRow={({ children, row, rowProps }) => {
                const { isExpired, isEligibleToVote } = row._lockup

                return (
                  <TR
                    className={twMerge(
                      rowProps.className,
                      isExpired
                        ? "[&_td]:bg-palette-red/20"
                        : !isEligibleToVote
                          ? "opacity-60 transition-opacity hover:opacity-100"
                          : ""
                    )}
                    key={row._lockup.id}
                    {...rowProps}
                  >
                    {children}
                  </TR>
                )
              }}
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
