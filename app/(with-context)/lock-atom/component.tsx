"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { Card } from "@/components/Card"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Toasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import { EPOCH_LENGTH } from "@/config"
import { Delegation, useMyValidators, Validator } from "@/hooks/hooks"
import { formatAmount, scaleLockupPower } from "@/lib/utils"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { cosmos } from "interchain"
import React, { ChangeEvent, useEffect, useState } from "react"
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
    input: "w-1/2",
    radio: "peer flex items-center text-sm opacity-60 appearance-none rounded-full size-5 border-2 border-gray-300 checked:bg-palette-green checked:border-palette-green checked:shadow-[0_0_0_2px_theme('colors.palette.text')_inset] checked:opacity-100",
    radioLabel:
        "opacity-60 cursor-pointer peer-checked:opacity-100 peer-checked:font-bold whitespace-nowrap",
    infoBox:
        "flex gap-3 rounded-md bg-palette-cyan p-3 text-sm text-palette-text",
    validatorListItem: "mb-2 flex w-full flex-col rounded-lg border p-3",
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
                            <StyledText
                                as="button"
                                variant="link.subtle"
                                onClick={() =>
                                    setVisibleNotices(incompleteNotices.length)
                                }
                            >
                                Show {incompleteNotices.length - visibleNotices}{" "}
                                more
                            </StyledText>
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
        <Card>
            <Card.Header title="Incomplete ATOM Locking" />
            <Card.Body>
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
            </Card.Body>
            <Card.Footer>
                <StyledText
                    as="button"
                    variant="button.primary"
                    onClick={() =>
                        setStepper({
                            type: "continueFromHubLSM",
                            validator,
                            amount,
                            denom,
                        })
                    }
                >
                    Continue Locking {formatAmount(amount)} ATOM
                </StyledText>
                <StyledText
                    as="button"
                    variant="button.secondary"
                    onClick={() =>
                        setStepper({
                            type: "revertFromHubLSM",
                            validator,
                            amount,
                            denom,
                        })
                    }
                >
                    Revert {formatAmount(amount)} ATOM
                </StyledText>
            </Card.Footer>
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
            <Card.Header title="Incomplete ATOM Locking" />
            <Card.Body>
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
            </Card.Body>
            <Card.Footer>
                <StyledText
                    as="button"
                    variant="button.primary"
                    onClick={() =>
                        setStepper({
                            type: "continueFromNeutronLSM",
                            validator,
                            amount,
                            denom,
                            baseDenom,
                        })
                    }
                >
                    Continue Locking {formatAmount(amount)} ATOM
                </StyledText>
                <StyledText
                    as="button"
                    variant="button.secondary"
                    onClick={() =>
                        setStepper({
                            type: "revertFromNeutronLSM",
                            validator,
                            amount,
                            denom,
                            baseDenom,
                        })
                    }
                >
                    Revert {formatAmount(amount)} ATOM
                </StyledText>
            </Card.Footer>
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
    const {
        globalState: {
            constants: { max_locked_tokens_per_address = 1 },
        },
    } = useAppContext()
    const [validator, setValidator] = useState("")
    const [amount, setAmount] = useState("")
    const [duration, setDuration] = useState(EPOCH_LENGTH.toString())

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const uatomAmount = Math.floor(parseFloat(amount) * 1000000).toString()
        onSubmit(validator, uatomAmount, parseInt(duration))
    }

    const { data: validators } = useMyValidators(
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

    const delegationBalance = Number(
        validators?.find((v) => v.validator.operator_address === validator)
            ?.delegation_balance.amount
    )

    const maxATOMAmount =
        Math.min(delegationBalance, max_locked_tokens_per_address) / 1e6

    return (
        <Card>
            {validators?.length === 0 ? (
                <Card.Body className={commonClassNames.cardContent}>
                    <p>
                        You need some staked ATOM to participate in Hydro. You
                        can go to Keplr staking interface and stake some ATOM to
                        any active validator
                    </p>
                    <p>
                        Stake now:{" "}
                        <StyledText
                            variant="link"
                            as="a"
                            href="https://www.mintscan.io/wallet/stake?chain=cosmos&type=stake"
                            target="_blank"
                        >
                            https://www.mintscan.io/wallet/stake?chain=cosmos&type=stake{" "}
                            <Icon name="solid:arrow-up-right" />
                        </StyledText>
                    </p>
                </Card.Body>
            ) : (
                <>
                    <Card.Header title="Get Voting Power" />
                    <Card.Body className={commonClassNames.cardContent}>
                        <Toasts.Toast variant="info" isDismissible={false}>
                            Once locked, your staked ATOMs are inaccessible for
                            the duration of the lock. They will continue to
                            accrue staking rewards but you will not be able to
                            vote in Cosmos Hub governance.
                        </Toasts.Toast>
                        <form onSubmit={handleSubmit}>
                            {!validator && validators && (
                                <div className={commonClassNames.formContainer}>
                                    <div className="space-y-3">
                                        <StyledText variant="label">
                                            How to get voting power:
                                        </StyledText>

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
                                                validators, you will need to
                                                select one with staked ATOM to
                                                use for your voting power.
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        className={commonClassNames.cardContent}
                                    >
                                        <p>
                                            <StyledText
                                                as="label"
                                                variant="label"
                                            >
                                                Select a Validator:
                                            </StyledText>
                                        </p>

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
                                <div className="grid grid-cols-[min-content,auto] items-center gap-6">
                                    <div className="col-span-2 grid grid-cols-subgrid items-center">
                                        <StyledText as="label" variant="label">
                                            Your Validator:
                                        </StyledText>
                                        <div className="flex items-center gap-2">
                                            <span>
                                                {getValidatorMoniker(
                                                    validator,
                                                    validatorMap
                                                )}
                                            </span>

                                            <StyledText
                                                as="button"
                                                variant="link"
                                                onClick={clearSelectedValidator}
                                            >
                                                Change
                                            </StyledText>
                                        </div>
                                    </div>
                                    <div className="col-span-2 grid grid-cols-subgrid items-center">
                                        <StyledText as="label" variant="label">
                                            Amount:
                                        </StyledText>
                                        <div className="flex items-center gap-3">
                                            <StyledText
                                                as="input"
                                                variant="input.text"
                                                type="number"
                                                step={0.000001}
                                                max={maxATOMAmount}
                                                min={0.000001}
                                                value={amount}
                                                onChange={(
                                                    event: ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    setAmount(
                                                        Math.min(
                                                            parseFloat(
                                                                event.target
                                                                    .value
                                                            ),
                                                            maxATOMAmount
                                                        ).toString()
                                                    )
                                                }}
                                                className={
                                                    commonClassNames.input
                                                }
                                            />
                                            <StyledText
                                                as="p"
                                                variant="footnote"
                                            >
                                                Max: {maxATOMAmount} ATOM
                                            </StyledText>
                                        </div>
                                    </div>
                                    <div className="col-span-2 grid grid-cols-subgrid">
                                        <StyledText as="label" variant="label">
                                            Lockup:
                                        </StyledText>
                                        <div className="flex flex-col gap-2">
                                            {[1, 3, 6, 12].map((months) => (
                                                <StyledText
                                                    as="label"
                                                    variant="label"
                                                    key={months}
                                                    className="flex items-center gap-2"
                                                >
                                                    <StyledText
                                                        variant="input.radio"
                                                        as="input"
                                                        type="radio"
                                                        disabled={months > 1}
                                                        value={(
                                                            months *
                                                            EPOCH_LENGTH
                                                        ).toString()}
                                                        checked={
                                                            duration ===
                                                            (
                                                                months *
                                                                EPOCH_LENGTH
                                                            ).toString()
                                                        }
                                                        onChange={() =>
                                                            setDuration(
                                                                (
                                                                    months *
                                                                    EPOCH_LENGTH
                                                                ).toString()
                                                            )
                                                        }
                                                    />
                                                    <span>
                                                        <ConditionalWrapper
                                                            condition={
                                                                months > 1
                                                            }
                                                            wrapper={(
                                                                children
                                                            ) => (
                                                                <Tooltip tipContents="Longer durations will be available after the pilot rounds">
                                                                    {children}
                                                                </Tooltip>
                                                            )}
                                                        >
                                                            {months}{" "}
                                                            {months === 1
                                                                ? "month"
                                                                : "months"}
                                                        </ConditionalWrapper>
                                                    </span>
                                                </StyledText>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2 grid grid-cols-subgrid items-center">
                                        <StyledText as="label" variant="label">
                                            Voting Power:
                                        </StyledText>
                                        <strong>
                                            {formatAmount(
                                                scaleLockupPower(
                                                    selectedDuration,
                                                    BigInt(
                                                        selectedAmount * 1e6 ||
                                                            0
                                                    )
                                                )
                                            )}
                                        </strong>
                                    </div>
                                    <div className="col-span-2 flex flex-row-reverse">
                                        <StyledText
                                            as="button"
                                            variant="button.primary"
                                            type="submit"
                                        >
                                            Lock ATOM...
                                        </StyledText>
                                    </div>
                                </div>
                            )}
                        </form>
                    </Card.Body>
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
                <StyledText
                    as="button"
                    onClick={() => {
                        if (!isDisabled) {
                            onChange(v.validator.operator_address)
                        }
                    }}
                    variant={
                        selectedValue === v.validator.operator_address
                            ? "button.primary"
                            : "button.secondary"
                    }
                    disabled={isDisabled}
                >
                    {selectedValue === v.validator.operator_address
                        ? "Selected"
                        : "Select"}
                </StyledText>
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
        <Card>
            <Card.Header title="Connect a Keplr Wallet" />
            <Card.Body>
                {!address && haveChains ? (
                    <p>
                        In order to use Hydro, you will need to connect a Keplr
                        wallet.{" "}
                        <a
                            className="text-palette-green underline"
                            href="https://chromewebstore.google.com/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Grab the extension{" "}
                            <span className="whitespace-nowrap">
                                here <Icon name="solid:arrow-up-right" />
                            </span>
                        </a>{" "}
                        and connect your wallet.
                    </p>
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
            </Card.Body>
        </Card>
    )
}
