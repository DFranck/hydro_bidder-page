"use client"

import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"
import { InputForLockupPeriod } from "@/components/InputForLockupPeriod"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts/useToasts"
import { AllowedLockupPeriodInEpochs } from "@/config"
import { executeWalletExtendLockup } from "@/contract-apis/executeWalletExtendLockup"
import {
  getHydroQueryClient,
  getLSTQueryClient,
} from "@/contract-apis/getClient"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useRatioQuery } from "@/hooks/use-ratio"
import { calculateLockupVotingPower } from "@/lib/calculateLockupVotingPower"
import { formatAmount } from "@/lib/formatAmount"
import { getDaysAway } from "@/lib/getDaysAway"
import { pluralize } from "@/lib/pluralize"
import { revalidateTag } from "@/lib/revalidateTag"
import { cn } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { twMerge } from "tailwind-merge"

type EditLockupDurationProps = {
  lockup: AugmentedLockup | null
  isOpen: boolean
  onClose: () => void
  onCloseComplete: () => void
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
})

export function EditLockupDurationModal({
  lockup,
  isOpen,
  onClose: outerOnClose,
  onCloseComplete: outerOnCloseComplete,
}: EditLockupDurationProps) {
  const router = useRouter()
  const { address, lockedAtomEpochInNanos, currentRoundId } = useBackendData()
  const [hasChanged, setHasChanged] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { setToasts } = useToasts()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const [selectedDuration, setSelectedDuration] = useState(
    AllowedLockupPeriodInEpochs.ONE_EPOCH
  )
  const { data: ratio = 1 } = useRatioQuery(lockup, currentRoundId)
  const originalPower = lockup?.currentVotingPower ?? 0
  const newPower =
    calculateLockupVotingPower(
      (lockup?.funds.amount ?? 0) * 1e6,
      selectedDuration / lockedAtomEpochInNanos
    ) * ratio
  const currentLockupEndDate = lockup?.dateEnd ?? new Date()
  const daysUntilEndDate = getDaysAway(currentLockupEndDate)
  const powerDifference = newPower - originalPower

  function onClose() {
    setIsLoading(false)
    outerOnClose()
  }

  function onCloseComplete() {
    setIsLoading(false)
    outerOnCloseComplete()
  }

  async function handleChange(newDuration: number) {
    setSelectedDuration(newDuration)
    setHasChanged(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedDuration || !lockup) return

    setIsLoading(true)

    try {
      setToasts([toastMessages.extendingLockup])

      await executeWalletExtendLockup({
        getSigningCosmWasmClient,
        address,
        lockId: lockup.id,
        lockDurationInNanos: selectedDuration,
      })

      await revalidateTag("backendData")

      setToasts([toastMessages.extendingLockupSuccess])

      setTimeout(() => {
        router.refresh()
        router.push("/lockups")
        onCloseComplete()
      }, 3000)
    } catch (err: any) {
      if (err && err?.message && err.message.includes("Request rejected")) {
        setToasts([toastMessages.lockupExtendRequestRejected(err as Error)])
        return
      }

      setToasts([toastMessages.extendingLockupError(err as Error)])
    } finally {
      onClose()
    }
  }

  return (
    <ModalWindow
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={onCloseComplete}
      className="w-96 md:min-w-max"
    >
      <Card>
        <Card.Header title="Edit Lockup" />
        <Card.Body>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <div className="font-bold">Current End Date:</div>

              <div className="flex items-center gap-2 opacity-60">
                {dateFormatter.format(currentLockupEndDate)} (
                {daysUntilEndDate === 0 ? (
                  "today!"
                ) : (
                  <>
                    {pluralize({
                      count: Math.abs(daysUntilEndDate),
                      singular: "day",
                      prefixCount: true,
                    })}{" "}
                    {daysUntilEndDate > 0 ? "away" : "ago"}
                  </>
                )}
                )
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-bold">New Lockup Duration:</div>

              <InputForLockupPeriod
                currentLockupEndDate={currentLockupEndDate}
                selectedDuration={selectedDuration}
                className="w-full"
                classNamesForButtons="!w-full"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4  md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="text-sm md:text-lg">
                  Locked {lockup?.funds.denomInfo?.humanReadableDenom}
                </div>
                <div className="text-xl font-bold text-palette-beige md:text-3xl">
                  {formatAmount(lockup?.funds.amount ?? 0, 0)}
                </div>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="text-sm md:text-lg"> Voting Power</div>

                <div
                  className={cn(
                    "text-xl font-bold text-palette-beige md:text-3xl"
                  )}
                >
                  {formatAmount(originalPower)}
                </div>
              </div>
              <div className="relative flex flex-col items-center text-center">
                <div className="text-sm md:text-lg">New Voting Power</div>
                <div
                  className={cn(
                    "text-xl font-bold text-palette-beige md:text-3xl",
                    powerDifference > 0 && "text-palette-green"
                  )}
                >
                  {formatAmount(newPower)}
                </div>
              </div>
            </div>

            <div className="flex flex-row-reverse gap-2">
              <StyledText
                as="button"
                variant="button.primary"
                type="submit"
                disabled={isLoading || !hasChanged}
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
                as="button"
                variant="button.secondary"
                type="button"
                disabled={isLoading}
                onClick={outerOnClose}
              >
                Cancel
              </StyledText>
            </div>
          </form>
        </Card.Body>
      </Card>
    </ModalWindow>
  )
}
