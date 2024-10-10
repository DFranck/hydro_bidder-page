"use client"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ChainContext } from "@cosmos-kit/core"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { EPOCH_LENGTH } from "@/config"
import { Validator } from "@/hooks/hooks"
import { formatAmount, scaleLockupPower } from "@/lib/utils"
import { SigningStargateClient } from "@cosmjs/stargate"
import {
    broadcastAndRelayIBCGasToNeutron,
    broadcastAndRelayIBCHubToNeutron,
    broadcastTx,
    checkForGasOnHub,
    checkForGasOnNeutron,
    extractLSMDenom,
    minimumUATOMGas,
    signATOMGasTransferToNeutron,
    signIBCTransferHubToNeutron,
    signLockTokens,
    signTokenizeShares,
} from "../transactions"
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
                            <CardTitle></CardTitle>
                            <div className="text-right text-xs opacity-60">
                                You will have to do three wallet approvals. This
                                should only take a few seconds.
                            </div>
                        </CardHeader>
                        <CardContent className="flex items-center justify-around gap-10">
                            {[
                                [formatAmount(amount), "ATOM Amount"],
                                [
                                    <>
                                        {lockDuration / EPOCH_LENGTH}{" "}
                                        {lockDuration > EPOCH_LENGTH
                                            ? "months"
                                            : "month"}
                                    </>,
                                    "Lock Duration",
                                ],
                                [
                                    formatAmount(
                                        scaleLockupPower(
                                            lockDuration,
                                            BigInt(amount)
                                        )
                                    ),
                                    "Voting Power",
                                ],
                            ].map(([value, label], index) => (
                                <div
                                    className="
                                        flex
                                        flex-col-reverse
                                        items-center
                                        justify-center
                                        gap-1
                                    "
                                    key={index}
                                >
                                    <div className="text-xs text-palette-beige">
                                        {label}
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {value}
                                    </div>
                                </div>
                            ))}
                            {/* {getValidatorMoniker(
                                validator,
                                validatorMap
                            )} */}
                        </CardContent>
                        <CardFooter className="flex flex-row-reverse gap-3">
                            <Button
                                className="bg-palette-green"
                                onClick={execute}
                            >
                                Start Locking
                            </Button>
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
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                You do not have enough gas to complete the
                                transaction. Please transfer more ATOM to your
                                wallet and try again.
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
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                You do not have enough gas on Neutron
                                (Hydro&rsquo;s host chain). Approve the
                                transaction in your wallet to transfer.{" "}
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
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Transferring your ATOM to your Neutron wallet.
                                This may take a few seconds (longer if the
                                network is congested). If you exit Hydro now,
                                this status may not be visible when you return,
                                but the transfer will continue ; once the
                                transfer is complete, you will need to return to
                                initiate the staking process.
                            </p>
                        </CardContent>
                    </Card>
                )
            case "WaitingForTokenizeSigning":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Approve the transaction in your wallet to
                                continue. This will start the tokenization of
                                your staked ATOM.
                            </p>
                        </CardContent>
                    </Card>
                )
            case "WaitingForTokenizeBroadcast":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Tokenizing your staked ATOM. This should only
                                take a few seconds (unless the network is
                                congested)
                            </p>
                        </CardContent>
                    </Card>
                )
            case "Error":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                This transaction could not be completed. Your
                                staked ATOM has not been locked in Hydro.
                                Refresh the page to try again.
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
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Approve the transaction in your wallet to
                                continue. This will start the transfer of your
                                tokenized ATOM to Hydro.
                            </p>
                        </CardContent>
                    </Card>
                )
            case "WaitingForIBCBroadcastAndRelay":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Sending your staked ATOM to Hydro. This should
                                only take a few seconds (longer if the network
                                is congested). If you exit Hydro, this status
                                may not be visible when you return, but the
                                transfer will continue. Once the transfer is
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
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Approve in your wallet again to lock your ATOM.
                                This will initiate the locking of your staked
                                ATOM into the Hydro contract to receive voting
                                power.
                            </p>
                        </CardContent>
                    </Card>
                )
            case "WaitingForLockingBroadcast":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Locking your ATOM. This should only take a few
                                seconds, unless the network is congested.
                            </p>
                        </CardContent>
                    </Card>
                )
            case "Success":
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Success! You locked{" "}
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
