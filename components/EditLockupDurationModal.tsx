"use client"

import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"
import { InputForLockupPeriod } from "@/components/InputForLockupPeriod"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts/useToasts"
import { AllowedLockupPeriodInEpochs } from "@/config"
import { executeWalletExtendLockup } from "@/contract-apis/executeWalletExtendLockup"
import { SanitizedLockup } from "@/contract-apis/fetchBackendDataWithWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { calculateLockupVotingPower } from "@/lib/calculateLockupVotingPower"
import { formatAmount } from "@/lib/formatAmount"
import { useChain } from "@cosmos-kit/react"
import { FormEvent, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { isToday } from "../lib/isToday"

interface FormValues {
  lockupPeriod: number
  shares: string
  power: string
}

type EditLockupDurationProps = {
  lockup: SanitizedLockup
  onSuccess?: () => void
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "short",
})

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
})

export function EditLockupDurationModal({
  lockup,
  onSuccess,
}: EditLockupDurationProps) {
  const { address, lockupEpochLength } = useBackendData()
  const [hasChanged, setHasChanged] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLockupModalOpen, setIsLockupModalOpen] = useState(false)
  const { setToasts } = useToasts()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const [selectedDuration, setSelectedDuration] = useState(
    AllowedLockupPeriodInEpochs.ONE_EPOCH
  )
  const originalPower = lockup.currentVotingPower
  const newPower = calculateLockupVotingPower(
    lockup.funds.amount * 1e6,
    selectedDuration / lockupEpochLength
  )
  const currentLockupEndDate = lockup.dateEnd
  const powerDifference = newPower - originalPower
  const isLockupFromToday = isToday(lockup.dateStart)

  useEffect(() => {
    if (isLockupModalOpen) return
    setHasChanged(false)
    setIsLoading(false)
    setToasts([])
  }, [isLockupModalOpen])

  async function handleChange(newDuration: number) {
    setSelectedDuration(newDuration)
    setHasChanged(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedDuration || !lockup) return

    setIsLoading(true)

    try {
      setToasts([
        {
          variant: "working",
          message: "Refreshing lockup...",
        },
      ])

      await executeWalletExtendLockup({
        getSigningCosmWasmClient,
        address,
        lockId: lockup.id,
        lockDurationInNanos: selectedDuration,
      })

      setToasts([
        {
          variant: "success",
          message: "Lockup refreshed successfully!",
        },
      ])
      setIsLockupModalOpen(false)
      onSuccess?.()
    } catch (err: any) {
      if (err && err?.message && err.message.includes("Request rejected")) {
        setToasts([
          {
            variant: "error",
            message: "Request rejected",
          },
        ])

        return
      }

      setToasts([
        {
          variant: "error",
          message: `Error refreshing lockup: ${err}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLockupFromToday) {
    return <div>Lockup created today</div>
  }

  return (
    <>
      <StyledText
        as="button"
        variant="button.secondary"
        onClick={() => setIsLockupModalOpen(true)}
      >
        Refresh Lockup
      </StyledText>

      <ModalWindow
        className="w-96"
        isOpen={isLockupModalOpen}
        onClose={() => setIsLockupModalOpen(false)}
      >
        <Card>
          <Card.Header title="Refresh Lockup" />
          <Card.Body>
            <form
              className="
                flex
                flex-col
                gap-6
              "
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-2">
                <div className="font-bold">Current End Date:</div>

                <div className="flex items-center gap-2 opacity-60">
                  {dateFormatter.format(currentLockupEndDate)} (
                  {relativeTimeFormatter.format(
                    Math.floor(
                      (currentLockupEndDate.getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    ),
                    "day"
                  )}
                  )
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="font-bold">New End Date:</div>

                <InputForLockupPeriod
                  currentLockupEndDate={currentLockupEndDate}
                  selectedDuration={selectedDuration}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-around gap-3">
                <div className="flex flex-col items-center text-center">
                  <div>Locked ATOM</div>
                  <div
                    className="
                      text-4xl
                      font-bold
                      text-palette-beige
                    "
                  >
                    {formatAmount(lockup.funds.amount)}
                  </div>
                </div>

                <div className="relative flex flex-col items-center text-center">
                  <div>{hasChanged && "New "}Voting Power</div>
                  <div
                    className={twMerge(
                      `
                        text-4xl
                        font-bold
                        text-palette-beige
                      `,
                      powerDifference > 0 && "text-palette-green"
                    )}
                  >
                    {formatAmount(hasChanged ? newPower : originalPower)}
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
                    <div
                      className={`
                        animate-spin
                        text-lg
                      `}
                    >
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
                  onClick={() => setIsLockupModalOpen(false)}
                >
                  Cancel
                </StyledText>
              </div>
            </form>
          </Card.Body>
        </Card>
      </ModalWindow>
    </>
  )
}
