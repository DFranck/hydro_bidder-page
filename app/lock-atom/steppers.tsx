"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChainContext } from "@cosmos-kit/core"

import { SigningStargateClient } from "@cosmjs/stargate"
import { scaleLockupPower } from "@/lib/utils"
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
} from "./transactions"
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { Validator } from "@/hooks/hooks"

function getValidatorMoniker(
    validator: string,
    validatorMap: Map<string, Validator>
): string {
    return validatorMap.get(validator)?.description.moniker || validator
}

type LockStep =
    | "Init"
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
    const [errorLog, setErrorLog] = useState<string>("")
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
            const lsmDenom = extractLSMDenom(broadcastResult)
            console.log("LSM Denom:", lsmDenom)

            // Wait for the user to sign the IBC transfer transaction
            setStep("WaitingForIBCSigning")
            const signedIBCTx = await signIBCTransferHubToNeutron(
                hubChain,
                hubSigner,
                neutronChain,
                amount,
                lsmDenom
            ) // TODO: figure out how to get the correct denoms

            // Wait for the IBC transfer to be broadcast and relayed
            setStep("WaitingForIBCBroadcastAndRelay")
            const ibcBroadcastResult = await broadcastAndRelayIBCHubToNeutron(
                hubSigner,
                hubChain,
                neutronSigner,
                neutronChain,
                lsmDenom,
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
                                Lock {Number(amount) / 1000000} ATOM
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>
                                Nice! You're about to lock{" "}
                                <strong>{Number(amount) / 1000000} ATOM</strong>{" "}
                                staked to{" "}
                                <strong>
                                    {getValidatorMoniker(
                                        validator,
                                        validatorMap
                                    )}
                                </strong>{" "}
                                in Hydro for{" "}
                                <strong>
                                    {lockDuration / (30 * 86400000000000)}{" "}
                                    {lockDuration > 30 * 86400000000000
                                        ? "months"
                                        : "month"}
                                </strong>{" "}
                                to get{" "}
                                <strong>
                                    {scaleLockupPower(
                                        lockDuration,
                                        BigInt(amount)
                                    ).toString()}{" "}
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
            case "WaitingForTokenizeSigning":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Approve Transaction</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>
                                Approve the transaction in your wallet to
                                continue
                            </p>
                            <p>
                                This will start the tokenization of your staked{" "}
                                ATOM in preparation for locking in Hydro.
                            </p>
                        </CardContent>
                    </>
                )
            case "WaitingForTokenizeBroadcast":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Tokenizing ATOM</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>Tokenizing your staked ATOM...</p>
                            <p>
                                Just a few seconds, unless the network is
                                congested.
                            </p>
                        </CardContent>
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
                                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs whitespace-pre-wrap">
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
            case "WaitingForIBCSigning":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Approve IBC Transfer</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
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
                            <CardTitle>IBC Transfer to Hydro</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
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
                            <CardTitle>Lock Tokens</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>
                                Transfer complete! Approve in your wallet again
                                to lock your ATOM
                            </p>
                            <p>
                                This will initiate locking your staked ATOM into
                                the Hydro contract and receiving voting power.
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
                                <strong>{Number(amount) / 1000000} ATOM</strong>{" "}
                                in Hydro and received{" "}
                                <strong>
                                    {scaleLockupPower(
                                        lockDuration,
                                        BigInt(amount)
                                    ).toString()}{" "}
                                    hATOM
                                </strong>{" "}
                                (voting power).
                            </p>
                            <p>
                                Do you want to view the list of proposals to
                                vote for?
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() =>
                                    (window.location.href = "/voting-proposals")
                                }
                            >
                                View Voting Proposals
                            </Button>
                            <Button
                                onClick={() =>
                                    (window.location.href =
                                        "/dashboard?tab=lockups")
                                }
                                variant="outline"
                                className="ml-2"
                            >
                                View Lockups
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
}: {
    amount: string
    validator: string
    denom: string
    hubChain: ChainContext
    neutronChain: ChainContext
    startState?: RevertFromHubStep
    onExit: () => void
    validatorMap: Map<string, Validator>
}) => {
    const [step, setStep] = useState<RevertFromHubStep>(startState || "Init")
    const [errorLog, setErrorLog] = useState<string>("")
    const [showErrorLog, setShowErrorLog] = useState(false)

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
                validator
            )

            // Broadcast the redeem transaction
            setStep("WaitingForRedeemBroadcast")
            const redeemBroadcastResult = await broadcastTx(
                hubSigner,
                neutronSigner,
                signedRedeemTx
            )

            setStep("Success")
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
                                Revert {Number(amount) / 1000000} ATOM
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>
                                You're about to revert{" "}
                                <strong>{Number(amount) / 1000000} ATOM</strong>{" "}
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
                                <strong>{Number(amount) / 1000000} ATOM</strong>{" "}
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
                                Hang tight, we're restoring your previous staked
                                position.
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
                                <strong>{Number(amount) / 1000000} ATOM</strong>{" "}
                                has been restored to your previous staked
                                position.
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
                                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs whitespace-pre-wrap">
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

type RevertFromNeutronStep =
    | "Init"
    | "WaitingForIBCSigning"
    | "WaitingForIBCBroadcast"
    | "WaitingForRedeemSigning"
    | "WaitingForRedeemBroadcast"
    | "Success"
    | "Error"

export const RevertFromNeutronStepper = ({
    amount,
    validator,
    denom,
    hubChain,
    neutronChain,
    startState,
    onExit,
    validatorMap,
}: {
    amount: string
    validator: string
    denom: string
    hubChain: ChainContext
    neutronChain: ChainContext
    startState?: RevertFromNeutronStep
    onExit: () => void
    validatorMap: Map<string, Validator>
}) => {
    const [step, setStep] = useState<RevertFromNeutronStep>(
        startState || "Init"
    )
    const [errorLog, setErrorLog] = useState<string>("")
    const [showErrorLog, setShowErrorLog] = useState(false)

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

            // Wait for the user to sign the IBC transfer transaction
            setStep("WaitingForIBCSigning")
            const signedIBCTx = await signIBCTransferNeutronToHub(
                hubChain,
                neutronChain,
                neutronSigner,
                amount,
                denom
            )

            // Broadcast the IBC transfer transaction
            setStep("WaitingForIBCBroadcast")
            const ibcBroadcastResult = await broadcastAndRelayIBCNeutronToHub(
                hubSigner,
                hubChain,
                neutronSigner,
                neutronChain,
                denom,
                signedIBCTx
            )

            // Redeem tokens for shares
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
                                Reverting {Number(amount) / 1000000} ATOM
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>
                                You're about to revert{" "}
                                <strong>{Number(amount) / 1000000} ATOM</strong>{" "}
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
                                2 wallet approvals.
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
            case "WaitingForIBCSigning":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Approve IBC Transfer</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>
                                Approve the transaction in your wallet to
                                continue
                            </p>
                            <p>
                                This will start the transfer of your ATOM tokens
                                to your Cosmos Hub wallet.
                            </p>
                        </CardContent>
                    </>
                )
            case "WaitingForIBCBroadcast":
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Transferring to Cosmos Hub</CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>Transferring tokenized ATOM to Cosmos Hub...</p>
                            <p>
                                This could take 30 seconds or longer if the
                                network is congested.
                            </p>
                        </CardContent>
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
                                <strong>{Number(amount) / 1000000} ATOM</strong>{" "}
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
                                Hang tight, we're restoring your previous staked
                                position.
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
                                <strong>{Number(amount) / 1000000} ATOM</strong>{" "}
                                has been restored to your previous staked
                                position.
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
                                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs whitespace-pre-wrap">
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
    hubChain,
    neutronChain,
    startState,
    onExit,
    validatorMap,
}: {
    amount: string
    validator: string
    denom: string
    hubChain: ChainContext
    neutronChain: ChainContext
    startState?: ContinueFromNeutronStep
    onExit: () => void
    validatorMap: Map<string, Validator>
}) => {
    const [step, setStep] = useState<ContinueFromNeutronStep>(
        startState || "Init"
    )
    const [errorLog, setErrorLog] = useState<string>("")
    const [showErrorLog, setShowErrorLog] = useState(false)

    const [lockDuration, setLockDuration] = useState(30 * 86400000000000) // Default to 30 days in nanoseconds

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
                                Continue Locking {Number(amount) / 1000000} ATOM
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>
                                Nice! You're about to lock{" "}
                                <strong>{Number(amount) / 1000000} ATOM</strong>{" "}
                                staked to{" "}
                                <strong>
                                    {getValidatorMoniker(
                                        validator,
                                        validatorMap
                                    )}
                                </strong>{" "}
                                in Hydro to get{" "}
                                <strong>
                                    {scaleLockupPower(
                                        lockDuration,
                                        BigInt(amount)
                                    ).toString()}{" "}
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
                                        {[30, 60, 90].map((days) => (
                                            <Button
                                                key={days}
                                                type="button"
                                                variant={
                                                    lockDuration ===
                                                    days * 86400000000000
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={() =>
                                                    setLockDuration(
                                                        days * 86400000000000
                                                    )
                                                }
                                                className="flex-1"
                                            >
                                                {days / 30}{" "}
                                                {days === 30
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
                                <strong>{Number(amount) / 1000000} ATOM</strong>{" "}
                                in Hydro and received{" "}
                                <strong>
                                    {scaleLockupPower(
                                        lockDuration,
                                        BigInt(amount)
                                    ).toString()}{" "}
                                    hATOM
                                </strong>{" "}
                                (voting power).
                            </p>
                            <p>
                                Do you want to view the list of proposals to
                                vote for?
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() =>
                                    (window.location.href = "/voting-proposals")
                                }
                            >
                                View Voting Proposals
                            </Button>
                            <Button
                                onClick={() =>
                                    (window.location.href =
                                        "/dashboard?tab=lockups")
                                }
                                variant="outline"
                                className="ml-2"
                            >
                                View Lockups
                            </Button>
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
                                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs whitespace-pre-wrap">
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
}: {
    amount: string
    validator: string
    denom: string
    hubChain: ChainContext
    neutronChain: ChainContext
    startState?: ContinueFromHubStep
    onExit: () => void
    validatorMap: Map<string, Validator>
}) => {
    const [step, setStep] = useState<ContinueFromHubStep>(startState || "Init")
    const [errorLog, setErrorLog] = useState<string>("")
    const [showErrorLog, setShowErrorLog] = useState(false)

    const [lockDuration, setLockDuration] = useState(30 * 86400000000000) // Default to 30 days in nanoseconds

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
                                Continue Locking {Number(amount) / 1000000} ATOM
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose">
                            <p>
                                Nice! You're about to lock{" "}
                                <strong>{Number(amount) / 1000000} ATOM</strong>{" "}
                                staked to{" "}
                                <strong>
                                    {getValidatorMoniker(
                                        validator,
                                        validatorMap
                                    )}
                                </strong>{" "}
                                in Hydro to get{" "}
                                <strong>
                                    {scaleLockupPower(
                                        lockDuration,
                                        BigInt(amount)
                                    ).toString()}{" "}
                                    hATOM
                                </strong>{" "}
                                (voting power).
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    execute()
                                }}
                            >
                                <div className="mb-4">
                                    <label className="block mb-2">
                                        Select Lock Duration:
                                    </label>
                                    <div className="flex space-x-2">
                                        {[30, 60, 90].map((days) => (
                                            <Button
                                                key={days}
                                                type="button"
                                                variant={
                                                    lockDuration ===
                                                    days * 86400000000000
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={() =>
                                                    setLockDuration(
                                                        days * 86400000000000
                                                    )
                                                }
                                                className="flex-1"
                                            >
                                                {days / 30}{" "}
                                                {days === 30
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
                        <CardContent className="prose">
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
                        <CardContent className="prose">
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
                        <CardContent className="prose">
                            <p>
                                Transfer complete! Approve in your wallet again
                                to lock your ATOM
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
                                <strong>{Number(amount) / 1000000} ATOM</strong>{" "}
                                in Hydro and received{" "}
                                <strong>
                                    {scaleLockupPower(
                                        lockDuration,
                                        BigInt(amount)
                                    ).toString()}{" "}
                                    hATOM
                                </strong>{" "}
                                (voting power).
                            </p>
                            <p>
                                Do you want to view the list of proposals to
                                vote for?
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() =>
                                    (window.location.href = "/voting-proposals")
                                }
                            >
                                View Voting Proposals
                            </Button>
                            <Button
                                onClick={() =>
                                    (window.location.href =
                                        "/dashboard?tab=lockups")
                                }
                                variant="outline"
                                className="ml-2"
                            >
                                View Lockups
                            </Button>
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
                                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs whitespace-pre-wrap">
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
