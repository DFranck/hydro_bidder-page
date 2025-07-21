"use client"

import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts/useToasts"
import { executeWalletSplitLockup } from "@/contract-apis/executeWalletSplitLockup"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { revalidateTag } from "@/lib/revalidateTag"
import { useChain } from "@cosmos-kit/react"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { Slider } from "./ui/slider"
import { cn } from "@/lib/utils"

type SplitLockupModalProps = {
  lockup: AugmentedLockup | null
  isOpen: boolean
  onClose: () => void
  onCloseComplete: () => void
}

const MIN_SPLIT_LOCK_SIZE = 10000 / 1e6

export function SplitLockupModal({
  lockup,
  isOpen,
  onClose: outerOnClose,
  onCloseComplete: outerOnCloseComplete,
}: SplitLockupModalProps) {
  const maxTokenToBeSplitted = lockup?.funds.amount ?? 0
  const router = useRouter()
  const { address } = useBackendData()
  const [isLoading, setIsLoading] = useState(false)
  const { setToasts } = useToasts()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const [tokenBalance, TokenBalance] = useState(0)
  const [splitAmount, setSplitAmount] = useState(0)
  const [inputError, setInputError] = useState(false)
  const [sliderValue, setSliderValue] = useState([0])

  const maxTokenAmount =
    maxTokenToBeSplitted - MIN_SPLIT_LOCK_SIZE < MIN_SPLIT_LOCK_SIZE
      ? MIN_SPLIT_LOCK_SIZE
      : maxTokenToBeSplitted - MIN_SPLIT_LOCK_SIZE

  const oldLockupLimit = tokenBalance < MIN_SPLIT_LOCK_SIZE
  const newLockupLimit = splitAmount < MIN_SPLIT_LOCK_SIZE

  function onClose() {
    setIsLoading(false)
    outerOnClose()
  }

  const handleReset = () => {
    setSliderValue([(MIN_SPLIT_LOCK_SIZE / maxTokenToBeSplitted) * 100])
    TokenBalance(maxTokenToBeSplitted)
    setSplitAmount(MIN_SPLIT_LOCK_SIZE)
    setInputError(false)
  }

  function onCloseComplete() {
    setIsLoading(false)
    outerOnCloseComplete()
    handleReset()
  }

  const handleAllocationChange = (value: string) => {
    const numValue = Number.parseFloat(value)

    if (isNaN(numValue) || numValue < MIN_SPLIT_LOCK_SIZE) {
      setInputError(true)
      return
    }

    const maxAllowedB = maxTokenToBeSplitted - MIN_SPLIT_LOCK_SIZE
    const clampedValue = Math.min(numValue, maxAllowedB)
    const newTokenBalance = maxTokenToBeSplitted - clampedValue

    if (newTokenBalance < MIN_SPLIT_LOCK_SIZE) {
      setInputError(true)
      return
    }

    setInputError(false)
    setSplitAmount(clampedValue)
    TokenBalance(newTokenBalance)

    const newPercentage = (newTokenBalance / maxTokenToBeSplitted) * 100
    setSliderValue([newPercentage])
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!lockup) return

    setIsLoading(true)

    try {
      setToasts([toastMessages.splittingLockup])

      await executeWalletSplitLockup({
        getSigningCosmWasmClient,
        address,
        amount: String(splitAmount * 1e6),
        lockId: lockup.id,
      })

      await revalidateTag("backendData")

      setToasts([toastMessages.splittingLockupSuccess])

      onCloseComplete()
      setTimeout(() => {
        router.refresh()
        router.push("/lockups")
      }, 3000)
    } catch (err: any) {
      if (err && err?.message && err.message.includes("Request rejected")) {
        setToasts([toastMessages.lockupRequestRejected(err as Error)])
        return
      }

      setToasts([toastMessages.splittingLockupError(err as Error)])
    } finally {
      onClose()
    }
  }

  useEffect(() => {
    handleReset()
  }, [maxTokenToBeSplitted])

  useEffect(() => {
    const percentageA = sliderValue[0]
    const newTokenBalance = (maxTokenToBeSplitted * percentageA) / 100
    const newSplitAmount = maxTokenToBeSplitted - newTokenBalance

    TokenBalance(Number(newSplitAmount.toFixed(3)))
    setSplitAmount(Number(newTokenBalance.toFixed(3)))
  }, [sliderValue])

  return (
    <ModalWindow
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={onCloseComplete}
      className="w-96"
    >
      <Card>
        <Card.Header title="Split Lockup" />
        <Card.Body>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <StyledText className="text-sm font-medium">
                Allocation Split
              </StyledText>
              <div className="flex flex-col gap-4">
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  min={0}
                  step={0.1}
                  className="w-full rounded-md"
                  disabled={isLoading}
                />
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>0%</span>
                  <span className="font-medium">
                    {(100 - sliderValue[0]).toFixed(1)}% /{" "}
                    {sliderValue[0].toFixed(1)}%
                  </span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 min-h-28">
              <div className="space-y-2">
                <StyledText className="text-sm font-medium">
                  Old Lockup Amount
                </StyledText>
                <StyledText
                  as="input"
                  variant="input.text"
                  id="allocation-a"
                  type="number"
                  value={tokenBalance}
                  min={formatAmount(MIN_SPLIT_LOCK_SIZE, 0)}
                  disabled={true}
                  className="w-full"
                />
                {oldLockupLimit && (
                  <p className="text-xs text-red-500">
                    Min: {MIN_SPLIT_LOCK_SIZE}{" "}
                    {lockup?.funds.denomInfo?.humanReadableDenom}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <StyledText className="text-sm font-medium">
                  New Lockup Amount
                </StyledText>
                <StyledText
                  as="input"
                  variant="input.text"
                  id="allocation-b"
                  type="number"
                  value={splitAmount}
                  onChange={(e) => handleAllocationChange(e.target.value)}
                  min={formatAmount(MIN_SPLIT_LOCK_SIZE, 0)}
                  step={"any"}
                  max={maxTokenAmount}
                  className={cn("w-full", { "border-red-500": inputError })}
                  disabled={isLoading}
                />
                {newLockupLimit && (
                  <p className="text-xs text-red-500">
                    Min: {MIN_SPLIT_LOCK_SIZE}{" "}
                    {lockup?.funds.denomInfo?.humanReadableDenom}
                  </p>
                )}

                {splitAmount > maxTokenAmount && (
                  <p className="text-xs text-red-500">
                    Max: {formatAmount(maxTokenAmount, 0)}{" "}
                    {lockup?.funds.denomInfo?.humanReadableDenom}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-center text-center">
                <div>Locked {lockup?.funds.denomInfo?.humanReadableDenom}</div>
                <div className="text-3xl font-bold text-palette-beige">
                  {formatAmount(maxTokenToBeSplitted ?? 0, 0)}
                </div>
              </div>
            </div>

            <div className="flex flex-row-reverse gap-2">
              <StyledText
                as="button"
                variant="button.primary"
                type="submit"
                disabled={isLoading || oldLockupLimit || newLockupLimit}
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
