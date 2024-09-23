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
                        <CardContent>
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
                                className="mt-12"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    execute()
                                }}
                            >
                                <div className="mb-4">
                                    <label className="block m">
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
                                <p>This will require two wallet approvals.</p>
                            </form>
                        </CardContent>
                        <CardFooter className="space-x-2">
                            <Button onClick={execute}>Lock</Button>
                            <Button variant="outline" onClick={onExit}>
                                Cancel
                            </Button>
                        </CardFooter>
                    </>
                )
            case "WaitingForIBCSigning":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Approve IBC Transfer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Approve the transaction in your wallet to
                                continue
                            </p>
                            <p>
                                This will start the transfer of your tokenized
                                ATOM to Hydro to start the locking process.
                            </p>
                        </CardContent>
                    </>
                )
            case "WaitingForIBCBroadcastAndRelay":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Transferring to Hydro</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Sending your staked ATOM to Hydro...</p>
                            <p>
                                This could take 30 seconds or longer if the
                                network is congested. If you exit Hydro, this
                                status may not be visible when you return, but
                                the transfer will continue. Once the transfer is
                                complete, you will need to return to initiate
                                the staking process.
                            </p>
                        </CardContent>
                    </>
                )
            case "WaitingForLockingSigning":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Approve Locking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Approve in your wallet again to lock your ATOM
                            </p>
                        </CardContent>
                    </>
                )
            case "WaitingForLockingBroadcast":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Locking in Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                        <CardContent>
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
                        <CardContent>
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

    return (
        <Card className="max-w-[800px] mx-auto bg-[#171717]">
            {renderStep()}
        </Card>
    )
}
