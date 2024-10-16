"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { EPOCH_LENGTH } from "@/config"
import { Delegation, useMyValidators, Validator } from "@/hooks/hooks"
import { formatAmount, scaleLockupPower } from "@/lib/utils"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { cosmos } from "interchain"
import {
    AlertTriangle,
    ArrowUpRight,
    ChevronLeft,
    CircleAlert,
} from "lucide-react"
import React, { useEffect, useState } from "react"
import { ContinueFromHubStepper } from "./steppers/ContinueFromHubStepper"
import { ContinueFromNeutronStepper } from "./steppers/ContinueFromNeutronStepper"
import { LockStepper } from "./steppers/LockStepper"
import { RevertFromHubStepper } from "./steppers/RevertFromHubStepper"
import { RevertFromNeutronStepper } from "./steppers/RevertFromNeutronStepper"
import { checkForHubLSMShares, checkForNeutronLSMShares } from "./transactions"

const commonClassNames = {
    fixedOverlay:
        "fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70",
    card: "mb-4",
    cardContent: "space-y-4",
    cardFooter: "space-x-4",
    button: "cursor-pointer border-none bg-transparent text-white underline",
    formContainer: "space-y-8",
    label: "block",
    input: "w-full rounded border p-2",
    infoBox:
        "flex gap-3 rounded-md bg-palette-cyan p-3 text-sm text-palette-text",
    validatorListItem:
        "mb-2 flex w-full flex-col rounded-lg border border-gray-700 p-3",
    loaderCard: "bg-[#303132]/75 backdrop-blur",
}

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

const txRaw = cosmos.tx.v1beta1.TxRaw

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
                    <div className={commonClassNames.fixedOverlay}>
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
                    <div className={commonClassNames.fixedOverlay}>
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
                    <div className={commonClassNames.fixedOverlay}>
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
                    <div className={commonClassNames.fixedOverlay}>
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
                    <div className={commonClassNames.fixedOverlay}>
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
                                className={commonClassNames.button}
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
        <Card className={commonClassNames.card}>
            <CardHeader>
                <CardTitle>Incomplete ATOM Locking</CardTitle>
            </CardHeader>
            <CardContent className={commonClassNames.cardContent}>
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
            <CardFooter className={commonClassNames.cardFooter}>
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
        <Card className={commonClassNames.card}>
            <CardHeader>
                <CardTitle>Incomplete ATOM Locking</CardTitle>
            </CardHeader>
            <CardContent className={commonClassNames.cardContent}>
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
            <CardFooter className={commonClassNames.cardFooter}>
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
    const [validator, setValidator] = useState("")
    const [amount, setAmount] = useState("")
    const [duration, setDuration] = useState(EPOCH_LENGTH.toString())

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(validator, amount, parseInt(duration))
    }

    const { data: validators, isLoading } = useMyValidators(
        hubChain,
        hubChain.address || ""
    )

    const selectedAmount = parseInt(amount || "0")
    const selectedDuration = parseInt(duration || "0")

    useEffect(() => {
        if (validator && validators) {
            const selectedValidator = validators.find(
                (v) => v.validator.operator_address === validator
            )
            if (selectedValidator) {
                const lsmCapacity = calculateLsmCapacity(
                    selectedValidator.validator.validator_bond_shares,
                    selectedValidator.validator.liquid_shares
                )
                if (lsmCapacity < selectedAmount && selectedAmount > 0) {
                    // Instead of resetting, you could set an error state or show a warning
                    console.warn("Selected amount exceeds LSM capacity")
                }
            }
        }
    }, [selectedAmount, validator, validators])

    const clearSelectedValidator = () => {
        setValidator("")
    }

    return (
        <Card>
            {validators?.length === 0 ? (
                <div className="space-y-6 p-6">
                    <p>
                        You need some staked ATOM to participate in Hydro. You
                        can go to Keplr staking interface and stake some ATOM to
                        any active validator
                    </p>
                    <p>
                        Stake now:{" "}
                        <a
                            href="https://www.mintscan.io/wallet/stake?chain=cosmos&type=stake"
                            target="_blank"
                            className="inline-flex items-center gap-1 text-palette-green underline"
                        >
                            https://www.mintscan.io/wallet/stake?chain=cosmos&type=stake{" "}
                            <ArrowUpRight />
                        </a>
                    </p>
                </div>
            ) : (
                <>
                    <CardHeader>
                        <CardTitle>Get Voting Power</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className={commonClassNames.infoBox}>
                            <CircleAlert />
                            <div>
                                Once locked, your staked ATOMs are inaccessible
                                for the duration of the lock. They will continue
                                to accrue staking rewards but you will not be
                                able to vote in Cosmos Hub governance.
                            </div>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className={commonClassNames.formContainer}
                        >
                            {!validator && validators && (
                                <div className="space-y-3">
                                    <label className="mb-4 block space-y-3 text-white">
                                        <ol className="list-inside list-decimal">
                                            <li>
                                                Your ATOM staked to a validator
                                                can be locked in Hydro
                                            </li>
                                            <li>You get voting power</li>
                                            <li>
                                                You continue to earn staking
                                                rewards
                                            </li>
                                        </ol>

                                        {validators.length > 1 && (
                                            <p>
                                                Since you have multiple
                                                validators, you will need to do
                                                one at time.
                                            </p>
                                        )}
                                    </label>
                                    <label className={commonClassNames.label}>
                                        Select Validator
                                    </label>
                                    <div className="space-y-2">
                                        {validators.map((v) => (
                                            <ValidatorListItem
                                                key={
                                                    v.validator.operator_address
                                                }
                                                validator={v}
                                                selectedValue={validator}
                                                onChange={setValidator}
                                                selectedAmount={selectedAmount}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {validator && (
                                <>
                                    <div className="flex flex-col space-y-2">
                                        <label
                                            className={commonClassNames.label}
                                        >
                                            Your Validator
                                        </label>
                                        <div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={clearSelectedValidator}
                                                className="mt-2 inline-flex pl-1"
                                            >
                                                <ChevronLeft className="mr-2" />
                                                {getValidatorMoniker(
                                                    validator,
                                                    validatorMap
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            className={commonClassNames.label}
                                        >
                                            Amount
                                        </label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            min="0.000001"
                                            value={Number(amount) / 1000000}
                                            onChange={(e) => {
                                                const atomValue =
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0
                                                const uatomValue = Math.floor(
                                                    atomValue * 1000000
                                                ).toString()
                                                setAmount(uatomValue)
                                            }}
                                            className={commonClassNames.input}
                                        />
                                        {validator && (
                                            <p className="mt-1 text-sm text-gray-500">
                                                Max:{" "}
                                                {(
                                                    Number(
                                                        validators?.find(
                                                            (v) =>
                                                                v.validator
                                                                    .operator_address ===
                                                                validator
                                                        )?.delegation_balance
                                                            .amount
                                                    ) / 1000000
                                                ).toFixed(6)}{" "}
                                                ATOM
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            className={commonClassNames.label}
                                        >
                                            Lockup:
                                        </label>
                                        <div className="mt-2 flex gap-2">
                                            {[1].map((months) => (
                                                <button
                                                    key={months}
                                                    type="button"
                                                    className={`rounded px-4 py-2 ${duration === (months * EPOCH_LENGTH).toString() ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                                    onClick={() =>
                                                        setDuration(
                                                            (
                                                                months *
                                                                EPOCH_LENGTH
                                                            ).toString()
                                                        )
                                                    }
                                                >
                                                    {months}{" "}
                                                    {months === 1
                                                        ? "month"
                                                        : "months"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <div className="mt-2 flex items-center gap-6">
                                            <span>Voting Power:</span>
                                            <span>
                                                {formatAmount(
                                                    scaleLockupPower(
                                                        selectedDuration,
                                                        BigInt(selectedAmount)
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <AlertTriangle
                                            size={50}
                                            className="mr-3"
                                        />
                                        <p className="text-sm text-white">
                                            Your staked ATOM will be locked up
                                            for the selected duration. You still
                                            earn the Cosmos Hub staking rewards
                                            (in addition to Hydro&rsquo;s
                                            tributes)
                                        </p>
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Lock
                                    </Button>
                                </>
                            )}
                        </form>
                    </CardContent>
                </>
            )}
        </Card>
    )
}

interface ValidatorListItemProps {
    validator: {
        validator: Validator
        delegation: Delegation
        delegation_balance: { denom: string; amount: string }
    }
    selectedValue: string
    onChange: (value: string) => void
    selectedAmount: number
}

export const ValidatorListItem: React.FC<ValidatorListItemProps> = ({
    validator: v,
    selectedValue,
    onChange,
    selectedAmount,
}) => {
    const lsmCapacity = calculateLsmCapacity(
        v.validator.validator_bond_shares,
        v.validator.liquid_shares
    )
    const isDisabled = lsmCapacity <= 0 || lsmCapacity < selectedAmount

    return (
        <div className={commonClassNames.validatorListItem}>
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="font-semibold">
                        {v.validator.description.moniker ||
                            v.validator.operator_address}
                    </span>
                    <span className="text-sm text-gray-400">
                        {isDisabled
                            ? "(Insufficient validator bond)"
                            : `${formatAmount(
                                  v.delegation_balance.amount
                              )} ATOM staked`}
                    </span>
                </div>
                <Button
                    type="button"
                    onClick={() => {
                        if (!isDisabled) {
                            onChange(v.validator.operator_address)
                        }
                    }}
                    variant={
                        selectedValue === v.validator.operator_address
                            ? "default"
                            : "outline"
                    }
                    className="w-24"
                    disabled={isDisabled}
                >
                    {selectedValue === v.validator.operator_address
                        ? "Selected"
                        : "Select"}
                </Button>
            </div>
        </div>
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
        <Card className={commonClassNames.loaderCard}>
            <CardHeader>
                <CardTitle>Connect a Keplr Wallet</CardTitle>
            </CardHeader>
            <CardContent>
                {!address && haveChains ? (
                    <div>
                        <p>
                            In order to use Hydro, you will need to connect a
                            Keplr wallet.{" "}
                            <a
                                className="text-palette-green underline"
                                href="https://chromewebstore.google.com/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Grab the extension{" "}
                                <span className="whitespace-nowrap">
                                    here{" "}
                                    <ArrowUpRight
                                        className="inline-block"
                                        size={16}
                                    />
                                </span>
                            </a>{" "}
                            and connect your wallet.
                        </p>
                    </div>
                ) : haveChains ? (
                    <>
                        <div className="space-y-4">
                            <div className="h-10 animate-pulse rounded bg-gray-300"></div>
                            <div className="h-10 animate-pulse rounded bg-gray-300"></div>
                            <div className="h-10 animate-pulse rounded bg-gray-300"></div>
                            <div className="h-10 w-1/2 animate-pulse rounded bg-gray-300"></div>
                        </div>
                        <div className="mt-12 grid grid-cols-3 gap-4">
                            <div className="h-10 animate-pulse rounded bg-gray-300"></div>
                            <div className="h-10 animate-pulse rounded bg-gray-300"></div>
                            <div className="h-10 animate-pulse rounded bg-gray-300"></div>
                        </div>
                    </>
                ) : null}
            </CardContent>
        </Card>
    )
}
