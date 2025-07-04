"use client"

import { signLockTokens } from "@/app/(with-backend-data)/lock-atom/transactions/signLockTokens"
import { LockupsTables } from "@/app/(with-backend-data)/lockups/LockupsTables"
import { ModalWindowToUnlockExpiredLockups } from "@/app/(with-backend-data)/lockups/ModalWindowToUnlockExpiredLockups"
import { Card } from "@/components/Card"
import { ContentContainer } from "@/components/ContentContainer"
import { EditLockupDurationModal } from "@/components/EditLockupDurationModal"
import { GetStOsmoButtons } from "@/components/GetStOsmoButtons"
import { Icon } from "@/components/Icon"
import { InputForLockupPeriod } from "@/components/InputForLockupPeriod"
import { ModalWindow } from "@/components/ModalWindow"
import { ProgressBar } from "@/components/ProgressBar"
import { CurrentRoundTokenLockedGlobal } from "@/components/StatCards/cards/CurrentRoundTokenLockedGlobal"
import { CurrentRoundTokenLockedWallet } from "@/components/StatCards/cards/CurrentRoundTokenLockedWallet"
import { CurrentRoundVotingPowerWallet } from "@/components/StatCards/cards/CurrentRoundVotingPowerWallet"
import { StatCardsContainer } from "@/components/StatCards/StatCardsContainer"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts/useToasts"
import { Tooltip } from "@/components/Tooltip"
import {
  initializingLockupsTooltip,
  lockupLimitTooltip,
  needsWalletConnectionTooltip,
} from "@/components/ToolTips"
import { AugmentedLockup } from "@/contract-apis/types"
import { useAmountOfStOsmoInWallet } from "@/contract-apis/useAmountOfStOsmoInWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { SigningStargateClient } from "@cosmjs/stargate"
import { useChain } from "@cosmos-kit/react"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { twJoin } from "tailwind-merge"
import BuyALockupButton from "./BuyALockupButton"
import { LockupsLST } from "./LockupsLST"
import { useAmountOfTokenInWallet } from "@/contract-apis/useAmountOfTokenInWallet"
import { useGlobalLockupCapacityInfo } from "@/contract-apis/useGlobalLockupCapacityInfo"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { NewLockUpButton } from "@/components/NewLockUpButton"

export function LockupsPageForStOsmo() {
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

  const [isConfirmingUnlockExpired, setIsConfirmingUnlockExpired] =
    useState(false)
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [lockupBeingEdited, setLockupBeingEdited] =
    useState<AugmentedLockup | null>(null)
  const [selectedLockDurationInEpochs, setSelectedLockDurationInEpochs] =
    useState(3)
  const { setToasts } = useToasts()

  const amountOfStOsmoInWallet = useAmountOfStOsmoInWallet()

  const {
    isWalletConnected,
    lockedTokenMaxWallet,
    lockedTokenPercentageWallet,
    lockedTokenTotalWallet,
    lockups,
    hasGatekeeper,
    isLoading,
  } = useBackendData()

  const {
    data: { lockedTokenPercentageGlobal, lockedTokenRemainingCapacityGlobal },
  } = useGlobalLockupCapacityInfo()

  const expiredLockups = lockups.filter(
    (lockup) => new Date() >= lockup.dateEnd
  )

  const votingTokenName = process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME

  const usersLimitRemainder = lockedTokenMaxWallet - lockedTokenTotalWallet

  const minStOsmoToBeLocked = 1 / 1e6

  const maxStOsmoToBeLocked = Math.min(
    lockedTokenRemainingCapacityGlobal, // no more than the global limit
    amountOfStOsmoInWallet, // no more than they have
    usersLimitRemainder // no more than their limit
  )

  const hasStOsmoInWallet = amountOfStOsmoInWallet > 0

  const canCreateLockup =
    isWalletConnected &&
    hasStOsmoInWallet &&
    maxStOsmoToBeLocked > minStOsmoToBeLocked &&
    lockedTokenPercentageWallet < 100 &&
    lockedTokenPercentageGlobal < 100

  const [amount, setAmount] = useState(minStOsmoToBeLocked)

  useEffect(() => {
    setAmount(maxStOsmoToBeLocked)
  }, [maxStOsmoToBeLocked])

  useEffect(() => {
    if (!isWalletConnected) return
  }, [isWalletConnected])

  function handleClickUnlockExpired() {
    setIsConfirmingUnlockExpired(true)
  }

  function handleClickCreateNew() {
    setIsCreationModalOpen(true)
  }

  function handleCreationModalWindowClose() {
    setIsCreationModalOpen(false)
  }

  function handleUnlockExpiredModalWindowClose() {
    setIsConfirmingUnlockExpired(false)
  }

  function handleUnlockExpiredModalWindowSuccess() {
    setIsConfirmingUnlockExpired(false)
    setToasts([
      toastMessages.unlockingExpiredStOsmoLockupsSuccess(expiredLockups.length),
    ])
  }

  function handleModalWindowCloseComplete() {
    setIsCreationModalOpen(false)
    setAmount(maxStOsmoToBeLocked)
    setSelectedLockDurationInEpochs(3)
  }

  function handleChangeAmount(event: ChangeEvent<HTMLInputElement>) {
    const numericValue = Number(event.target.value)

    setAmount(
      numericValue > maxStOsmoToBeLocked ? maxStOsmoToBeLocked : numericValue
    )
  }

  const neutronChain = useChain("neutron")

  const [neutronSigner, setNeutronSigner] = useState<
    SigningStargateClient | undefined
  >(undefined)

  useEffect(() => {
    if (neutronChain.address) {
      neutronChain.getSigningStargateClient().then(setNeutronSigner)
    }
  }, [neutronChain.address])

  async function handleSubmitCreationForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const neutronStOsmoDenom = process.env.NEXT_PUBLIC_NEUTRON_STOSMO_DENOM

    if (!neutronStOsmoDenom) {
      throw new Error("NEXT_PUBLIC_NEUTRON_STOSMO_DENOM is not set")
    }

    if (!neutronSigner) {
      throw new Error("Neutron signer not found")
    }

    setIsCreationModalOpen(false)

    setToasts([toastMessages.lockingTokens])

    try {
      await signLockTokens(
        neutronChain,
        neutronSigner,
        selectedLockDurationInEpochs,
        neutronStOsmoDenom,
        String(amount * 1e6),
        hasGatekeeper
      )

      setToasts([toastMessages.lockingTokensSuccess])
    } catch (error) {
      setToasts([toastMessages.lockingTokensError(error as Error)])
      setIsCreationModalOpen(true)
    }
  }

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
                  {lockedTokenMaxWallet} {votingTokenName} max
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
            <GetStOsmoButtons className="[&_.border-white]:!border-tokens-stosmo" />

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
            <BuyALockupButton />
            <StyledText
              variant="button.primary"
              as="button"
              disabled={!canCreateLockup}
              tooltip={
                !hasStOsmoInWallet ? (
                  <>You don&rsquo;t have any StOSMO in your wallet.</>
                ) : !canCreateLockup ? (
                  <>You cannot create a lockup right now.</>
                ) : undefined
              }
              onClick={canCreateLockup ? handleClickCreateNew : undefined}
            >
              New Lockup
            </StyledText>
          </div>
        </div>

        <LockupsTables
          onClickEdit={({ lockup }) => {
            setIsEditModalOpen(true)
            setLockupBeingEdited(lockup)
          }}
        />
      </ContentContainer>

      <EditLockupDurationModal
        lockup={lockupBeingEdited}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
        }}
        onCloseComplete={() => {
          setLockupBeingEdited(null)
          setSelectedLockDurationInEpochs(3)
        }}
      />

      <ModalWindowToUnlockExpiredLockups
        isOpen={isConfirmingUnlockExpired}
        onClose={handleUnlockExpiredModalWindowClose}
        onSuccess={handleUnlockExpiredModalWindowSuccess}
      />

      <ModalWindow
        isOpen={isCreationModalOpen}
        onClose={handleCreationModalWindowClose}
        onCloseComplete={handleModalWindowCloseComplete}
        title="Create New Lockup"
      >
        <form onSubmit={handleSubmitCreationForm}>
          <Card>
            <Card.Header title="Create New Lockup" />

            <Card.Body className="grid grid-cols-[1fr_3fr] gap-6">
              <label
                className={twJoin(
                  "col-span-2 grid grid-cols-subgrid",
                  "items-baseline"
                )}
              >
                <span>Amount:</span>
                <div className="flex flex-col gap-2">
                  <StyledText
                    value={amount}
                    variant="input.text"
                    id="amount"
                    as="input"
                    type="number"
                    min={minStOsmoToBeLocked}
                    max={maxStOsmoToBeLocked}
                    step={minStOsmoToBeLocked}
                    onChange={handleChangeAmount}
                  />

                  <StyledText
                    variant="footnote"
                    className="flex items-center gap-2"
                  >
                    <span>
                      Max: {maxStOsmoToBeLocked} {votingTokenName}
                    </span>
                    {amount < maxStOsmoToBeLocked && (
                      <StyledText
                        as="button"
                        variant="link"
                        onClick={() => setAmount(maxStOsmoToBeLocked)}
                      >
                        Set to max
                      </StyledText>
                    )}
                  </StyledText>
                </div>
              </label>

              <label className="col-span-2 grid grid-cols-subgrid items-center">
                <span>Lockup Duration:</span>

                <InputForLockupPeriod
                  selectedDuration={selectedLockDurationInEpochs}
                  className="w-full"
                  classNamesForButtons="!w-full"
                  onChange={setSelectedLockDurationInEpochs}
                />
              </label>
            </Card.Body>

            <Card.Footer>
              <StyledText variant="button.primary" as="button" type="submit">
                Lock {votingTokenName}
              </StyledText>

              <StyledText
                variant="button.secondary"
                as="button"
                type="button"
                onClick={handleCreationModalWindowClose}
              >
                Cancel
              </StyledText>
            </Card.Footer>
          </Card>
        </form>
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
