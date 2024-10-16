"use client"
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
import { CheckCircle, CircleSlash, Loader } from "lucide-react"
import {
    ChangeEvent,
    FormEvent,
    ReactNode,
    useEffect,
    useMemo,
    useState,
} from "react"
import { createPortal } from "react-dom"
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
    validatorMap,
    getRestEndpoint,
    getSigningCosmWasmClient,
    onSuccess,
}: EditLockupDurationProps) => {
    const [hasChanged, setHasChanged] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [toast, setToast] = useState<{
        type: "error" | "success" | "loading"
        message: ReactNode
    } | null>(null)

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
        if (open) return

        setFormValues(initialFormValues)
        setHasChanged(false)
        setIsLoading(false)
        setToast(null)
    }, [initialFormValues, open])

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
    const isLockupFromToday = isToday(
        new Date(Number(lockup?.lock_entry.lock_start ?? 0) / 1000000)
    )

    if (isLockupFromToday) {
        return <div>Lockup created today</div>
    }

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
                            gap-6
                        "
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="font-bold">Current End Date:</div>

                            <div className="flex items-center gap-2 opacity-60">
                                {dateFormatter.format(currentLockupEndDate)} (
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
                            <Button
                                variant="secondary"
                                type="submit"
                                disabled={isLoading || !hasChanged}
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
