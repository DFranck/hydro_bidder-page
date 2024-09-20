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
    CardContent,
} from "@/components/ui/card"

import { LockStepper } from "./steppers/LockStepper"
import { RevertFromHubStepper } from "./steppers/RevertFromHubStepper"
import { RevertFromNeutronStepper } from "./steppers/RevertFromNeutronStepper"
import { ContinueFromHubStepper } from "./steppers/ContinueFromHubStepper"
import { ContinueFromNeutronStepper } from "./steppers/ContinueFromNeutronStepper"

import { checkForHubLSMShares, checkForNeutronLSMShares } from "./transactions"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { useMyValidators, Validator, Delegation } from "@/hooks/hooks"
import { EPOCH_LENGTH } from "@/config"
import { formatAmount } from "@/lib/utils"

type Stepper =
    | { type: "lock"; validator: string; amount: string; duration: number }
    | {
          type: "revertFromHubLSM"
          validator: string
          amount: string
          denom: string
      }
    | {
          type: "revertFromNeutronLSM"
          validator: string
          amount: string
          denom: string
          baseDenom: string
      }
    | {
          type: "continueFromHubLSM"
          validator: string
          amount: string
          denom: string
      }
    | {
          type: "continueFromNeutronLSM"
          validator: string
          amount: string
          denom: string
          baseDenom: string
      }

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
          baseDenom: string
      }

function getValidatorMoniker(
    validator: string,
    validatorMap: Map<string, Validator>
): string {
    return validatorMap.get(validator)?.description.moniker || validator
}

export default function LSMInteraction({
    validatorMap,
}: {
    validatorMap: Map<string, Validator>
}) {
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
            let newIncompleteNotices: IncompleteNotice[] = []
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
                        baseDenom: share.baseDenom,
                    })
                })
            }

            // filter out incomplete notices whose amount is < 100uatom
            // since very small amounts sometimes cannot be redeemed
            newIncompleteNotices = newIncompleteNotices.filter(
                (notice) => parseInt(notice.amount) >= 100
            )

            console.log("newIncompleteNotices", newIncompleteNotices)

            setIncompleteNotices(newIncompleteNotices)
        }

        checkLSMShares()
    }, [hubSigner, neutronSigner])

    const deleteIncompleteNotice = (denom: string, amount: string) => {
        setIncompleteNotices((prevNotices) =>
            prevNotices.filter(
                (notice) =>
                    !(notice.denom === denom && notice.amount === amount)
            )
        )
    }

    const [stepper, setStepper] = useState<Stepper | undefined>(undefined)
    const [visibleNotices, setVisibleNotices] = useState(2)

    return (
        (hubSigner && neutronSigner && (
            <div>
                {stepper && stepper.type === "lock" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[100]">
                        <LockStepper
                            amount={stepper.amount}
                            validator={stepper.validator}
                            lockDuration={stepper.duration}
                            hubChain={hubChain}
                            hubSigner={hubSigner}
                            neutronChain={neutronChain}
                            neutronSigner={neutronSigner}
                            onExit={() => setStepper(undefined)}
                            validatorMap={validatorMap}
                        />
                    </div>
                )}
                {stepper && stepper.type === "revertFromHubLSM" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[100]">
                        <RevertFromHubStepper
                            amount={stepper.amount}
                            validator={stepper.validator}
                            denom={stepper.denom}
                            hubChain={hubChain}
                            neutronChain={neutronChain}
                            onExit={() => setStepper(undefined)}
                            validatorMap={validatorMap}
                            deleteIncompleteNotice={deleteIncompleteNotice}
                        />
                    </div>
                )}
                {stepper && stepper.type === "revertFromNeutronLSM" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[100]">
                        <RevertFromNeutronStepper
                            amount={stepper.amount}
                            validator={stepper.validator}
                            denom={stepper.denom}
                            baseDenom={stepper.baseDenom}
                            hubChain={hubChain}
                            neutronChain={neutronChain}
                            onExit={() => setStepper(undefined)}
                            validatorMap={validatorMap}
                            deleteIncompleteNotice={deleteIncompleteNotice}
                        />
                    </div>
                )}
                {stepper && stepper.type === "continueFromHubLSM" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[100]">
                        <ContinueFromHubStepper
                            amount={stepper.amount}
                            validator={stepper.validator}
                            denom={stepper.denom}
                            hubChain={hubChain}
                            neutronChain={neutronChain}
                            onExit={() => setStepper(undefined)}
                            validatorMap={validatorMap}
                            deleteIncompleteNotice={deleteIncompleteNotice}
                        />
                    </div>
                )}
                {stepper && stepper.type === "continueFromNeutronLSM" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[100]">
                        <ContinueFromNeutronStepper
                            amount={stepper.amount}
                            validator={stepper.validator}
                            denom={stepper.denom}
                            baseDenom={stepper.baseDenom}
                            hubChain={hubChain}
                            neutronChain={neutronChain}
                            onExit={() => setStepper(undefined)}
                            validatorMap={validatorMap}
                            deleteIncompleteNotice={deleteIncompleteNotice}
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
                                        validatorMap={validatorMap}
                                        denom={notice.denom}
                                        setStepper={setStepper}
                                    />
                                )}
                                {notice.type === "LSMSharesOnNeutron" && (
                                    <NeutronIncompleteNotice
                                        amount={notice.amount}
                                        validator={notice.validator}
                                        validatorMap={validatorMap}
                                        denom={notice.denom}
                                        baseDenom={notice.baseDenom}
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
                        validatorMap={validatorMap}
                    />
                </div>
            </div>
        )) || (
            <LoaderCard
                haveChains={!!hubChain || !!neutronChain}
                address={hubChain?.address || null}
            />
        )
    )
}

const HubIncompleteNotice = ({
    amount,
    validator,
    denom,
    validatorMap,
    setStepper,
}: {
    amount: string
    validator: string
    validatorMap: Map<string, Validator>
    denom: string
    setStepper: (stepper: Stepper) => void
}) => {
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Incomplete ATOM Locking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    Looks like you might have been interrupted while locking
                    your ATOM. You have <strong>{formatAmount(amount)}</strong>{" "}
                    ATOM staked with{" "}
                    <strong>
                        {getValidatorMoniker(validator, validatorMap)}
                    </strong>{" "}
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
                            denom,
                        })
                    }
                    variant="default"
                >
                    Continue Locking {formatAmount(amount)} ATOM
                </Button>
                <Button
                    onClick={() =>
                        setStepper({
                            type: "revertFromHubLSM",
                            validator,
                            amount,
                            denom,
                        })
                    }
                    variant="outline"
                >
                    Revert {formatAmount(amount)} ATOM
                </Button>
            </CardFooter>
        </Card>
    )
}

const NeutronIncompleteNotice = ({
    amount,
    validator,
    validatorMap,
    denom,
    baseDenom,
    setStepper,
}: {
    amount: string
    validator: string
    validatorMap: Map<string, Validator>
    denom: string
    baseDenom: string
    setStepper: (stepper: Stepper) => void
}) => {
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Incomplete ATOM Locking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    Looks like you might have been interrupted while locking
                    your ATOM. You have <strong>{formatAmount(amount)}</strong>{" "}
                    ATOM with validator{" "}
                    <strong>
                        {getValidatorMoniker(validator, validatorMap)}
                    </strong>{" "}
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
                            denom,
                            baseDenom,
                        })
                    }
                    variant="default"
                >
                    Continue Locking {formatAmount(amount)} ATOM
                </Button>
                <Button
                    onClick={() =>
                        setStepper({
                            type: "revertFromNeutronLSM",
                            validator,
                            amount,
                            denom,
                            baseDenom,
                        })
                    }
                    variant="outline"
                >
                    Revert {formatAmount(amount)} ATOM
                </Button>
            </CardFooter>
        </Card>
    )
}

const calculateLsmCapacity = (
    validator_bond_shares: string,
    liquid_shares: string
) => {
    return Number(validator_bond_shares) * 250 - Number(liquid_shares)
}

const LockForm = ({
    onSubmit,
    hubChain,
    validatorMap,
}: {
    onSubmit: (validator: string, amount: string, duration: number) => void
    hubChain: ChainContext
    validatorMap: Map<string, Validator>
}) => {
    const formSchema = z.object({
        validator: z.string().min(1, "Validator address is required"),
        amount: z.string().refine((val) => {
            const amount = Number(val)
            const selectedValidator: string = form.getValues("validator")
            const validator = validators?.find(
                (v) => v.validator.operator_address === selectedValidator
            )
            const maxAmount = validator
                ? Number(validator.delegation_balance.amount)
                : 0
            return amount <= maxAmount
        }, "Amount exceeds maximum available balance"),
        duration: z.string().min(1, "Duration is required"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            validator: "",
            // amount: "0", // Set the default amount to "0"
            duration: EPOCH_LENGTH.toString(),
        },
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values.validator, values.amount, parseInt(values.duration))
    }

    const { data: validators, isLoading } = useMyValidators(
        hubChain,
        hubChain.address || ""
    )

    const selectedAmount = parseInt(form.watch("amount") || "0")
    const selectedValidator = form.watch("validator")

    // Add this useEffect hook
    useEffect(() => {
        if (selectedValidator && validators) {
            const validator = validators.find(
                (v) => v.validator.operator_address === selectedValidator
            )
            if (validator) {
                const lsmCapacity = calculateLsmCapacity(
                    validator.validator.validator_bond_shares,
                    validator.validator.liquid_shares
                )
                if (lsmCapacity < selectedAmount) {
                    form.setValue("validator", "")
                }
            }
        }
    }, [selectedAmount, selectedValidator, validators])

    console.log("validators", validators)

    // Pulling this out to reduce nesting
    const validatorList =
        (value: string, onChange: (value: string) => void) =>
        (v: {
            validator: Validator
            delegation: Delegation
            delegation_balance: { denom: string; amount: string }
        }) => {
            const lsmCapacity = calculateLsmCapacity(
                v.validator.validator_bond_shares,
                v.validator.liquid_shares
            )
            const isDisabled = lsmCapacity <= 0 || lsmCapacity < selectedAmount
            return (
                <Button
                    key={v.validator.operator_address}
                    type="button"
                    onClick={() => {
                        if (!isDisabled) {
                            onChange(v.validator.operator_address)
                        }
                    }}
                    variant={
                        value === v.validator.operator_address
                            ? "default"
                            : "outline"
                    }
                    className="w-full"
                    disabled={isDisabled}
                >
                    <span className="flex-grow text-left">
                        {v.validator.description.moniker ||
                            v.validator.operator_address}
                    </span>
                    <span className="flex-shrink-0 text-right">
                        {isDisabled
                            ? "(Insufficient validator bond)"
                            : `(${formatAmount(
                                  v.delegation_balance.amount
                              )} ATOM staked)`}
                    </span>
                </Button>
            )
        }

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
                                            ) : !validators ||
                                              validators.length === 0 ? (
                                                <p>
                                                    You need to have some staked
                                                    ATOM to participate in
                                                    Hydro. Go to your
                                                    wallet&apos;s staking
                                                    interface to select a
                                                    validator and stake some
                                                    ATOM, then come back.
                                                </p>
                                            ) : (
                                                validators.map(
                                                    validatorList(
                                                        field.value,
                                                        field.onChange
                                                    )
                                                )
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
                            render={({ field }) => {
                                const selectedValidator =
                                    form.watch("validator")
                                const validator = validators?.find(
                                    (v) =>
                                        v.validator.operator_address ===
                                        selectedValidator
                                )
                                const maxAmount = validator
                                    ? Number(
                                          validator.delegation_balance.amount
                                      )
                                    : 0
                                const isDisabled = !selectedValidator

                                return (
                                    <FormItem>
                                        <FormLabel>Amount (ATOM)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="0.000001"
                                                min="0"
                                                disabled={isDisabled}
                                                onChange={(e) => {
                                                    const atomValue =
                                                        parseFloat(
                                                            e.target.value
                                                        )
                                                    const uatomValue =
                                                        Math.floor(
                                                            atomValue * 1000000
                                                        ).toString()
                                                    field.onChange(uatomValue)
                                                }}
                                                value={
                                                    Number(field.value) /
                                                    1000000
                                                }
                                            />
                                        </FormControl>
                                        {selectedValidator && (
                                            <FormDescription>
                                                Max:{" "}
                                                {(maxAmount / 1000000).toFixed(
                                                    6
                                                )}{" "}
                                                ATOM
                                            </FormDescription>
                                        )}
                                        {selectedValidator &&
                                            Number(field.value) > maxAmount && (
                                                <FormMessage>
                                                    Amount exceeds maximum
                                                    available balance
                                                </FormMessage>
                                            )}
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration</FormLabel>
                                    <FormControl>
                                        <div className="flex space-x-2">
                                            {[1, 2, 3].map((months) => (
                                                <Button
                                                    key={months}
                                                    type="button"
                                                    variant={
                                                        field.value ===
                                                        (
                                                            months *
                                                            EPOCH_LENGTH
                                                        ).toString()
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    onClick={() =>
                                                        field.onChange(
                                                            (
                                                                months *
                                                                EPOCH_LENGTH
                                                            ).toString()
                                                        )
                                                    }
                                                    className="flex-1"
                                                >
                                                    {months}{" "}
                                                    {months === 1
                                                        ? "month"
                                                        : "months"}
                                                </Button>
                                            ))}
                                        </div>
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

const LoaderCard = ({
    address,
    haveChains,
}: {
    address: string | null
    haveChains: boolean
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Lock ATOM to vote in Hydro</CardTitle>
            </CardHeader>
            <CardContent>
                {!address && haveChains ? (
                    <div>
                        <p>Connect your wallet to lock ATOM</p>
                    </div>
                ) : haveChains ? (
                    <>
                        <div className="space-y-4">
                            <div className="h-10 bg-gray-300 animate-pulse rounded"></div>
                            <div className="h-10 bg-gray-300 animate-pulse rounded"></div>
                            <div className="h-10 bg-gray-300 animate-pulse rounded"></div>
                            <div className="h-10 w-1/2 bg-gray-300 animate-pulse rounded"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-12">
                            <div className="h-10 bg-gray-300 animate-pulse rounded"></div>
                            <div className="h-10 bg-gray-300 animate-pulse rounded"></div>
                            <div className="h-10 bg-gray-300 animate-pulse rounded"></div>
                        </div>
                    </>
                ) : null}
            </CardContent>
        </Card>
    )
}
