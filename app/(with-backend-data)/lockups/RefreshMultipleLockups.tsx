"use client"

import { Card } from "@/components/Card"
import { InputForLockupPeriod } from "@/components/InputForLockupPeriod"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts"
import { FormEvent, useEffect, useState } from "react"
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
import { Icon } from "@/components/Icon"
import { executeWalletMergeLockups } from "@/contract-apis/executeWalletMergeLockups"
import { cn } from "@/lib/utils"
import { isNumber } from "lodash"
import { getTimeUnitFromNanos } from "@/lib/getTimeUnitFromNanos"

interface RefreshMultipleLockupsProps {
  initMerge: boolean
  lockups: AugmentedLockup[]
  isCreationModalOpen: boolean
  setIsCreationModalOpen: (isOpen: boolean) => void
  handleCreationModalWindowClose: () => void
  handleModalWindowCloseComplete: () => void
  refreshLockups: number[]
  handleRefreshLockups: () => void
}

export function RefreshMultipleLockups({
  initMerge,
  lockups,
  isCreationModalOpen,
  setIsCreationModalOpen,
  handleCreationModalWindowClose,
  handleModalWindowCloseComplete,
  refreshLockups,
  handleRefreshLockups,
}: RefreshMultipleLockupsProps) {
  const { setToasts } = useToasts()

  const { address, lockedAtomEpochInNanos } = useBackendData()
  const { getSigningCosmWasmClient } = useChain("neutron")

  const [selectedDuration, setSelectedDuration] = useState(
    AllowedLockupPeriodInEpochs.ONE_EPOCH
  )

  const [isLoading, setIsLoading] = useState(false)

  const dateFormatter = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  })

  const newEndDate = new Date((Date.now() * 1e6 + selectedDuration) / 1e6)

  const daysUntilEndDate = getDaysAway(newEndDate)

  const filteredLockups = lockups.filter((lockup) =>
    refreshLockups.includes(lockup.id)
  )

  const currentLockupEndDate = filteredLockups.reduce((max, current) => {
    const currentDate = current.dateEnd
    return currentDate > max ? currentDate : max
  }, new Date())

  const totalAmount = filteredLockups.reduce((sum, lockup) => {
    return sum + Number(lockup.funds.amount)
  }, 0)

  const lockupPeriodOptionsRaw = Object.values(AllowedLockupPeriodInEpochs)
    .filter(isNumber)
    .map((epochCount) => {
      const { value, unit } = getTimeUnitFromNanos(
        epochCount * lockedAtomEpochInNanos
      )
      return {
        label: `${pluralize({
          count: value,
          prefixCount: true,
          singular: unit,
        })}`,
        duration: epochCount * lockedAtomEpochInNanos,
      }
    })
    .filter((option) => {
      const newDurationEndDate = new Date(
        (Date.now() * 1e6 + option.duration) / 1e6
      )
      return !currentLockupEndDate
        ? true
        : currentLockupEndDate < newDurationEndDate
    })

  const lockupPeriodOptions = [
    lockupPeriodOptionsRaw.reduce(
      (max, o) => (o.duration > max.duration ? o : max),
      lockupPeriodOptionsRaw[0]
    ),
  ]

  async function handleChange(newDuration: number) {
    setSelectedDuration(newDuration)
  }

  async function handleSubmitCreationForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsLoading(true)

    try {
      if (initMerge) {
        setToasts([toastMessages.mergingLockups])

        await executeWalletMergeLockups({
          getSigningCosmWasmClient,
          address,
          lockIds: refreshLockups,
        })
      } else {
        setToasts([toastMessages.extendingLockups])

        await executeWalletExtendLockup({
          getSigningCosmWasmClient,
          address,
          lockId: refreshLockups,
          lockDurationInNanos: selectedDuration,
          type: "multiple",
        })
      }

      await revalidateTag("backendData")

      setToasts([
        initMerge
          ? toastMessages.mergingLockupsSuccess
          : toastMessages.extendingLockupsSuccess,
      ])
      handleRefreshLockups()
      setSelectedDuration(AllowedLockupPeriodInEpochs.ONE_EPOCH)
      setIsLoading(false)
      setIsCreationModalOpen(false)
    } catch (error) {
      setIsLoading(false)
      setToasts([
        initMerge
          ? toastMessages.mergingLockupsError(error as Error)
          : toastMessages.extendingLockupError(error as Error, "multiple"),
      ])
    }
  }

  function handleCloseModal() {
    handleCreationModalWindowClose()
    setSelectedDuration(AllowedLockupPeriodInEpochs.ONE_EPOCH)
  }

  useEffect(() => {
    if (!initMerge && !isCreationModalOpen) return
    function handleNewDuration() {
      return lockupPeriodOptions.map((item) =>
        setSelectedDuration(item?.duration)
      )
    }
    handleNewDuration()
  }, [initMerge, isCreationModalOpen])

  return (
    <ModalWindow
      isOpen={isCreationModalOpen}
      onClose={() => {
        handleCreationModalWindowClose()
      }}
      onCloseComplete={() => {
        handleModalWindowCloseComplete()
      }}
      className="w-6/6 px-3 md:w-[550px] md:px-0"
    >
      <form onSubmit={handleSubmitCreationForm}>
        <Card>
          <Card.Header title={`${initMerge ? "Merge" : " Edit"} Lockups`} />

          <Card.Body>
            <div className="flex flex-col gap-2">
              <StyledText className="font-bold">
                {initMerge ? "Review Lockup details" : "New Lockup Duration"}:
              </StyledText>
              {!initMerge ? (
                <InputForLockupPeriod
                  currentLockupEndDate={currentLockupEndDate}
                  selectedDuration={selectedDuration}
                  className="w-full"
                  classNamesForButtons="!w-full"
                  onChange={handleChange}
                />
              ) : null}
            </div>

            <div
              className={cn(
                "flex flex-row flex-wrap items-center text-xs opacity-60 md:inline-flex"
              )}
            >
              {initMerge ? (
                <span className="whitespace-nowrap">
                  The new lockup amount will be {formatAmount(totalAmount, 0)}{" "}
                  <span className="pr-1">
                    {filteredLockups[0]?.funds?.denomInfo?.humanReadableDenom}
                  </span>
                  and ends at
                </span>
              ) : (
                <span className="whitespace-nowrap">
                  {refreshLockups.length} lockups will be extended to end on
                </span>
              )}
              {selectedDuration === AllowedLockupPeriodInEpochs.ONE_EPOCH ? (
                <div className="mx-2 inline-block h-5 w-24 animate-pulse rounded bg-gray-300" />
              ) : (
                <span className="mx-1">
                  {" "}
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
                </span>
              )}
            </div>

            {!initMerge ? (
              <div className="flex flex-col">
                <StyledText className="font-semibold">Locked Tokens</StyledText>
                <StyledText className="text-palette-beige text-4xl font-bold">
                  {formatAmount(totalAmount, 0)}
                </StyledText>
              </div>
            ) : null}
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
              {isLoading ? (
                <div className="animate-spin text-lg">
                  <Icon name="solid:loader" />
                </div>
              ) : (
                "Confirm"
              )}
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