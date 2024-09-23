"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { LockEntryWithPower } from "@/app/ts_types/HydroBase.types"
import {
    calculateLockupVotingPower,
    LockupPeriod,
    formatAmount,
    LockupPeriodMultipler,
} from "@/lib/utils"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { Loader2Icon } from "lucide-react"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import {
    ToastAborted,
    ToastError,
    ToastExecutedTx,
    ToastProcessing,
} from "@/components/ui/toast-wallet"
import { executeExtendLockup, Validator } from "@/hooks/hooks"
import { fetchDenomTrace } from "@/app/lock-atom/transactions"
import { ExtendedHttpEndpoint } from "@cosmos-kit/core"

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
                console.log(trace)
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
    }, [open, getRestEndpoint, validatorMap, lockup])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                asChild
                id={`edit-lockup-duration-${lockup.lock_entry.lock_id}`}
            >
                <Button className="rounded-lg text-black bg-white h-10 border-y-4 border-transparent hover:border-b-[#C7C7C7] hover:bg-white">
                    Extend Lockup
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 rounded-[10px] border-none w-[698px] p-12 text-white">
                <DialogDescription className="sr-only">
                    Extend Lockup
                </DialogDescription>
                <DialogHeader className="pb-[34px]">
                    <DialogTitle className="text-[32px] not-italic font-bold leading-[120%] tracking-[-0.4px] mb-[10px]">
                        Extend Lockup
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-5 mt-5 [&>*:last-child]:mt-[30px]"
                    >
                        <FormField
                            control={form.control}
                            name="lockupPeriod"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="gap-[56px] flex justify-start items-center">
                                        <FormLabel className="text-sm not-italic font-normal leading-[120%] opacity-60 w-[100px]">
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
                                                        className="text-[#080815] text-center text-base not-italic font-medium leading-[21px] inline-flex h-[30px] justify-center items-center gap-2.5 shrink-0 bg-[rgba(255,255,255,0.40)] px-4 py-0 rounded-[100px]"
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
                            <FormLabel className="text-sm opacity-60 w-[100px]">
                                Locked ATOM:
                            </FormLabel>
                            <p className="text-xl">{form.watch("shares")}</p>
                        </div>

                        <div className="flex items-center gap-[56px]">
                            <FormLabel className="text-sm opacity-60 w-[100px]">
                                Validator:
                            </FormLabel>
                            <p className="text-xl">
                                {form.watch("validator") || ""}
                            </p>
                        </div>

                        <div className="flex items-center gap-[56px]">
                            <FormLabel className="text-sm opacity-60 w-[100px]">
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
                                <Loader2Icon className="w-4 h-4 animate-spin" />
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
                        className="w-full border rounded-[10px] border-solid border-white hover:bg-white hover:text-black"
                    >
                        Cancel
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}
