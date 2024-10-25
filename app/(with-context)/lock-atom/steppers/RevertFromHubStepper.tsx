"use client"
import { Step } from "@/app/(with-context)/lock-atom/steppers/Step"
import { Validator } from "@/hooks/hooks"
import { formatAmount } from "@/lib/utils"
import { ChainContext } from "@cosmos-kit/core"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { ReactNode, useState } from "react"
import { broadcastTx, signRedeemTokensForShares } from "../transactions"
import { StyledText } from "@/components/StyledText"

function getValidatorMoniker(
    validator: string,
    validatorMap: Map<string, Validator>
): string {
    return validatorMap.get(validator)?.description.moniker || validator
}

type RevertFromHubStep =
    | "Init"
    | "WaitingForRedeemSigning"
    | "WaitingForRedeemBroadcast"
    | "Success"
    | "Error"

export const RevertFromHubStepper = ({
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
    startState?: RevertFromHubStep
    onExit: () => void
    validatorMap: Map<string, Validator>
    deleteIncompleteNotice: (denom: string, amount: string) => void
}) => {
    const [step, setStep] = useState<RevertFromHubStep>(startState || "Init")
    const [errorLog, setErrorLog] = useState<string>("RevertFromHubStepper: ")
    const [showErrorLog, setShowErrorLog] = useState(false)
    const router = useRouter()

    const execute = async () => {
        try {
            setErrorLog(
                `Starting execution with amount: ${amount}, validator: ${validator}, denom: ${denom}`
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

            // Wait for the user to sign the redeem transaction
            setStep("WaitingForRedeemSigning")
            const signedRedeemTx = await signRedeemTokensForShares(
                hubChain,
                hubSigner,
                amount,
                denom
            )

            // Broadcast the redeem transaction
            setStep("WaitingForRedeemBroadcast")
            const redeemBroadcastResult = await broadcastTx(
                hubSigner,
                neutronSigner,
                signedRedeemTx
            )

            setStep("Success")
            deleteIncompleteNotice(denom, amount)
        } catch (error: any) {
            console.error("Error during revert process:", error)
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
                    title: `Revert ${formatAmount(amount)} ATOM`,
                    contents: (
                        <>
                            <p>
                                You&apos;re about to revert{" "}
                                <strong className="text-white">
                                    {formatAmount(amount)} ATOM
                                </strong>{" "}
                                back to its original state, staked with{" "}
                                <strong className="text-white">
                                    {getValidatorMoniker(
                                        validator,
                                        validatorMap
                                    )}
                                </strong>
                                .
                            </p>
                            <p>
                                This should take about a minute and will require
                                1 wallet approval.
                            </p>
                        </>
                    ),
                    buttons: [
                        {
                            label: "Revert",
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
            case "WaitingForRedeemSigning":
                return {
                    isWorking: true,
                    title: "Approve Redemption",
                    contents: (
                        <>
                            <p>
                                Approve the transaction in your wallet to
                                continue
                            </p>
                            <p>
                                This will restore your previous staked position
                                with the amount of{" "}
                                <strong className="text-white">
                                    {formatAmount(amount)} ATOM
                                </strong>{" "}
                                staked to{" "}
                                <strong className="text-white">
                                    {getValidatorMoniker(
                                        validator,
                                        validatorMap
                                    )}
                                </strong>
                                .
                            </p>
                        </>
                    ),
                }
            case "WaitingForRedeemBroadcast":
                return {
                    isWorking: true,
                    title: "Redeeming ATOM",
                    contents: (
                        <>
                            <p>Redeeming ATOM...</p>
                            <p>
                                Hang tight, we&apos;re restoring your previous
                                staked position.
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
                                Your{" "}
                                <strong className="text-white">
                                    {formatAmount(amount)} ATOM
                                </strong>{" "}
                                has been restored to your previous staked
                                position.
                            </p>
                        </>
                    ),
                    buttons: [
                        {
                            label: "Done",
                            onClick: () => {
                                router.push("/lock-atom")
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
                                staked ATOM has not been reverted.
                            </p>
                            <p>
                                Refresh the page to try again or recover your
                                staked ATOM.
                            </p>
                            <div className="mt-4">
                                {!showErrorLog ? (
                                    <StyledText
                                        as="button"
                                        variant="link.subtle"
                                        onClick={() => setShowErrorLog(true)}
                                    >
                                        Show Error Log
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </StyledText>
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
