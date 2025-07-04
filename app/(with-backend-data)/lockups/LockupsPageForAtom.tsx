"use client"

import { ModalWindowToUnlockExpiredLockups } from "@/app/(with-backend-data)/lockups/ModalWindowToUnlockExpiredLockups"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { Card } from "@/components/Card"
import { ContentContainer } from "@/components/ContentContainer"
import { EditLockupDurationModal } from "@/components/EditLockupDurationModal"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { ProgressBar } from "@/components/ProgressBar"
import { CurrentRoundTokenLockedGlobal } from "@/components/StatCards/cards/CurrentRoundTokenLockedGlobal"
import { CurrentRoundTokenLockedWallet } from "@/components/StatCards/cards/CurrentRoundTokenLockedWallet"
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
} from "@/components/ToolTips"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useChain } from "@cosmos-kit/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LockupsTables } from "./LockupsTables"
import { LockupsLST } from "./LockupsLST"
import { useAmountOfTokenInWallet } from "@/contract-apis/useAmountOfTokenInWallet"
import { useIncompleteNotices } from "@/components/IncompleteNoticesProvider"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { NewLockUpButton } from "@/components/NewLockUpButton"

export function LockupsPageForAtom() {
  const { incompleteNotices } = useIncompleteNotices()
  const router = useRouter()
  const [isConfirmingUnlockExpired, setIsConfirmingUnlockExpired] =
    useState(false)
  const [isShowingNextStep, setIsShowingNextStep] = useState(false)
  const {
    address,
    isWalletConnected,
    lockups,
    lockedTokenMaxWallet,
    lockedTokenPercentageWallet,
    lockedTokenTotalWallet,
    isLoading,
  } = useBackendData()
  const { getSigningCosmWasmClient } = useChain("neutron")
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
  const { setToasts, addToast } = useToasts()
  const expiredLockups = lockups.filter(
    (lockup) => new Date() >= lockup.dateEnd
  )
  const [lockupBeingEdited, setLockupBeingEdited] =
    useState<AugmentedLockup | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  async function handleClickToNextUnlockingStep() {
    router.push("/lock-atom")
    router.refresh()
  }

  function handleCreationModalWindowClose() {
    setIsOpen(false)
  }

  function handleModalWindowCloseComplete() {
    setIsOpen(false)
  }

  function handleClickUnlockExpired() {
    setIsConfirmingUnlockExpired(true)
  }

  function handleModalWindowClose() {
    setIsConfirmingUnlockExpired(false)
  }

  function handleUnlockExpiredModalWindowSuccess() {
    setIsConfirmingUnlockExpired(false)
    setToasts([
      toastMessages.unlockingExpiredAtomLockupsSuccess(expiredLockups.length),
    ])
  }

  useEffect(() => {
    if (!incompleteNotices.length) {
      setToasts([])
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
        <CurrentRoundTokenLockedGlobal />
        <CurrentRoundTokenLockedWallet />
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

          <Tooltip
            tipContents={lockupLimitTooltip({
              lockedTokenMaxWallet,
              lockedTokenTotalWallet,
            })}
            className="block w-96 shrink-0"
          >
            <ProgressBar
              percentage={lockedTokenPercentageWallet}
              warningZone={(percentage) => percentage >= 75}
              dangerZone={(percentage) => percentage >= 95}
            >
              <div className="flex items-center gap-1 opacity-60">
                <span>
                  {lockedTokenTotalWallet.toFixed(4).replace(".0000", "")} /{" "}
                  {lockedTokenMaxWallet}{" "}
                  {process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME} max
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

      <ModalWindowToUnlockExpiredLockups
        isOpen={isConfirmingUnlockExpired}
        onClose={handleModalWindowClose}
        onSuccess={handleUnlockExpiredModalWindowSuccess}
      />

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
