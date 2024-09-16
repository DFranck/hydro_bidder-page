"use client"
import { useState, useEffect } from "react"
import { useChain } from "@cosmos-kit/react"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChainContext } from "@cosmos-kit/core"
import { SigningStargateClient } from "@cosmjs/stargate"
import { cosmos } from "interchain"
const txRaw = cosmos.tx.v1beta1.TxRaw
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"

import {
    LockStepper,
    RevertFromHubStepper,
    RevertFromNeutronStepper,
    ContinueFromHubStepper,
    ContinueFromNeutronStepper,
} from "./steppers"

import { checkForHubLSMShares, checkForNeutronLSMShares } from "./transactions"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { useMyValidators } from "@/hooks/hooks"

type Stepper =
    | { type: "lock"; validator: string; amount: string; duration: number }
    | { type: "revertFromHubLSM"; validator: string; amount: string }
    | { type: "revertFromNeutronLSM"; validator: string; amount: string }
    | { type: "continueFromHubLSM"; validator: string; amount: string }
    | { type: "continueFromNeutronLSM"; validator: string; amount: string }

type IncompleteNotice =
    | {
          type: "LSMSharesOnHub"
          validator: string
          amount: string
          denom: string
      }
    | {
          type: "LSMSharesOnNeutron"
          validator: string
          amount: string
          denom: string
      }

export default function LSMInteraction() {
    const hubChain = useChain("cosmoshub")
    const neutronChain = useChain("neutron")

    const [hubSigner, setHubSigner] = useState<
        SigningStargateClient | undefined
    >(undefined)
    const [neutronSigner, setNeutronSigner] = useState<
        SigningStargateClient | undefined
    >(undefined)

    useEffect(() => {
        if (hubChain.address) {
            hubChain.getSigningStargateClient().then(setHubSigner)
        }
        if (neutronChain.address) {
            neutronChain.getSigningStargateClient().then(setNeutronSigner)
        }
    }, [hubChain.address, neutronChain.address])

    const [incompleteNotices, setIncompleteNotices] = useState<
        IncompleteNotice[]
    >([])

    useEffect(() => {
        const checkLSMShares = async () => {
            const newIncompleteNotices: IncompleteNotice[] = []
            if (hubSigner && neutronSigner) {
                const hubShares = await checkForHubLSMShares(
                    hubChain,
                    hubSigner
                )
                hubShares.forEach((share) => {
                    newIncompleteNotices.push({
                        type: "LSMSharesOnHub",
                        validator: share.validator,
                        amount: share.amount,
                        denom: share.denom,
                    })
                })

                const neutronShares = await checkForNeutronLSMShares(
                    neutronChain,
                    neutronSigner
                )
                neutronShares.forEach((share) => {
                    newIncompleteNotices.push({
                        type: "LSMSharesOnNeutron",
                        validator: share.validator,
                        amount: share.amount,
                        denom: share.denom,
                    })
                })
            }
            setIncompleteNotices(newIncompleteNotices)
        }

        checkLSMShares()
    }, [hubSigner, neutronSigner])

    const [stepper, setStepper] = useState<Stepper | undefined>(undefined)
    const [visibleNotices, setVisibleNotices] = useState(2)

    return (
        (hubSigner && neutronSigner && (
            <div>
                {stepper && stepper.type === "lock" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <LockStepper
                            amount={stepper.amount}
                            validator={stepper.validator}
                            lockDuration={stepper.duration}
                            hubChain={hubChain}
                            hubSigner={hubSigner}
                            neutronChain={neutronChain}
                            neutronSigner={neutronSigner}
                            onExit={() => setStepper(undefined)}
                        />
                    </div>
                )}
                {stepper && stepper.type === "revertFromHubLSM" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <RevertFromHubStepper
                            amount={stepper.amount}
                            validator={stepper.validator}
                            denom="uatom"
                            hubChain={hubChain}
                            neutronChain={neutronChain}
                            onExit={() => setStepper(undefined)}
                        />
                    </div>
                )}
                {stepper && stepper.type === "revertFromNeutronLSM" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <RevertFromNeutronStepper
                            amount={stepper.amount}
                            validator={stepper.validator}
                            denom="uatom"
                            hubChain={hubChain}
                            neutronChain={neutronChain}
                            onExit={() => setStepper(undefined)}
                        />
                    </div>
                )}
                {stepper && stepper.type === "continueFromHubLSM" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <ContinueFromHubStepper
                            amount={stepper.amount}
                            validator={stepper.validator}
                            denom="uatom"
                            hubChain={hubChain}
                            neutronChain={neutronChain}
                            onExit={() => setStepper(undefined)}
                        />
                    </div>
                )}
                {stepper && stepper.type === "continueFromNeutronLSM" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <ContinueFromNeutronStepper
                            amount={stepper.amount}
                            validator={stepper.validator}
                            denom="uatom"
                            hubChain={hubChain}
                            neutronChain={neutronChain}
                            onExit={() => setStepper(undefined)}
                        />
                    </div>
                )}
                <div>
                    {incompleteNotices
                        .slice(0, visibleNotices)
                        .map((notice, index) => (
                            <div key={index}>
                                {notice.type === "LSMSharesOnHub" && (
                                    <HubIncompleteNotice
                                        amount={notice.amount}
                                        validator={notice.validator}
                                        setStepper={setStepper}
                                    />
                                )}
                                {notice.type === "LSMSharesOnNeutron" && (
                                    <NeutronIncompleteNotice
                                        amount={notice.amount}
                                        validator={notice.validator}
                                        setStepper={setStepper}
                                    />
                                )}
                            </div>
                        ))}
                    {incompleteNotices.length > 2 &&
                        visibleNotices < incompleteNotices.length && (
                            <button
                                onClick={() =>
                                    setVisibleNotices(incompleteNotices.length)
                                }
                                className="mb-4 text-white underline cursor-pointer bg-transparent border-none"
                            >
                                Show {incompleteNotices.length - visibleNotices}{" "}
                                more
                            </button>
                        )}
                    <LockForm
                        onSubmit={(validator, amount, duration) =>
                            setStepper({
                                type: "lock",
                                validator,
                                amount,
                                duration,
                            })
                        }
                        hubChain={hubChain}
                    />
                </div>
            </div>
        )) || <div>Wallet not connected</div>
    )
}

const HubIncompleteNotice = ({
    amount,
    validator,
    setStepper,
}: {
    amount: string
    validator: string
    setStepper: (stepper: Stepper) => void
}) => {
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Incomplete ATOM Locking</CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    Looks like you might have been interrupted while locking
                    your ATOM. You have {amount} ATOM with validator {validator}{" "}
                    that is not fully locked.
                </p>
                <p>
                    Would you like to continue from where you left off, or
                    revert to get back your staked ATOM?
                </p>
            </CardContent>
            <CardFooter className="space-x-4">
                <Button
                    onClick={() =>
                        setStepper({
                            type: "continueFromHubLSM",
                            validator,
                            amount,
                        })
                    }
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Continue Locking {amount} ATOM
                </Button>
                <Button
                    onClick={() =>
                        setStepper({
                            type: "revertFromHubLSM",
                            validator,
                            amount,
                        })
                    }
                    className="bg-red-500 hover:bg-red-600"
                >
                    Revert {amount} ATOM
                </Button>
            </CardFooter>
        </Card>
    )
}

const NeutronIncompleteNotice = ({
    amount,
    validator,
    setStepper,
}: {
    amount: string
    validator: string
    setStepper: (stepper: Stepper) => void
}) => {
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Incomplete ATOM Locking</CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    Looks like you might have been interrupted while locking
                    your ATOM. You have {amount} ATOM with validator {validator}{" "}
                    that is not fully locked.
                </p>
                <p>
                    Would you like to continue from where you left off, or
                    revert to get back your staked ATOM?
                </p>
            </CardContent>
            <CardFooter className="space-x-4">
                <Button
                    onClick={() =>
                        setStepper({
                            type: "continueFromNeutronLSM",
                            validator,
                            amount,
                        })
                    }
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Continue Locking {amount} ATOM
                </Button>
                <Button
                    onClick={() =>
                        setStepper({
                            type: "revertFromNeutronLSM",
                            validator,
                            amount,
                        })
                    }
                    className="bg-red-500 hover:bg-red-600"
                >
                    Revert {amount} ATOM
                </Button>
            </CardFooter>
        </Card>
    )
}

const LockForm = ({
    onSubmit,
    hubChain,
}: {
    onSubmit: (validator: string, amount: string, duration: number) => void
    hubChain: ChainContext
}) => {
    const [selectedValidator, setSelectedValidator] = useState<string>("")

    const formSchema = z.object({
        validator: z.string().min(1, "Validator address is required"),
        amount: z.string().min(1, "Amount is required"),
        duration: z.string().min(1, "Duration is required"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            validator: "",
            amount: "10000",
            duration: "7884000000000000",
        },
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(selectedValidator, values.amount, parseInt(values.duration))
    }

    const { data: validators, isLoading } = useMyValidators(
        hubChain,
        hubChain.address || ""
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lock ATOM to vote in Hydro</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="validator"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Select Validator</FormLabel>
                                    <FormControl>
                                        <div className="space-y-2">
                                            {isLoading ? (
                                                <p>Loading validators...</p>
                                            ) : (
                                                validators?.map((validator) => (
                                                    <Button
                                                        key={
                                                            validator.operator_address
                                                        }
                                                        type="button"
                                                        onClick={() => {
                                                            console.log(
                                                                "setting",
                                                                validator
                                                            )
                                                            setSelectedValidator(
                                                                validator.operator_address
                                                            )
                                                        }}
                                                        variant={
                                                            selectedValidator ===
                                                            validator.operator_address
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className="w-full justify-start"
                                                    >
                                                        {validator.description
                                                            .moniker ||
                                                            validator.operator_address}
                                                    </Button>
                                                ))
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="text-black"
                                            {...field}
                                            type="number"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="text-black"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

async function checkLSMShares(
    hubAddress: string,
    neutronAddress: string
): Promise<{
    hub: { amount: string; validator: string } | undefined
    neutron: { amount: string; validator: string } | undefined
}> {
    return { hub: undefined, neutron: undefined }
}
