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

type LockStep =
    | "Init"
    | "NoHubGasError"
    | "WaitingForNeutronGasSigning"
    | "WaitingForNeutronGasBroadcastAndRelay"
    | "WaitingForTokenizeSigning"
    | "WaitingForTokenizeBroadcast"
    | "Error"
    | "WaitingForIBCSigning"
    | "WaitingForIBCBroadcastAndRelay"
    | "WaitingForLockingSigning"
    | "WaitingForLockingBroadcast"
    | "Success"

export const LockStepper = ({
    amount,
    validator,
    lockDuration,
    hubChain,
    hubSigner,
    neutronChain,
    neutronSigner,
    startState,
    onExit,
    validatorMap,
}: {
    amount: string
    validator: string
    lockDuration: number
    hubChain: ChainContext
    hubSigner: SigningStargateClient
    neutronChain: ChainContext
    neutronSigner: SigningStargateClient
    startState?: LockStep
    onExit: () => void
    validatorMap: Map<string, Validator>
}) => {
    const [step, setStep] = useState<LockStep>(startState || "Init")
    const [errorLog, setErrorLog] = useState<string>("LockStepper: ")
    const [showErrorLog, setShowErrorLog] = useState(false)

    const execute = async () => {
        try {
            setErrorLog(
                `Starting execution with amount: ${amount}, validator: ${validator}, lockDuration: ${lockDuration}`
            )
            if (
                !hubChain.address ||
                !hubSigner ||
                !neutronChain.address ||
                !neutronSigner
            ) {
                throw new Error("Signing clients or addresses not available")
            }

            const hubGasCheck = await checkForGasOnHub(hubChain)

            if (!hubGasCheck.hasEnoughUatom) {
                setStep("NoHubGasError")
                return
            }

            const neutronGasCheck = await checkForGasOnNeutron(neutronChain)

            if (
                !neutronGasCheck.hasEnoughUntrn &&
                !neutronGasCheck.hasEnoughUatom
            ) {
                setStep("WaitingForNeutronGasSigning")
                const signedTx = await signATOMGasTransferToNeutron(
                    hubChain,
                    hubSigner,
                    neutronChain
                )

                setStep("WaitingForNeutronGasBroadcastAndRelay")
                await broadcastAndRelayIBCGasToNeutron(
                    hubSigner,
                    neutronChain,
                    signedTx
                )
            }

            // Sign the tokenize shares transaction
            setStep("WaitingForTokenizeSigning")
            const signedTokenizeTx = await signTokenizeShares(
                hubChain,
                hubSigner,
                amount,
                validator
            )

            // Broadcast the transaction
            setStep("WaitingForTokenizeBroadcast")
            const broadcastResult = await broadcastTx(
                hubSigner,
                neutronSigner,
                signedTokenizeTx
            )

            // Extract the LSM denom
            const lsm = extractLSMDenom(broadcastResult)

            // Wait for the user to sign the IBC transfer transaction
            setStep("WaitingForIBCSigning")
            const signedIBCTx = await signIBCTransferHubToNeutron(
                hubChain,
                hubSigner,
                neutronChain,
                lsm.amount,
                lsm.denom
            )

            // Wait for the IBC transfer to be broadcast and relayed
            setStep("WaitingForIBCBroadcastAndRelay")
            const ibcBroadcastResult = await broadcastAndRelayIBCHubToNeutron(
                hubSigner,
                hubChain,
                neutronSigner,
                neutronChain,
                lsm.denom,
                signedIBCTx
            )

            // Wait for the user to sign the lock tokens transaction
            setStep("WaitingForLockingSigning")
            const signedLockTx = await signLockTokens(
                neutronChain,
                neutronSigner,
                lockDuration,
                ibcBroadcastResult.denom,
                lsm.amount
            )

            // Broadcast the lock tokens transaction
            setStep("WaitingForLockingBroadcast")
            // const lockBroadcastResult = await broadcastTx(neutronSigner, hubSigner, signedLockTx);

            setStep("Success")
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
                                Lock {formatAmount(amount)} ATOM
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                in Hydro for{" "}
                                <strong>
                                    {lockDuration / EPOCH_LENGTH}{" "}
                                    {lockDuration > EPOCH_LENGTH
                                        ? "months"
                                        : "month"}
                                </strong>{" "}
                                to get{" "}
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
                            </p>{" "}
                            <p>
                                This should take about a minute and will require
                                3 wallet approvals.
                            </p>
                        </CardContent>
                        <CardFooter className="space-x-2">
                            <Button onClick={execute}>Start locking</Button>
                            <Button variant="outline" onClick={onExit}>
                                Cancel
                            </Button>
                        </CardFooter>
                    </>
                )
            case "NoHubGasError":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Insufficient Gas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                You do not have enough gas to complete the
                                transaction.
                            </p>
                            <p>
                                Please transfer more ATOM to your Hub wallet and
                                try again.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={onExit}>OK</Button>
                        </CardFooter>
                    </Card>
                )
            case "WaitingForNeutronGasSigning":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Transfer ATOM for Gas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                You do not have enough gas on Neutron (the chain
                                which hosts Hydro).
                            </p>
                            <p>
                                Approve the transaction in your wallet to
                                transfer{" "}
                                <strong>
                                    {formatAmount(minimumUATOMGas)} ATOM
                                </strong>{" "}
                                to your Neutron wallet to continue.
                            </p>
                        </CardContent>
                    </Card>
                )

            case "WaitingForNeutronGasBroadcastAndRelay":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Transferring ATOM for Gas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Transferring your ATOM to your Neutron wallet...
                            </p>
                            <p>
                                This could take 30 seconds or longer if the
                                network is congested. If you exit Hydro, this
                                status may not be visible when you return, but
                                the transfer will continue. Once the transfer is
                                complete, you will need to return to initiate
                                the staking process.
                            </p>
                        </CardContent>
                    </Card>
                )
            case "WaitingForTokenizeSigning":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Approve Transaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Approve the transaction in your wallet to
                                continue
                            </p>
                            <p>
                                This will start the tokenization of your staked{" "}
                                ATOM in preparation for locking in Hydro.
                            </p>
                        </CardContent>
                    </Card>
                )
            case "WaitingForTokenizeBroadcast":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Tokenizing ATOM</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Tokenizing your staked ATOM...</p>
                            <p>
                                Just a few seconds, unless the network is
                                congested.
                            </p>
                        </CardContent>
                    </Card>
                )
            case "Error":
                return (
                    <Card>
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
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </button>
                                ) : (
                                    <pre className="mt-2 whitespace-pre-wrap rounded bg-gray-100 p-2 text-xs text-black">
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
                    </Card>
                )
            case "WaitingForIBCSigning":
                return (
                    <Card>
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
                    </Card>
                )
            case "WaitingForIBCBroadcastAndRelay":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>IBC Transfer to Hydro</CardTitle>
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
                    </Card>
                )
            case "WaitingForLockingSigning":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Lock Tokens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Approve in your wallet again to lock your ATOM
                            </p>
                            <p>
                                This will initiate locking your staked ATOM into
                                the Hydro contract and receiving voting power.
                            </p>
                        </CardContent>
                    </Card>
                )
            case "WaitingForLockingBroadcast":
                return (
                    <Card>
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
                    </Card>
                )
            case "Success":
                return (
                    <Card>
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
                    </Card>
                )
            default:
                return null
        }
    }

    return (
        <Card className="mx-auto max-w-[800px] bg-[#171717]">
            {renderStep()}
        </Card>
    )
}
