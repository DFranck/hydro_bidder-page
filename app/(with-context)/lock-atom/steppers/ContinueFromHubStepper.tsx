"use client"
import { Step } from "@/app/(with-context)/lock-atom/steppers/Step"
import { Button } from "@/components/ui/button"
import { EPOCH_LENGTH } from "@/config"
import { Validator } from "@/hooks/hooks"
import { formatAmount, scaleLockupPower } from "@/lib/utils"
import { ChainContext } from "@cosmos-kit/core"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { ReactNode, useState } from "react"
import {
    broadcastAndRelayIBCHubToNeutron,
    signIBCTransferHubToNeutron,
    signLockTokens,
} from "../transactions"

function getValidatorMoniker(
    validator: string,
    validatorMap: Map<string, Validator>
): string {
    return validatorMap.get(validator)?.description.moniker || validator
}

type ContinueFromHubStep =
    | "Init"
    | "WaitingForIBCSigning"
    | "WaitingForIBCBroadcastAndRelay"
    | "WaitingForLockingSigning"
    | "WaitingForLockingBroadcast"
    | "Success"
    | "Error"

export const ContinueFromHubStepper = ({
    amount,
    validator,
    denom,
    hubChain,
    neutronChain,
    startState,
    onExit,
    validatorMap,
    deleteIncompleteNotice,
}: {
    amount: string
    validator: string
    denom: string
    hubChain: ChainContext
    neutronChain: ChainContext
    startState?: ContinueFromHubStep
    onExit: () => void
    validatorMap: Map<string, Validator>
    deleteIncompleteNotice: (denom: string, amount: string) => void
}) => {
    const [step, setStep] = useState<ContinueFromHubStep>(startState || "Init")
    const [errorLog, setErrorLog] = useState<string>("ContinueFromHubStepper: ")
    const [showErrorLog, setShowErrorLog] = useState(false)
    const [lockDuration, setLockDuration] = useState(EPOCH_LENGTH)
    const router = useRouter()

    const execute = async () => {
        try {
            setErrorLog(
                `Starting execution with amount: ${amount}, validator: ${validator}, denom: ${denom}, lockDuration: ${lockDuration}`
            )
            const hubSigner = await hubChain.getSigningStargateClient()
            const neutronSigner = await neutronChain.getSigningStargateClient()

            if (
                !hubChain.address ||
                !hubSigner ||
                !neutronChain.address ||
                !neutronSigner
            ) {
                throw new Error("Signing clients or addresses not available")
            }

            // Wait for the user to sign the IBC transfer transaction
            setStep("WaitingForIBCSigning")
            const signedIBCTx = await signIBCTransferHubToNeutron(
                hubChain,
                hubSigner,
                neutronChain,
                amount,
                denom
            )

            // Broadcast the IBC transfer transaction
            setStep("WaitingForIBCBroadcastAndRelay")
            const ibcBroadcastResult = await broadcastAndRelayIBCHubToNeutron(
                hubSigner,
                hubChain,
                neutronSigner,
                neutronChain,
                denom,
                signedIBCTx
            )

            // Wait for the user to sign the lock tokens transaction
            setStep("WaitingForLockingSigning")
            const signedLockTx = await signLockTokens(
                neutronChain,
                neutronSigner,
                lockDuration,
                ibcBroadcastResult.denom,
                amount
            )

            // Broadcast the lock tokens transaction
            setStep("WaitingForLockingBroadcast")
            // await broadcastTx(neutronSigner, hubSigner, signedLockTx);

            setStep("Success")
            deleteIncompleteNotice(denom, amount)
        } catch (error: any) {
            console.error("Error during process:", error)
            setStep("Error")
            setErrorLog((prevLog) => `${prevLog}\nError: ${error.message}`)
        }
    }

    function getStepContents(): {
        isWorking?: boolean
        title?: ReactNode
        contents: ReactNode
        buttons?: {
            label: ReactNode
            onClick?: () => void
            className?: string
        }[]
    } {
        switch (step) {
            case "Init":
                return {
                    title: `Continue Locking ${formatAmount(amount)} ATOM`,
                    contents: (
                        <>
                            <p>
                                Nice! You&apos;re about to lock{" "}
                                <strong>{formatAmount(amount)} ATOM</strong>{" "}
                                staked to{" "}
                                <strong>
                                    {getValidatorMoniker(
                                        validator,
                                        validatorMap
                                    )}
                                </strong>{" "}
                                in Hydro to get{" "}
                                <strong>
                                    {formatAmount(
                                        scaleLockupPower(
                                            lockDuration,
                                            BigInt(amount)
                                        )
                                    )}{" "}
                                    voting power.
                                </strong>
                            </p>
                            <form
                                className="mt-12"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    execute()
                                }}
                            >
                                <div className="mb-4">
                                    <label className="m block">
                                        Select Lock Duration:
                                    </label>
                                    <div className="flex space-x-2">
                                        {[1].map((months) => (
                                            <Button
                                                key={months}
                                                type="button"
                                                variant={
                                                    lockDuration ===
                                                    months * EPOCH_LENGTH
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={() =>
                                                    setLockDuration(
                                                        months * EPOCH_LENGTH
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
                                </div>
                                <p>This will require two wallet approvals.</p>
                            </form>
                        </>
                    ),
                    buttons: [
                        {
                            label: "Lock",
                            onClick: execute,
                        },
                        {
                            label: "Cancel",
                            onClick: () => {
                                router.push("/lock-atom")
                                onExit()
                            },
                        },
                    ],
                }
            case "WaitingForIBCSigning":
                return {
                    isWorking: true,
                    title: "Approve IBC Transfer",
                    contents: (
                        <>
                            <p>
                                Approve the transaction in your wallet to
                                continue
                            </p>
                            <p>
                                This will start the transfer of your tokenized
                                ATOM to Hydro to start the locking process.
                            </p>
                        </>
                    ),
                }
            case "WaitingForIBCBroadcastAndRelay":
                return {
                    isWorking: true,
                    title: "Transferring to Hydro",
                    contents: (
                        <>
                            <p>Sending your staked ATOM to Hydro...</p>
                            <p>
                                This could take 30 seconds or longer if the
                                network is congested. If you exit Hydro, this
                                status may not be visible when you return, but
                                the transfer will continue. Once the transfer is
                                complete, you will need to return to initiate
                                the lockup process.
                            </p>
                        </>
                    ),
                }
            case "WaitingForLockingSigning":
                return {
                    isWorking: true,
                    title: "Approve Locking",
                    contents: (
                        <>
                            <p>
                                Approve in your wallet again to lock your ATOM
                            </p>
                        </>
                    ),
                }
            case "WaitingForLockingBroadcast":
                return {
                    isWorking: true,
                    title: "Locking in Progress",
                    contents: (
                        <>
                            <p>Locking your ATOM...</p>
                            <p>
                                Just a few seconds, unless the network is
                                congested
                            </p>
                        </>
                    ),
                }
            case "Success":
                return {
                    title: "Success!",
                    contents: (
                        <>
                            <p>
                                You locked{" "}
                                <strong>{formatAmount(amount)} ATOM</strong> in
                                Hydro and received{" "}
                                <strong>
                                    {formatAmount(
                                        scaleLockupPower(
                                            lockDuration,
                                            BigInt(amount)
                                        )
                                    )}{" "}
                                    voting power.
                                </strong>
                            </p>
                        </>
                    ),
                    buttons: [
                        {
                            label: "Done",
                            onClick: () => {
                                router.push("/voting")
                                onExit()
                            },
                        },
                    ],
                }
            case "Error":
                return {
                    title: "Transaction Error",
                    contents: (
                        <>
                            <p>
                                This transaction could not be completed. Your
                                staked ATOM has not been locked in Hydro.
                            </p>
                            <p>
                                Refresh the page to try again or recover your
                                staked ATOM.
                            </p>
                            <div className="mt-4">
                                {!showErrorLog ? (
                                    <button
                                        onClick={() => setShowErrorLog(true)}
                                        className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                                    >
                                        Show Error Log
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </button>
                                ) : (
                                    <pre className="mt-2 whitespace-pre-wrap rounded bg-gray-100 p-2 text-xs text-black">
                                        {errorLog}
                                    </pre>
                                )}
                            </div>
                        </>
                    ),
                    buttons: [
                        {
                            label: "Refresh page",
                            onClick: () => window.location.reload(),
                        },
                    ],
                }
            default:
                return {
                    contents: null,
                }
        }
    }

    const { title, contents, buttons, isWorking } = getStepContents()

    return (
        <Step
            title={title}
            contents={contents}
            buttons={buttons}
            isWorking={isWorking}
        />
    )
}
