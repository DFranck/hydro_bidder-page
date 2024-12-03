"use client"

import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts/useToasts"
import { AllowedLockupPeriodInEpochs } from "@/config"
import { executeWalletExtendLockup } from "@/contract-apis/executeWalletExtendLockup"
import { SanitizedLockup } from "@/contract-apis/fetchBackendDataWithWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { getDaysAway } from "@/lib/getDaysAway"
import { calculateLockupVotingPower, formatAmount } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { isEqual } from "lodash"
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { twMerge } from "tailwind-merge"

interface FormValues {
  lockupPeriod: number
  shares: string
  power: string
}

type EditLockupDurationProps = {
  lockup: SanitizedLockup
  onSuccess?: () => void
}

const classNamesForRadioLabels = `
    transition-all
    opacity-60
    peer-checked:opacity-100
    peer-checked:font-bold
`

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "short",
})

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
})

function isToday(date: Date | string): boolean {
  if (typeof date === "string") {
    date = new Date(date)
  }

  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export function EditLockupDurationModal({
  lockup,
  onSuccess,
}: EditLockupDurationProps) {
  const { address, lockupEpochLength } = useBackendData()
  const [hasChanged, setHasChanged] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLockupModalOpen, setIsLockupModalOpen] = useState(false)
  const { setToasts } = useToasts()
  const formElementRef = useRef<HTMLFormElement>(null)
  const { getSigningCosmWasmClient } = useChain("neutron")
  const initialFormValues = useMemo(
    () => ({
      lockupPeriod: AllowedLockupPeriodInEpochs.ONE_EPOCH,
      shares: formatAmount(lockup.funds.amount),
      power: calculateLockupVotingPower(
        parseInt(lockup.funds.amount),
        AllowedLockupPeriodInEpochs.ONE_EPOCH
      ).toString(),
    }),
    [lockup.funds.amount]
  )
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues)
  const currentLockupEndDate = lockup.dateEnd
  const powerDifference =
    Number(formValues.power) - Number(lockup.currentVotingPower)
  const isLockupFromToday = isToday(lockup.dateStart)

  useEffect(() => {
    if (isLockupModalOpen) return

    formElementRef.current?.reset()
    setFormValues(initialFormValues)
    setHasChanged(false)
    setIsLoading(false)
    setToasts([])
  }, [initialFormValues, isLockupModalOpen])

  async function handleChange(event: ChangeEvent<HTMLFormElement>) {
    const formElement = event.currentTarget as HTMLFormElement
    const formData = new FormData(formElement)
    const values = Object.fromEntries(formData.entries())

    if (isEqual(formValues, values)) {
      return
    }
    setHasChanged(true)

    const lockupPeriod = Number(values["lockupPeriod"])

    setFormValues((currentFormValues) => ({
      ...currentFormValues,
      ...values,
      lockupPeriod,
      power: calculateLockupVotingPower(
        parseInt(lockup.funds.amount),
        lockupPeriod
      ).toString(),
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsLoading(true)

    if (!formValues.lockupPeriod || !lockup) return

    try {
      setToasts([
        {
          variant: "working",
          message: "Refreshing lockup...",
        },
      ])

      await executeWalletExtendLockup({
        getSigningCosmWasmClient,
        address: address || "",
        lockId: lockup.id,
        lockDuration: formValues.lockupPeriod * lockupEpochLength,
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

  const currentLockupEndDateForSure =
    typeof currentLockupEndDate === "string"
      ? new Date(currentLockupEndDate)
      : currentLockupEndDate

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
              ref={formElementRef}
              onChange={handleChange}
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-2">
                <div className="font-bold">Current End Date:</div>

                <div className="flex items-center gap-2 opacity-60">
                  {dateFormatter.format(currentLockupEndDateForSure)} (
                  {relativeTimeFormatter.format(
                    Math.floor(
                      (currentLockupEndDateForSure.getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    ),
                    "day"
                  )}
                  )
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="font-bold">New End Date:</div>

                {Object.entries(AllowedLockupPeriodInEpochs).map(
                  ([name, value]) => {
                    const newLockupEndDate = new Date(
                      (Date.now() * 1e6 + lockupEpochLength * Number(value)) /
                        1e6
                    )

                    // Don't show an option to refresh a lockup to a time before its current end time
                    if (currentLockupEndDate >= newLockupEndDate) return null

                    const daysDifference = getDaysAway(newLockupEndDate)

                    return (
                      <label
                        className="group flex items-center gap-2"
                        key={name}
                      >
                        <StyledText
                          as="input"
                          variant="input.radio"
                          type="radio"
                          name="lockupPeriod"
                          value={Number(value)}
                        />
                        <span className={classNamesForRadioLabels}>
                          {dateFormatter.format(newLockupEndDate)} (
                          {relativeTimeFormatter.format(daysDifference, "day")})
                        </span>
                      </label>
                    )
                  }
                )}
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
                    {formValues.shares}
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
                    {formatAmount(
                      hasChanged ? formValues.power : lockup.currentVotingPower
                    )}
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
