"use client"

import { Card } from "@/components/Card"
import { InputForLockupPeriod } from "@/components/InputForLockupPeriod"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { twJoin } from "tailwind-merge"
import { signLockTokens } from "../lock-atom/transactions/signLockTokens"
import { useChain } from "@cosmos-kit/react"
import { SigningStargateClient } from "@cosmjs/stargate"
import { toastMessages } from "@/components/ToastMessages"

interface LockupsLSTProps {
  isCreationModalOpen: boolean
  setIsCreationModalOpen: (isOpen: boolean) => void
  maxTokenToBeLocked: number
  handleCreationModalWindowClose: () => void
  handleModalWindowCloseComplete: () => void
  minTokenBeLocked: number
  votingTokenName?: string
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
  const neutronChain = useChain("neutron")
  const { setToasts } = useToasts()
  const [selectedLockDurationInEpochs, setSelectedLockDurationInEpochs] =
    useState(3)
  const [amount, setAmount] = useState(minTokenBeLocked)
  const [neutronSigner, setNeutronSigner] = useState<
    SigningStargateClient | undefined
  >(undefined)

  function handleChangeAmount(event: ChangeEvent<HTMLInputElement>) {
    const numericValue = Number(event.target.value)
    setAmount(
      numericValue > maxTokenToBeLocked ? maxTokenToBeLocked : numericValue
    )
  }

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

    // setToasts([toastMessages.lockingTokens])

    try {
      await signLockTokens(
        neutronChain,
        neutronSigner,
        3, // selectedLockDurationInEpochs
        neutronStOsmoDenom,
        String(amount * 1e6)
      )

      // setToasts([toastMessages.lockingTokensSuccess])
    } catch (error) {
      // setToasts([toastMessages.lockingTokensError(error as Error)])
      setIsCreationModalOpen(true)
    }
  }

  useEffect(() => {
    setAmount(maxTokenToBeLocked)
  }, [maxTokenToBeLocked])

  useEffect(() => {
    if (neutronChain.address) {
      neutronChain.getSigningStargateClient().then(setNeutronSigner)
    }
  }, [neutronChain.address])

  return (
    <>
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
                    min={minTokenBeLocked}
                    max={maxTokenToBeLocked}
                    step={minTokenBeLocked}
                    onChange={handleChangeAmount}
                  />

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
    </>
  )
}
