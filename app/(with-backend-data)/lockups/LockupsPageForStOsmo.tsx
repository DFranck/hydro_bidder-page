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
  mergingTooltip,
  needsWalletConnectionTooltip,
  notEligibleTooltip,
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
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"
import { RotateCw } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { SplitLockupModal } from "@/components/SplitLockupModal"
import { RefreshMultipleLockups } from "./RefreshMultipleLockups"

export function LockupsPageForStOsmo() {
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [refreshMultipleLockups, setRefreshMultipleLockups] = useState(false)
  const [token, setToken] = useState<{
    name: "stATOM" | "dATOM"
    amount: number
  }>({
    name: "dATOM",
    amount: 0,
  })

  const [selectedActiveLockups, setSelectedActiveLockups] = useState<number[]>(
    []
  )
  const [selectedExpiredLockups, setSelectedExpiredLockups] = useState<
    number[]
  >([])

  const [initMerge, setInitMerge] = useState(false)

  const refreshLockups = [...selectedActiveLockups, ...selectedExpiredLockups]

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

  function handleRefreshLockups() {
    setSelectedExpiredLockups([])
    setSelectedActiveLockups([])
    setInitMerge(false)
  }

  function handleRefreshModal() {
    setRefreshMultipleLockups(true)
  }

  useEffect(() => {
    if (isLoading) {
      handleRefreshLockups()
    }
  }, [isLoading])

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

          {hasGatekeeper ? (
            <Tooltip
              tipContents={
                lockedTokenMaxWallet === 0
                  ? notEligibleTooltip
                  : lockupLimitTooltip({
                      lockedTokenMaxWallet,
                      lockedTokenTotalWallet,
                    })
              }
              className="block w-96 shrink-0"
            >
              <ProgressBar
                percentage={lockedTokenPercentageWallet}
                warningZone={(percentage) => percentage >= 75}
                dangerZone={(percentage) => percentage >= 95}
              >
                <div className="flex items-center gap-1 opacity-60">
                  {lockedTokenMaxWallet === 0 ? (
                    <span>Not Eligible</span>
                  ) : (
                    <span>
                      {lockedTokenTotalWallet.toFixed(
                        DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS
                      )}{" "}
                      / {lockedTokenMaxWallet} {votingTokenName} ATOM max
                    </span>
                  )}
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
            <GetStOsmoButtons className="[&_.border-white]:!border-tokens-stosmo" />
            {lockups.length > 0 && (
              <StyledText
                as="button"
                variant="button.secondary"
                className="flex items-center gap-2"
                onClick={handleRefreshModal}
                disabled={refreshLockups.length <= 1}
              >
                <RotateCw className="size-4 text-palette-green" />
                {initMerge ? "Merge" : "Refresh"} {refreshLockups.length}{" "}
                Lockups
              </StyledText>
            )}

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

            {lockups.length > 1 ? (
              <div className="flex justify-end">
                <Tooltip
                  classNamesForTooltip="w-96  -translate-x-10/12 md:w-5/12"
                  tipContents={mergingTooltip}
                >
                  <div className="flex items-center  space-x-2">
                    <Switch
                      checked={initMerge}
                      onCheckedChange={() => setInitMerge(!initMerge)}
                      disabled={refreshLockups.length > 1}
                    />
                    <StyledText
                      className={cn("w-28 text-sm", {
                        "text-gray-400": !initMerge,
                      })}
                    >
                      Merge {initMerge ? "enabled" : "disabled"}
                    </StyledText>
                  </div>
                </Tooltip>
              </div>
            ) : null}
          </div>
        </div>

        <LockupsTables
          initMerge={initMerge}
          selectedActiveLockups={selectedActiveLockups}
          selectedExpiredLockups={selectedExpiredLockups}
          setSelectedActiveLockups={setSelectedActiveLockups}
          setSelectedExpiredLockups={setSelectedExpiredLockups}
          onClickEdit={({ lockup }) => {
            setIsEditModalOpen(true)
            setLockupBeingEdited(lockup)
          }}
          onClickSplit={({ lockup }) => {
            setIsSplitModalOpen(true)
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

      <SplitLockupModal
        lockup={lockupBeingEdited}
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        onCloseComplete={() => setLockupBeingEdited(null)}
      />

      <ModalWindowToUnlockExpiredLockups
        isOpen={isConfirmingUnlockExpired}
        onClose={handleUnlockExpiredModalWindowClose}
        onSuccess={handleUnlockExpiredModalWindowSuccess}
      />

      <RefreshMultipleLockups
        initMerge={initMerge}
        lockups={lockups}
        isCreationModalOpen={refreshMultipleLockups}
        refreshLockups={refreshLockups}
        handleRefreshLockups={handleRefreshLockups}
        setIsCreationModalOpen={setRefreshMultipleLockups}
        handleCreationModalWindowClose={() => setRefreshMultipleLockups(false)}
        handleModalWindowCloseComplete={() => setRefreshMultipleLockups(false)}
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
