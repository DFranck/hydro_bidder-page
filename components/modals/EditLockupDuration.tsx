"use client"
import { fetchDenomTrace } from "@/app/lock-atom/transactions"
import { LockEntryWithPower } from "@/app/ts_types/HydroBase.types"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { DialogDescription } from "@radix-ui/react-dialog"
import { isEqual } from "lodash"
import { CheckCircle, CircleSlash, Loader, Plus } from "lucide-react"
import { ChangeEvent, FormEvent, ReactNode, useState } from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"

interface FormValues {
    lockupPeriod: LockupPeriod
    shares: string
    power: string
    validator: string
}

type EditLockupDurationProps = {
    lockup: LockEntryWithPower
    walletAddress: string
    validatorMap: Map<string, Validator>
    getRestEndpoint: () => Promise<string | ExtendedHttpEndpoint>
    getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
    onSuccess: () => void
}

const classNamesForRadioButtons = `
    peer
    size-6
    appearance-none
    rounded-full
    border-2
    border-palette-green
    checked:bg-palette-green
    checked:[box-shadow:0_0_0_2px_black_inset]
`

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

export const EditLockupDuration = ({
    lockup,
    walletAddress,
    validatorMap,
    getRestEndpoint,
    getSigningCosmWasmClient,
    onSuccess,
}: EditLockupDurationProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [toast, setToast] = useState<{
        type: "error" | "success" | "loading"
        message: ReactNode
    } | null>(null)

    const [formValues, setFormValues] = useState<FormValues>({
        lockupPeriod: LockupPeriod.ONE_EPOCH,
        shares: formatAmount(lockup.lock_entry.funds.amount),
        power: calculateLockupVotingPower(
            parseInt(lockup.lock_entry.funds.amount),
            LockupPeriod.ONE_EPOCH
        ).toString(),
        validator: "",
    })

    async function handleChange(event: ChangeEvent<HTMLFormElement>) {
        const formElement = event.currentTarget as HTMLFormElement
        const formData = new FormData(formElement)
        const values = Object.fromEntries(formData.entries())

        if (isEqual(formValues, values)) {
            return
        }

        setIsLoading(true)

        const endpoint = await getRestEndpoint()
        const trace = await fetchDenomTrace(
            lockup.lock_entry.funds,
            endpoint as string
        )

        setIsLoading(false)

        if (!trace) return

        const lockupPeriod = values["lockupPeriod"] as LockupPeriod

        setFormValues((currentFormValues) => ({
            ...currentFormValues,
            ...values,
            lockupPeriod,
            power: calculateLockupVotingPower(
                parseInt(lockup.lock_entry.funds.amount),
                lockupPeriod
            ).toString(),
            validator:
                validatorMap.get(trace.validator)?.description.moniker ||
                "Unknown Validator",
        }))
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setIsLoading(true)

        if (!formValues.lockupPeriod || !lockup) return

        try {
            setToast({
                type: "loading",
                message: "Refreshing lockup...",
            })

            await executeExtendLockup(
                getSigningCosmWasmClient,
                walletAddress || "",
                lockup.lock_entry.lock_id,
                LockupPeriodMultipler[formValues.lockupPeriod]
            )

            setToast({
                type: "success",
                message: "Lockup refreshed successfully!",
            })
            setOpen(false)
            onSuccess()
        } catch (err: any) {
            if (
                err &&
                err?.message &&
                err.message.includes("Request rejected")
            ) {
                setToast({
                    type: "error",
                    message: "Request rejected",
                })

                return
            }

            setToast({
                type: "error",
                message: `Error refreshing lockup: ${err}`,
            })
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
    const currentDaysDifference = getDaysAway(currentLockupEnd)
    const newDaysDifference = getDaysAway(
        Date.now() * 1000000 + getLockupTimeNanoseconds(formValues.lockupPeriod)
    )
    const daysDifferenceBeforeAfter = newDaysDifference - currentDaysDifference

    return (
        <>
            {toast &&
                createPortal(
                    <div
                        className={twMerge(
                            `
                                fixed
                                bottom-6
                                right-6
                                z-[50]
                                flex
                                w-96
                                gap-3
                                rounded-lg
                                p-3
                                text-sm
                                text-palette-text
                                *:shrink-0
                            `,
                            toast.type === "error" &&
                                "bg-palette-red text-white",
                            toast.type === "success" && "bg-palette-green",
                            toast.type === "loading" && "bg-palette-beige"
                        )}
                    >
                        {toast.type === "error" && (
                            <CircleSlash
                                className="
                                    size-4
                                "
                            />
                        )}
                        {toast.type === "success" && (
                            <CheckCircle
                                className="
                                    size-4
                                "
                            />
                        )}
                        {toast.type === "loading" && (
                            <Loader
                                className="
                                    size-4
                                    animate-spin
                                "
                            />
                        )}
                        {toast.message}

                        <Button
                            className={twMerge(
                                toast.type === "loading" && "hidden",
                                toast.type === "success" &&
                                    "border-palette-text text-palette-text"
                            )}
                            variant="outline"
                            type="button"
                            onClick={() => setToast(null)}
                        >
                            Dismiss
                        </Button>
                    </div>,
                    document.body
                )}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger
                    asChild
                    id={`edit-lockup-duration-${lockup.lock_entry.lock_id}`}
                >
                    <Button>Refresh Lockup</Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col gap-12">
                    <DialogHeader>
                        <DialogTitle>Refresh Lockup</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="sr-only">
                        Refresh Lockup
                    </DialogDescription>

                    <form
                        className="
                        flex
                        flex-col
                        gap-12
                    "
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="font-bold">Select an End Date:</div>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="lockupPeriod"
                                    value=""
                                    defaultChecked
                                    className={classNamesForRadioButtons}
                                />
                                <span className={classNamesForRadioLabels}>
                                    {dateFormatter.format(currentLockupEndDate)}{" "}
                                    (
                                    {relativeTimeFormatter.format(
                                        Math.floor(
                                            (currentLockupEndDate.getTime() -
                                                new Date().getTime()) /
                                                (1000 * 60 * 60 * 24)
                                        ),
                                        "day"
                                    )}{" "}
                                    • Current End Date)
                                </span>
                            </label>

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
                                            <input
                                                type="radio"
                                                name="lockupPeriod"
                                                value={value}
                                                className={
                                                    classNamesForRadioButtons
                                                }
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

                        <div className="flex -translate-y-3 items-center justify-around gap-3">
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
                                <div>New Voting Power</div>
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
                                    {formatAmount(formValues.power)}
                                </div>
                                {powerDifference > 0 && (
                                    <div
                                        className="
                                        absolute
                                        left-1/2
                                        top-full
                                        flex
                                        -translate-x-1/2
                                        items-center
                                        gap-px
                                        rounded-full
                                        bg-palette-green
                                        px-2
                                        py-1
                                        text-xs
                                        font-bold
                                        text-palette-text
                                    "
                                    >
                                        <Plus className="size-3" />
                                        <span>{powerDifference * 100}%</span>
                                    </div>
                                )}
                            </div>

                            <div className="relative flex flex-col items-center text-center">
                                <div>Days Left</div>
                                <div
                                    className={twMerge(
                                        `
                                        text-4xl
                                        font-bold
                                        text-palette-beige
                                    `,
                                        daysDifferenceBeforeAfter > 0 &&
                                            "text-palette-green"
                                    )}
                                >
                                    {newDaysDifference || currentDaysDifference}
                                </div>
                                {daysDifferenceBeforeAfter > 0 && (
                                    <div
                                        className="
                                        absolute
                                        left-1/2
                                        top-full
                                        flex
                                        -translate-x-1/2
                                        items-center
                                        gap-px
                                        rounded-full
                                        bg-palette-green
                                        px-2
                                        py-1
                                        text-xs
                                        font-bold
                                        text-palette-text
                                    "
                                    >
                                        <Plus className="size-3" />
                                        <span>{daysDifferenceBeforeAfter}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                variant="secondary"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader
                                        className="
                                        size-4
                                        animate-spin
                                    "
                                    />
                                ) : (
                                    "Confirm"
                                )}
                            </Button>

                            <DialogClose asChild>
                                <Button
                                    disabled={isLoading}
                                    type="button"
                                    variant="outline"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
