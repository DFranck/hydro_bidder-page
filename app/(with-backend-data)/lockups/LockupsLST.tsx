"use client"

import { Card } from "@/components/Card"
import { InputForLockupPeriod } from "@/components/InputForLockupPeriod"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts"
import { ChangeEvent, FormEvent, useState } from "react"
import { twJoin } from "tailwind-merge"
import { signLockTokens } from "../lock-atom/transactions/signLockTokens"
import { toastMessages } from "@/components/ToastMessages"
import { useBackendData } from "@/contract-apis/useBackendData"
import { TOKEN_DENOMS } from "@/lib/tokenDenoms"
import { cn } from "@/lib/utils"
import { TriangleAlert } from "lucide-react"
import { useChainsAndSigners } from "@/components/ChainsAndSignersProvider"

interface LockupsLSTProps {
  isCreationModalOpen: boolean
  setIsCreationModalOpen: (isOpen: boolean) => void
  maxTokenToBeLocked: number
  handleCreationModalWindowClose: () => void
  handleModalWindowCloseComplete: () => void
  minTokenBeLocked: number
  votingTokenName: "stATOM" | "dATOM"
}

export function LockupsLST({
  isCreationModalOpen,
  setIsCreationModalOpen,
  handleCreationModalWindowClose,
  handleModalWindowCloseComplete,
  maxTokenToBeLocked,
  minTokenBeLocked,
  votingTokenName,
}: LockupsLSTProps) {
  const NFT_SIZES = [25, 50, 100, 250, 500, 1000]
  const { setToasts } = useToasts()
  const [selectedLockDurationInEpochs, setSelectedLockDurationInEpochs] =
    useState(3)
  const [amount, setAmount] = useState(NFT_SIZES[0])

  const { hasGatekeeper } = useBackendData()
  const { neutronSigner, neutronChain } = useChainsAndSigners()

  function handleChangeAmount(event: ChangeEvent<HTMLInputElement>) {
    const numericValue = Number(event.target.value)
    setAmount(
      numericValue > maxTokenToBeLocked ? maxTokenToBeLocked : numericValue
    )
  }

  async function handleSubmitCreationForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const neutronTokenDenom = TOKEN_DENOMS[votingTokenName]

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

  return (
    <>
      <ModalWindow
        isOpen={isCreationModalOpen}
        onClose={() => {
          handleCreationModalWindowClose()
          setAmount(NFT_SIZES[0])
          setSelectedLockDurationInEpochs(3)
        }}
        onCloseComplete={() => {
          handleModalWindowCloseComplete()
          setAmount(NFT_SIZES[0])
          setSelectedLockDurationInEpochs(3)
        }}
        title="Create New Lockup"
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
                    min={minTokenBeLocked}
                    max={maxTokenToBeLocked}
                    step={minTokenBeLocked}
                    onChange={handleChangeAmount}
                  />

                  {!NFT_SIZES.includes(amount) ? (
                    <StyledText
                      variant="footnote"
                      className="flex items-center gap-1 text-palette-red"
                    >
                      <TriangleAlert className="size-4" /> {amount} will not be
                      tradeable on the NFT marketplace
                    </StyledText>
                  ) : null}
                  <div className="flex flex-wrap  items-center justify-start gap-2 md:flex-nowrap ">
                    {NFT_SIZES.map((size) => (
                      <StyledText
                        variant={
                          amount === size
                            ? "button.primary"
                            : "button.secondary"
                        }
                        as="button"
                        key={size}
                        disabled={size === 1000}
                        onClick={() => setAmount(size)}
                        className={cn({
                          "cursor-not-allowed": size === 1000,
                        })}
                      >
                        <span>{size}</span>
                      </StyledText>
                    ))}
                  </div>

                  <StyledText
                    variant="footnote"
                    className="flex items-center gap-2"
                  >
                    <span>
                      Max: {maxTokenToBeLocked} {votingTokenName}
                    </span>
                    {amount < maxTokenToBeLocked && (
                      <StyledText
                        as="button"
                        variant="link"
                        onClick={() => setAmount(maxTokenToBeLocked)}
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
              <StyledText
                disabled={selectedLockDurationInEpochs === 3}
                variant="button.primary"
                as="button"
                type="submit"
              >
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
    </>
  )
}
