"use client"

import { Card } from "@/components/Card"
import { InputForLockupPeriod } from "@/components/InputForLockupPeriod"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts"
import { FormEvent, useState } from "react"
import { toastMessages } from "@/components/ToastMessages"
import { useBackendData } from "@/contract-apis/useBackendData"
import { executeWalletExtendLockup } from "@/contract-apis/executeWalletExtendLockup"
import { useChain } from "@cosmos-kit/react"
import { revalidateTag } from "@/lib/revalidateTag"
import { pluralize } from "@/lib/pluralize"
import { AugmentedLockup } from "@/contract-apis/types"
import { AllowedLockupPeriodInEpochs } from "@/config"

interface RefreshMultipleLockupsProps {
  activeLockups: AugmentedLockup[]
  isCreationModalOpen: boolean
  setIsCreationModalOpen: (isOpen: boolean) => void
  handleCreationModalWindowClose: () => void
  handleModalWindowCloseComplete: () => void
  selectedLockups: number[]
}

export function RefreshMultipleLockups({
  activeLockups,
  isCreationModalOpen,
  setIsCreationModalOpen,
  handleCreationModalWindowClose,
  handleModalWindowCloseComplete,
  selectedLockups,
}: RefreshMultipleLockupsProps) {
  const { setToasts } = useToasts()

  const { address, isLoading } = useBackendData()
  const { getSigningCosmWasmClient } = useChain("neutron")

  const [selectedDuration, setSelectedDuration] = useState(
    AllowedLockupPeriodInEpochs.ONE_EPOCH
  )

  const filteredLockups = activeLockups.filter((lockup) =>
    selectedLockups.includes(lockup.id)
  )

  const maxDateEnd = filteredLockups.reduce((max, current) => {
    const currentDate = current.dateEnd
    return currentDate > max ? currentDate : max
  }, new Date(0))

  const currentLockupEndDate = maxDateEnd ?? new Date()

  async function handleChange(newDuration: number) {
    setSelectedDuration(newDuration)
  }

  async function handleSubmitCreationForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsCreationModalOpen(false)

    setToasts([toastMessages.lockingTokens])

    try {
      setToasts([toastMessages.extendingLockup])

      await executeWalletExtendLockup({
        getSigningCosmWasmClient,
        address,
        lockId: selectedLockups,
        lockDurationInNanos: selectedDuration,
        type: "multiple",
      })

      await revalidateTag("backendData")

      setToasts([toastMessages.extendingLockupSuccess])
    } catch (error) {
      console.error("Error locking tokens:", error)
      setToasts([toastMessages.lockingTokensError(error as Error)])
      setIsCreationModalOpen(true)
    }
  }

  return (
    <ModalWindow
      isOpen={isCreationModalOpen}
      onClose={() => {
        handleCreationModalWindowClose()
      }}
      onCloseComplete={() => {
        handleModalWindowCloseComplete()
      }}
      className="w-5/6 md:w-auto"
    >
      <form onSubmit={handleSubmitCreationForm}>
        <Card>
          <Card.Header title="Edit Lockups" />

          <Card.Body>
            <InputForLockupPeriod
              currentLockupEndDate={currentLockupEndDate}
              selectedDuration={selectedDuration}
              className="w-full"
              classNamesForButtons="!w-full"
              onChange={handleChange}
            />
            <p>
              Refresh{" "}
              {pluralize({
                count: selectedLockups.length,
                prefixCount: true,
                singular: "lockup",
              })}
              ?
            </p>
          </Card.Body>

          <Card.Footer>
            <StyledText
              variant="button.primary"
              as="button"
              type="submit"
              disabled={isLoading}
            >
              Confirm
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
