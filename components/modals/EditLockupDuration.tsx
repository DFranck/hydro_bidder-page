"use client"

import { LockEntryWithPower } from "@/app/ts_types/HydroBase.types"
import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts/Toasts"
import { executeExtendLockup, Validator } from "@/hooks/hooks"
import {
    calculateLockupVotingPower,
    formatAmount,
    getLockupTimeNanoseconds,
    LockupPeriod,
    LockupPeriodMultipler,
} from "@/lib/utils"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { ExtendedHttpEndpoint } from "@cosmos-kit/core"
import { isEqual } from "lodash"
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { twMerge } from "tailwind-merge"

interface FormValues {
    lockupPeriod: LockupPeriod
    shares: string
    power: string
}

type EditLockupDurationProps = {
    lockup: LockEntryWithPower
    walletAddress: string
    validatorMap: Map<string, Validator>
    getRestEndpoint: () => Promise<string | ExtendedHttpEndpoint>
    getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
    onSuccess: () => void
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

function isToday(date: Date): boolean {
    const today = new Date()
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    )
}

export const EditLockupDuration = ({
    lockup,
    walletAddress,
    getSigningCosmWasmClient,
    onSuccess,
}: EditLockupDurationProps) => {
    const [hasChanged, setHasChanged] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isLockupModalOpen, setIsLockupModalOpen] = useState(false)
    const { setToasts } = useToasts()

    const initialFormValues = useMemo(
        () => ({
            lockupPeriod: LockupPeriod.ONE_EPOCH,
            shares: formatAmount(lockup.lock_entry.funds.amount),
            power: calculateLockupVotingPower(
                parseInt(lockup.lock_entry.funds.amount),
                LockupPeriod.ONE_EPOCH
            ).toString(),
        }),
        [lockup.lock_entry.funds.amount]
    )

    const [formValues, setFormValues] = useState<FormValues>(initialFormValues)

    useEffect(() => {
        if (isLockupModalOpen) return

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

        const lockupPeriod = values["lockupPeriod"] as LockupPeriod

        setFormValues((currentFormValues) => ({
            ...currentFormValues,
            ...values,
            lockupPeriod,
            power: calculateLockupVotingPower(
                parseInt(lockup.lock_entry.funds.amount),
                lockupPeriod
            ).toString(),
        }))
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setIsLoading(true)

        if (!formValues.lockupPeriod || !lockup) return

        try {
            setToasts((prevToasts) => [
                ...prevToasts,
                {
                    variant: "working",
                    message: "Refreshing lockup...",
                },
            ])

            await executeExtendLockup(
                getSigningCosmWasmClient,
                walletAddress || "",
                lockup.lock_entry.lock_id,
                LockupPeriodMultipler[formValues.lockupPeriod]
            )

            setToasts((prevToasts) => [
                ...prevToasts,
                {
                    variant: "success",
                    message: "Lockup refreshed successfully!",
                },
            ])
            setIsLockupModalOpen(false)
            onSuccess()
        } catch (err: any) {
            if (
                err &&
                err?.message &&
                err.message.includes("Request rejected")
            ) {
                setToasts((prevToasts) => [
                    ...prevToasts,
                    {
                        variant: "error",
                        message: "Request rejected",
                    },
                ])

                return
            }

            setToasts((prevToasts) => [
                ...prevToasts,
                {
                    variant: "error",
                    message: `Error refreshing lockup: ${err}`,
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    function getDaysAway(lockupEnd: number) {
        const newLockupEndDate = new Date(lockupEnd / 1000000)

        return Math.floor(
            (newLockupEndDate.getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
        )
    }

    const currentLockupEnd = Number(lockup.lock_entry.lock_end)
    const currentLockupEndDate = new Date(currentLockupEnd / 1000000)
    const powerDifference =
        Number(formValues.power) - Number(lockup.current_voting_power)
    const isLockupFromToday = isToday(
        new Date(Number(lockup?.lock_entry.lock_start ?? 0) / 1000000)
    )

    if (isLockupFromToday) {
        return <div>Lockup created today</div>
    }

    return (
        <>
            <ModalWindow
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
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                        >
                            <div className="flex flex-col gap-2">
                                <div className="font-bold">
                                    Current End Date:
                                </div>

                                <div className="flex items-center gap-2 opacity-60">
                                    {dateFormatter.format(currentLockupEndDate)}{" "}
                                    (
                                    {relativeTimeFormatter.format(
                                        Math.floor(
                                            (currentLockupEndDate.getTime() -
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

                                {Object.entries(LockupPeriod).map(
                                    ([name, value]) => {
                                        const newLockupEnd =
                                            Date.now() * 1000000 +
                                            getLockupTimeNanoseconds(value)

                                        // Don't show an option to refresh a lockup to a time before its current end time
                                        if (currentLockupEnd >= newLockupEnd)
                                            return null

                                        const newLockupEndDate = new Date(
                                            newLockupEnd / 1000000
                                        )

                                        const daysDifference =
                                            getDaysAway(newLockupEnd)

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
                                                    value={value}
                                                />
                                                <span
                                                    className={
                                                        classNamesForRadioLabels
                                                    }
                                                >
                                                    {dateFormatter.format(
                                                        newLockupEndDate
                                                    )}{" "}
                                                    (
                                                    {relativeTimeFormatter.format(
                                                        daysDifference,
                                                        "day"
                                                    )}
                                                    )
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
                                    <div>
                                        {hasChanged && "New "}Voting Power
                                    </div>
                                    <div
                                        className={twMerge(
                                            `
                                                text-4xl
                                                font-bold
                                                text-palette-beige
                                            `,
                                            powerDifference > 0 &&
                                                "text-palette-green"
                                        )}
                                    >
                                        {formatAmount(
                                            hasChanged
                                                ? formValues.power
                                                : lockup.current_voting_power
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
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
