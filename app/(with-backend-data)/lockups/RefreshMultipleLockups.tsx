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
import { formatAmount } from "@/lib/formatAmount"
import { getDaysAway } from "@/lib/getDaysAway"

interface RefreshMultipleLockupsProps {
  activeLockups: AugmentedLockup[]
  isCreationModalOpen: boolean
  setIsCreationModalOpen: (isOpen: boolean) => void
  handleCreationModalWindowClose: () => void
  handleModalWindowCloseComplete: () => void
  selectedLockups: number[]
  setSelectedLockups: (lockups: number[]) => void
}

export function RefreshMultipleLockups({
  activeLockups,
  isCreationModalOpen,
  setIsCreationModalOpen,
  handleCreationModalWindowClose,
  handleModalWindowCloseComplete,
  selectedLockups,
  setSelectedLockups,
}: RefreshMultipleLockupsProps) {
  const { setToasts } = useToasts()

  const { address, isLoading } = useBackendData()
  const { getSigningCosmWasmClient } = useChain("neutron")

  const [selectedDuration, setSelectedDuration] = useState(
    AllowedLockupPeriodInEpochs.ONE_EPOCH
  )

  const dateFormatter = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  })

  const newEndDate = new Date((Date.now() * 1e6 + selectedDuration) / 1e6)

  const daysUntilEndDate = getDaysAway(newEndDate)

  const filteredLockups = activeLockups.filter((lockup) =>
    selectedLockups.includes(lockup.id)
  )

  const currentLockupEndDate = filteredLockups.reduce((max, current) => {
    const currentDate = current.dateEnd
    return currentDate > max ? currentDate : max
  }, new Date())

  const totalAmount = filteredLockups.reduce((sum, lockup) => {
    return sum + Number(lockup.funds.amount)
  }, 0)

  async function handleChange(newDuration: number) {
    setSelectedDuration(newDuration)
  }

  async function handleSubmitCreationForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsCreationModalOpen(false)

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

      setToasts([toastMessages.extendingLockupsSuccess])
      setSelectedLockups([])
    } catch (error) {
      console.error("Error locking tokens:", error)
      setToasts([
        toastMessages.extendingLockupsError(error as Error),
      ])
      setIsCreationModalOpen(true)
    }
  }

  function handleCloseModal() {
    handleCreationModalWindowClose()
    setSelectedDuration(AllowedLockupPeriodInEpochs.ONE_EPOCH)
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
      className="md:w-base w-5/6"
    >
      <form onSubmit={handleSubmitCreationForm}>
        <Card>
          <Card.Header title="Edit Lockups" />

          <Card.Body>
            <div className="flex flex-col gap-2">
              <StyledText className="font-bold">
                New Lockup Duration:
              </StyledText>

              <InputForLockupPeriod
                currentLockupEndDate={currentLockupEndDate}
                selectedDuration={selectedDuration}
                className="w-full"
                classNamesForButtons="!w-full"
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-2 opacity-60">
              <p>{selectedLockups.length} lockups will be extended to end on</p>
              {selectedDuration === AllowedLockupPeriodInEpochs.ONE_EPOCH ? (
                <div className="h-5 w-24 animate-pulse rounded bg-gray-300"></div>
              ) : (
                <div className="flex items-center gap-2">
                  {dateFormatter.format(newEndDate)} (
                  <>
                    {pluralize({
                      count: Math.abs(daysUntilEndDate),
                      singular: "day",
                      prefixCount: true,
                    })}{" "}
                    {daysUntilEndDate > 0 ? "away" : "ago"}
                  </>
                  )
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <StyledText className="font-semibold">Locked Tokens</StyledText>
              <StyledText className="text-4xl font-bold text-palette-beige">
                {formatAmount(totalAmount, 0)}
              </StyledText>
            </div>
          </Card.Body>

          <Card.Footer>
            <StyledText
              variant="button.primary"
              as="button"
              type="submit"
              disabled={
                isLoading ||
                selectedDuration === AllowedLockupPeriodInEpochs.ONE_EPOCH
              }
            >
              Confirm
            </StyledText>

            <StyledText
              variant="button.secondary"
              as="button"
              type="button"
              onClick={handleCloseModal}
            >
              Cancel
            </StyledText>
          </Card.Footer>
        </Card>
      </form>
    </ModalWindow>
  )
}
