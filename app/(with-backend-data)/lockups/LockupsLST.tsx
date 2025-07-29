"use client"

import { Card } from "@/components/Card"
import { InputForLockupPeriod } from "@/components/InputForLockupPeriod"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { twJoin } from "tailwind-merge"
import { signLockTokens } from "../lock-atom/transactions/signLockTokens"
import { toastMessages } from "@/components/ToastMessages"
import { useBackendData } from "@/contract-apis/useBackendData"
import { TOKEN_DENOMS } from "@/lib/tokenDenoms"
import { cn } from "@/lib/utils"
import { useChainsAndSigners } from "@/components/ChainsAndSignersProvider"
import { useGlobalLockupCapacityInfo } from "@/contract-apis/useGlobalLockupCapacityInfo"
import { useIsMobile } from "@/hooks/use-mobile"
import AccordionWrapper from "@/components/Accordion"

interface LockupsLSTProps {
  isCreationModalOpen: boolean
  setIsCreationModalOpen: (isOpen: boolean) => void
  handleCreationModalWindowClose: () => void
  handleModalWindowCloseComplete: () => void
  tokenInfo: {
    name: "stATOM" | "dATOM"
    amount: number
  }
}

export function LockupsLST({
  isCreationModalOpen,
  setIsCreationModalOpen,
  handleCreationModalWindowClose,
  handleModalWindowCloseComplete,
  tokenInfo,
}: LockupsLSTProps) {
  const minTokenToBeLocked = 1 / 1e6
  const NFT_SIZES = [25, 50, 100, 250, 500, 1000]
  const { setToasts } = useToasts()
  const {
    data: { lockedTokenRemainingCapacityGlobal },
  } = useGlobalLockupCapacityInfo()
  const [selectedLockDurationInEpochs, setSelectedLockDurationInEpochs] =
    useState(3)

  const { hasGatekeeper, lockedTokenMaxWallet, lockedTokenTotalWallet } =
    useBackendData()
  const { neutronSigner, neutronChain } = useChainsAndSigners()
  const isMobile = useIsMobile()

  const usersLimitRemainder = lockedTokenMaxWallet - lockedTokenTotalWallet

  const maxTokenToBeLocked = Math.min(
    lockedTokenRemainingCapacityGlobal, // no more than the global limit
    tokenInfo.amount, // no more than they have
    usersLimitRemainder // no more than their limit
  )

  const [amount, setAmount] = useState(maxTokenToBeLocked)

  function handleChangeAmount(event: ChangeEvent<HTMLInputElement>) {
    const numericValue = Number(event.target.value)
    setAmount(
      numericValue > maxTokenToBeLocked ? maxTokenToBeLocked : numericValue
    )
  }

  async function handleSubmitCreationForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const neutronTokenDenom = TOKEN_DENOMS[tokenInfo.name].denom

    if (!neutronTokenDenom) {
      throw new Error("Denom is not set")
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
        neutronTokenDenom,
        String(amount * 1e6),
        hasGatekeeper
      )

      setToasts([toastMessages.lockingTokensSuccess])
    } catch (error) {
      console.error("Error locking tokens:", error)
      setToasts([toastMessages.lockingTokensError(error as Error)])
      setIsCreationModalOpen(true)
    }
  }

  useEffect(() => {
    setAmount(
      maxTokenToBeLocked >= NFT_SIZES[0] ? NFT_SIZES[0] : maxTokenToBeLocked
    )
  }, [maxTokenToBeLocked])

  return (
    <ModalWindow
      isOpen={isCreationModalOpen}
      onClose={() => {
        handleCreationModalWindowClose()
        setAmount(maxTokenToBeLocked)
        setSelectedLockDurationInEpochs(3)
      }}
      onCloseComplete={() => {
        handleModalWindowCloseComplete()
        setAmount(maxTokenToBeLocked)
        setSelectedLockDurationInEpochs(3)
      }}
      className="w-5/6 md:w-auto"
    >
      <form onSubmit={handleSubmitCreationForm}>
        <Card>
          <Card.Header title="Create New Lockup" />

          <Card.Body className="grid-cols-[1fr_3fr] gap-6 md:grid">
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
                  min={minTokenToBeLocked}
                  max={maxTokenToBeLocked}
                  step={minTokenToBeLocked}
                  onChange={handleChangeAmount}
                />

                {amount <= NFT_SIZES[0] ? (
                  <>
                    {!isMobile ? (
                      <StyledText
                        variant="footnote"
                        className="flex items-center gap-1 text-palette-red"
                      >
                        Locking up a custom amount will result in a lockup that
                        cannot be traded on the upcoming NFT marketplace right
                        away. If you intend to sell your lockup, please use one
                        of the suggested amounts.
                      </StyledText>
                    ) : (
                      <AccordionWrapper
                        title="Custom Lockups Are Not Tradable"
                        content="Locking up a custom amount will result in a lockup that
                      cannot be traded on the upcoming NFT marketplace right
                      away. If you intend to sell your lockup, please use one of
                      the suggested amounts."
                        className="text-palette-red"
                      />
                    )}
                  </>
                ) : null}

                <div className="flex flex-wrap  items-center justify-start gap-2 md:flex-nowrap ">
                  {NFT_SIZES.map((size) => (
                    <StyledText
                      variant={
                        amount === size ? "button.primary" : "button.secondary"
                      }
                      as="button"
                      key={size}
                      disabled={maxTokenToBeLocked < size || size === 1000}
                      onClick={() => setAmount(size)}
                      className={cn({
                        "!cursor-not-allowed": size === 1000,
                      })}
                    >
                      <span>{size}</span>
                    </StyledText>
                  ))}
                </div>

                <StyledText
                  variant="footnote"
                  className="flex flex-nowrap items-center gap-2 font-bold"
                >
                  <span className="whitespace-nowrap">
                    Max: {maxTokenToBeLocked} {tokenInfo.name}
                  </span>
                  <StyledText
                    variant="link"
                    onClick={() => setAmount(maxTokenToBeLocked)}
                  >
                    Set to max
                  </StyledText>
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
            <StyledText
              disabled={selectedLockDurationInEpochs === 3}
              variant="button.primary"
              as="button"
              type="submit"
            >
              Lock {tokenInfo.name}
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
  )
}
