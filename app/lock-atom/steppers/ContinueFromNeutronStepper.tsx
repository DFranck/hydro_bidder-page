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

type ContinueFromNeutronStep =
    | "Init"
    | "WaitingForLockSigning"
    | "WaitingForLockBroadcast"
    | "Success"
    | "Error"

export const ContinueFromNeutronStepper = ({
    amount,
    validator,
    denom,
    baseDenom,
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
    baseDenom: string
    hubChain: ChainContext
    neutronChain: ChainContext
    startState?: ContinueFromNeutronStep
    onExit: () => void
    validatorMap: Map<string, Validator>
    deleteIncompleteNotice: (denom: string, amount: string) => void
}) => {
    const [step, setStep] = useState<ContinueFromNeutronStep>(
        startState || "Init"
    )
    const [errorLog, setErrorLog] = useState<string>(
        "ContinueFromNeutronStepper: "
    )
    const [showErrorLog, setShowErrorLog] = useState(false)

    const [lockDuration, setLockDuration] = useState(EPOCH_LENGTH)

    const executeContinueFromNeutron = async () => {
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

            // Wait for the user to sign the lock tokens transaction
            setStep("WaitingForLockSigning")
            const signedLockTx = await signLockTokens(
                neutronChain,
                neutronSigner,
                lockDuration,
                denom,
                amount
            )

            // Broadcast the lock tokens transaction
            // setStep('WaitingForLockBroadcast');

            setStep("Success")
            deleteIncompleteNotice(denom, amount)
        } catch (error: any) {
            console.error("Error in executeContinueFromNeutron:", error)
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
                                Continue Locking {formatAmount(amount)} ATOM
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
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
                                    hATOM
                                </strong>{" "}
                                (voting power).
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    executeContinueFromNeutron()
                                }}
                            >
                                <div className="mb-4">
                                    <label className="block mb-2">
                                        Select Lock Duration:
                                    </label>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3].map((months) => (
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
                                <p>This will require one wallet approval.</p>
                            </form>
                        </CardContent>
                        <CardFooter className="space-x-2">
                            <Button onClick={executeContinueFromNeutron}>
                                Lock
                            </Button>
                            <Button variant="outline" onClick={onExit}>
                                Cancel
                            </Button>
                        </CardFooter>
                    </>
                )
            case "WaitingForLockSigning":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Approve Locking</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>
                                Approve in your wallet again to lock your ATOM
                                into the Hydro contract to receive voting power.
                            </p>
                        </CardContent>
                    </>
                )
            case "WaitingForLockBroadcast":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Locking in Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>Locking your ATOM...</p>
                            <p>
                                Just a few seconds, unless the network is
                                congested
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
                                    hATOM
                                </strong>{" "}
                                (voting power).
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
