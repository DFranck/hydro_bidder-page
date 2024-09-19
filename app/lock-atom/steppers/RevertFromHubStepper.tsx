"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChainContext } from "@cosmos-kit/core"

import { SigningStargateClient } from "@cosmjs/stargate"
import { scaleLockupPower, formatAmount } from "@/lib/utils"
import {
    signTokenizeShares,
    signRedeemTokensForShares,
    signLockTokens,
    broadcastTx,
    signIBCTransferHubToNeutron,
    signIBCTransferNeutronToHub,
    broadcastAndRelayIBCHubToNeutron,
    broadcastAndRelayIBCNeutronToHub,
    extractLSMDenom,
    checkForGasOnNeutron,
    signATOMGasTransferToNeutron,
    broadcastAndRelayIBCGasToNeutron,
    checkForGasOnHub,
    minimumUATOMGas,
} from "../transactions"
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { Validator } from "@/hooks/hooks"
import { EPOCH_LENGTH } from "@/config"
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

    const execute = async () => {
        console.log("execute", amount, validator, denom)
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
    const renderStep = () => {
        switch (step) {
            case "Init":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>
                                Revert {formatAmount(amount)} ATOM
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>
                                You&apos;re about to revert{" "}
                                <strong>{formatAmount(amount)} ATOM</strong>{" "}
                                back to its original state, staked with{" "}
                                <strong>
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
                        </CardContent>
                        <CardFooter className="space-x-2">
                            <Button onClick={execute}>Revert</Button>
                            <Button variant="outline" onClick={onExit}>
                                Cancel
                            </Button>
                        </CardFooter>
                    </>
                )
            case "WaitingForRedeemSigning":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Approve Redemption</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>
                                Approve the transaction in your wallet to
                                continue
                            </p>
                            <p>
                                This will restore your previous staked position
                                with the amount of{" "}
                                <strong>{formatAmount(amount)} ATOM</strong>{" "}
                                staked to{" "}
                                <strong>
                                    {getValidatorMoniker(
                                        validator,
                                        validatorMap
                                    )}
                                </strong>
                                .
                            </p>
                        </CardContent>
                    </>
                )
            case "WaitingForRedeemBroadcast":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Redeeming ATOM</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>Redeeming ATOM...</p>
                            <p>
                                Hang tight, we&apos;re restoring your previous
                                staked position.
                            </p>
                        </CardContent>
                    </>
                )
            case "Success":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Success!</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>
                                Your{" "}
                                <strong>{formatAmount(amount)} ATOM</strong> has
                                been restored to your previous staked position.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={onExit}>Done</Button>
                        </CardFooter>
                    </>
                )
            case "Error":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Transaction Error</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
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
                                    <button
                                        onClick={() => setShowErrorLog(true)}
                                        className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                                    >
                                        Show Error Log
                                        <ChevronDown className="w-4 h-4 ml-1" />
                                    </button>
                                ) : (
                                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs whitespace-pre-wrap text-black">
                                        {errorLog}
                                    </pre>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => window.location.reload()}>
                                Refresh page
                            </Button>
                        </CardFooter>
                    </>
                )
            default:
                return null
        }
    }

    return <Card className="max-w-[800px] mx-auto">{renderStep()}</Card>
}
