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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    ToastAborted,
    ToastError,
    ToastExecutedTx,
    ToastProcessing,
} from "@/components/ui/toast-wallet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { executeExtendLockup, Validator } from "@/hooks/hooks"
import {
    calculateLockupVotingPower,
    formatAmount,
    LockupPeriod,
    LockupPeriodMultipler,
} from "@/lib/utils"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { ExtendedHttpEndpoint } from "@cosmos-kit/core"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Loader2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    lockupPeriod: z.nativeEnum(LockupPeriod),
    shares: z.string(),
    power: z.string(),
    validator: z.string(),
})

type EditLockupDurationProps = {
    lockup: LockEntryWithPower
    walletAddress: string
    validatorMap: Map<string, Validator>
    getRestEndpoint: () => Promise<string | ExtendedHttpEndpoint>
    getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
    onSuccess: () => void
}

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lockupPeriod: LockupPeriod.ONE_EPOCH,
            shares: formatAmount(lockup.lock_entry.funds.amount),
            power: calculateLockupVotingPower(
                parseInt(lockup.lock_entry.funds.amount),
                LockupPeriod.ONE_EPOCH
            ).toString(),
            validator: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        if (!values.lockupPeriod || !lockup) {
            return
        }
        try {
            ToastProcessing()
            await executeExtendLockup(
                getSigningCosmWasmClient,
                walletAddress || "",
                lockup.lock_entry.lock_id,
                LockupPeriodMultipler[values.lockupPeriod]
            )
            ToastExecutedTx("Success", "Lockup extended.")
            setOpen(false)
            onSuccess()
        } catch (err: any) {
            if (
                err &&
                err?.message &&
                err.message.includes("Request rejected")
            ) {
                ToastAborted()
                return
            }
            ToastError(err)
            setOpen(false)
        } finally {
            setIsLoading(false)
        }
    }

    const onChangeLockupPeriod = (value: LockupPeriod) => {
        form.setValue("lockupPeriod", value)
        form.setValue(
            "power",
            calculateLockupVotingPower(
                parseInt(lockup.lock_entry.funds.amount),
                value
            ).toString()
        )
    }

    useEffect(() => {
        const resolveValidator = async () => {
            if (open && lockup && lockup.lock_entry.funds.denom) {
                const endpoint = await getRestEndpoint()
                const trace = await fetchDenomTrace(
                    lockup.lock_entry.funds,
                    endpoint as string
                )

                if (trace) {
                    form.setValue(
                        "validator",
                        validatorMap.get(trace.validator)?.description
                            .moniker || "Unknown Validator"
                    )
                }
            }
        }
        resolveValidator()
    }, [open, getRestEndpoint, validatorMap, lockup, form])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                asChild
                id={`edit-lockup-duration-${lockup.lock_entry.lock_id}`}
            >
                <Button className="h-10 rounded-lg border-y-4 border-transparent bg-white text-black hover:border-b-[#C7C7C7] hover:bg-white">
                    Extend Lockup
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[698px] rounded-[10px] border-none bg-neutral-900 p-12 text-white">
                <DialogDescription className="sr-only">
                    Extend Lockup
                </DialogDescription>
                <DialogHeader className="pb-[34px]">
                    <DialogTitle className="mb-[10px] text-[32px] font-bold not-italic leading-[120%] tracking-[-0.4px]">
                        Extend Lockup
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-5 grid gap-5 [&>*:last-child]:mt-[30px]"
                    >
                        <FormField
                            control={form.control}
                            name="lockupPeriod"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-start gap-[56px]">
                                        <FormLabel className="w-[100px] text-sm font-normal not-italic leading-[120%] opacity-60">
                                            Extend Lockup Time:
                                        </FormLabel>
                                        <FormControl>
                                            <ToggleGroup
                                                type="single"
                                                className="gap-[10px]"
                                                defaultValue={form.getValues(
                                                    "lockupPeriod"
                                                )}
                                            >
                                                {Object.entries(
                                                    LockupPeriod
                                                ).map(([name, value]) => (
                                                    <ToggleGroupItem
                                                        key={name}
                                                        value={value}
                                                        className="inline-flex h-[30px] shrink-0 items-center justify-center gap-2.5 rounded-[100px] bg-[rgba(255,255,255,0.40)] px-4 py-0 text-center text-base font-medium not-italic leading-[21px] text-[#080815]"
                                                        onClick={() =>
                                                            onChangeLockupPeriod(
                                                                value as LockupPeriod
                                                            )
                                                        }
                                                    >
                                                        {value}
                                                    </ToggleGroupItem>
                                                ))}
                                            </ToggleGroup>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-[56px]">
                            <FormLabel className="w-[100px] text-sm opacity-60">
                                Locked ATOM:
                            </FormLabel>
                            <p className="text-xl">{form.watch("shares")}</p>
                        </div>

                        <div className="flex items-center gap-[56px]">
                            <FormLabel className="w-[100px] text-sm opacity-60">
                                Validator:
                            </FormLabel>
                            <p className="text-xl">
                                {form.watch("validator") || ""}
                            </p>
                        </div>

                        <div className="flex items-center gap-[56px]">
                            <FormLabel className="w-[100px] text-sm opacity-60">
                                Updated Voting Power:
                            </FormLabel>
                            <p className="text-xl">
                                {formatAmount(form.watch("power"))}
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                                "Confirm"
                            )}
                        </Button>
                    </form>
                </Form>
                <DialogClose asChild>
                    <Button
                        disabled={isLoading}
                        type="button"
                        variant="outline"
                        className="w-full rounded-[10px] border border-solid border-white hover:bg-white hover:text-black"
                    >
                        Cancel
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}
