"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { Card } from "@/components/Card"
import { ContentContainer } from "@/components/ContentContainer"
import { EditLockupDurationModal } from "@/components/EditLockupDurationModal"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { ProgressBar } from "@/components/ProgressBar"
import { CurrentRoundAtomLockedGlobal } from "@/components/StatCards/cards/CurrentRoundAtomLockedGlobal"
import { CurrentRoundAtomLockedWallet } from "@/components/StatCards/cards/CurrentRoundAtomLockedWallet"
import { CurrentRoundVotingPowerWallet } from "@/components/StatCards/cards/CurrentRoundVotingPowerWallet"
import { StatCardsContainer } from "@/components/StatCards/StatCardsContainer"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import {
  initializingLockupsTooltip,
  lockupLimitTooltip,
  needsWalletConnectionTooltip,
  notEligibleTooltip,
} from "@/components/ToolTips"
import { executeWalletUnlockExpired } from "@/contract-apis/executeWalletUnlockExpired"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { pluralize } from "@/lib/pluralize"
import { revalidateTag } from "@/lib/revalidateTag"
import { useChain } from "@cosmos-kit/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LockupsTables } from "./LockupsTables"
import { NewLockUpButton } from "@/components/NewLockUpButton"
import { LockupsLST } from "./LockupsLST"
import { useAmountOfTokenInWallet } from "@/contract-apis/useAmountOfTokenInWallet"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { useIncompleteNotices } from "@/components/IncompleteNoticesProvider"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"
import { cn } from "@/lib/utils"

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
    lockedAtomPercentageWallet,
    lockedAtomTotalWallet,
    hasGatekeeper,
    isLoading,
  } = useBackendData()

  const { getSigningCosmWasmClient } = useChain("neutron")
  const { setToasts } = useToasts()
  const expiredLockups = lockups.filter(
    (lockup) => new Date() >= lockup.dateEnd
  )
  const [lockupBeingEdited, setLockupBeingEdited] =
    useState<AugmentedLockup | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState<{
    name: "stATOM" | "dATOM"
    amount: number
  }>({
    name: "dATOM",
    amount: 0,
  })

  const amountOfDAtomInWallet = useAmountOfTokenInWallet("dATOM")

  const amountOfStAtomInWallet = useAmountOfTokenInWallet("stATOM")

  function handleStAtom() {
    setIsOpen(true)
    setToken({
      name: "stATOM",
      amount: amountOfStAtomInWallet,
    })
  }

  function handleDAtom() {
    setIsOpen(true)
    setToken({
      name: "dATOM",
      amount: amountOfDAtomInWallet,
    })
  }

  function handleCreationModalWindowClose() {
    setIsOpen(false)
  }

  function handleModalWindowCloseComplete() {
    setIsOpen(false)
  }

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

    setToasts([
      {
        variant: "warning",
        message: <>You have incomplete lockups.</>,
        actionButtonPrimary: {
          label: "Continue",
          onClick: () => {
            router.push("/lock-atom")
          },
        },
      },
    ])
  }, [incompleteNotices])

  return (
    <>
      <StatCardsContainer>
        <CurrentRoundAtomLockedGlobal />
        <CurrentRoundAtomLockedWallet />
        <CurrentRoundVotingPowerWallet />
      </StatCardsContainer>

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
          {hasGatekeeper ? (
            <Tooltip
              tipContents={
                lockedAtomMaxWallet === 0
                  ? notEligibleTooltip
                  : lockupLimitTooltip({
                      lockedAtomMaxWallet,
                      lockedAtomTotalWallet,
                    })
              }
              className="block w-96 shrink-0"
            >
              <ProgressBar
                percentage={lockedAtomPercentageWallet}
                warningZone={(percentage) => percentage >= 75}
                dangerZone={(percentage) => percentage >= 95}
                className={cn({
                  "!gap-2": lockedAtomMaxWallet === 0,
                })}
              >
                <div className="flex items-center gap-1 opacity-60">
                  {lockedAtomMaxWallet === 0 ? (
                    <span>Not Eligible</span>
                  ) : (
                    <span>
                      {lockedAtomTotalWallet.toFixed(
                        DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS
                      )}{" "}
                      / {lockedAtomMaxWallet} ATOM max
                    </span>
                  )}
                  <span>
                    <Icon name="circle-info" />
                  </span>
                </div>
              </ProgressBar>
            </Tooltip>
          ) : (
            <div />
          )}

          <div
            className="
              flex
              flex-col
              items-end
              justify-between
              gap-6
              whitespace-nowrap
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
              condition={!isWalletConnected || isLoading}
              wrapper={(children) => (
                <Tooltip
                  className="w-auto"
                  classNamesForTooltip="sm:-ml-12"
                  tipContents={
                    !isWalletConnected
                      ? needsWalletConnectionTooltip
                      : initializingLockupsTooltip
                  }
                >
                  <div className="pointer-events-none cursor-not-allowed opacity-50">
                    {children}
                  </div>
                </Tooltip>
              )}
            >
              <NewLockUpButton
                handleStAtom={handleStAtom}
                handleDAtom={handleDAtom}
              />
            </ConditionalWrapper>
          </div>
        </div>

        {lockups.length === 0 ? (
          <BlurryBackdropBox className="flex flex-col gap-6">
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
          </BlurryBackdropBox>
        ) : (
          <LockupsTables
            onClickEdit={({ lockup }) => {
              setIsEditModalOpen(true)
              setLockupBeingEdited(lockup)
            }}
          />
        )}
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

      <LockupsLST
        tokenInfo={token}
        isCreationModalOpen={isOpen}
        setIsCreationModalOpen={setIsOpen}
        handleCreationModalWindowClose={handleCreationModalWindowClose}
        handleModalWindowCloseComplete={handleModalWindowCloseComplete}
      />
    </>
  )
}
