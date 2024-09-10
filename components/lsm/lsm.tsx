import { useCallback, useState, useEffect, useMemo } from "react"
import { useChain } from "@cosmos-kit/react"

import React from 'react';
import { Button } from "@/components/ui/button";
import { ChainContext } from "@cosmos-kit/core";

import { cosmos } from 'interchain';
const txRaw = cosmos.tx.v1beta1.TxRaw;

export default function LSMInteraction() {
    const hubChain = useChain("cosmoshub");
    const neutronChain = useChain("neutron");

    const [hasLSMShares, setHasLSMShares] = useState<{
        hub: { validator: string, amount: number } | undefined,
        neutron: { validator: string, amount: number } | undefined
    }>({
        hub: undefined,
        neutron: undefined
    });

    useEffect(() => {
        if (hubChain.address && neutronChain.address) {
            checkLSMShares(hubChain.address, neutronChain.address).then()
        }
    }, [hubChain.address, neutronChain.address])

    const [revertStepper, setRevertStepper] = useState<{ step: number } | undefined>(undefined)
    const [lockStepper, setLockStepper] = useState<{ step: number, validator: string, amount: number } | undefined>(undefined)

    return hubChain.isWalletConnected && neutronChain.isWalletConnected &&
        <div>
            {hasLSMShares.hub && <div>
                <div>It looks like you might have been in the middle of locking up your tokens.</div>
                <div onClick={() => { setRevertStepper({ step: 1 }) }}>Revert</div>
                <div onClick={() => { setLockStepper({ step: 1, validator: hasLSMShares.hub!.validator, amount: hasLSMShares.hub!.amount }) }}>Continue</div>
            </div>}
            {hasLSMShares.neutron && <div>
                <div>It looks like you might have been in the middle of locking up your tokens.</div>
                <div onClick={() => { setRevertStepper({ step: 1 }) }}>Revert</div>
                <div onClick={() => { setLockStepper({ step: 2, validator: hasLSMShares.hub!.validator, amount: hasLSMShares.hub!.amount }) }}>Continue</div>
            </div>}
            {revertStepper && <div>
                {revertStepper.step === 1 ? <>
                    <div>You're about to revert 0.01 ATOM back to its original state.</div>
                    <div onClick={() => { setRevertStepper({ step: 2 }) }}>Revert</div>
                    <div onClick={() => { setRevertStepper(undefined) }}>Cancel</div>
                </> : revertStepper.step === 2 ? <>

                </> : revertStepper.step === 3 ? <>

                </> : null}
            </div>}
            {lockStepper && <div>
                {lockStepper.step === 1 ? <>

                </> : lockStepper.step === 2 ? <>

                </> : null}
            </div>}
            <div>
                <div>Select validator and amount to lock</div>
                <div>This should be a form where they put in validator and amount</div>
                <div onClick={() => { setLockStepper({ step: 1, validator: "", amount: 0 }) }}>Lock</div>
            </div>
        </div>
}


enum LockStep {
    Init = "init",
    WaitingForTokenizeSigning = "waitingForTokenizeSigning",
    WaitingForTokenizeBroadcast = "waitingForTokenizeBroadcast",
    Error = "error",
    WaitingForIBCSigning = "waitingForIBCSigning",
    WaitingForIBCBroadcastAndRelay = "waitingForIBCBroadcastAndRelay",
    WaitingForLockingSigning = "waitingForLockingSigning",
    WaitingForLockingBroadcast = "waitingForLockingBroadcast",
    Success = "success"
}

const waitForIbcTransfer = async (): Promise<boolean> => {
    // TODO: Implement actual IBC transfer logic
    console.log(`Waiting for IBC transfer`);

    // Simulate a delay to represent waiting for the IBC transfer
    await new Promise(resolve => setTimeout(resolve, 5000));

    // For now, always return true to simulate success
    return true;
}


const LockStepper = ({ amount, validator, denom, hubChain, neutronChain, onExit }: {
    amount: number;
    validator: string;
    denom: string;
    hubChain: ChainContext;
    neutronChain: ChainContext;
    onExit: () => void;
}) => {
    const [step, setStep] = useState<LockStep>(LockStep.Init);

    const signTokenizeShares = async () => {
        if (!hubChain.address || !hubChain.getSigningStargateClient) {
            console.error("Hub chain wallet not connected or signing client not available");
            return;
        }
        if (!neutronChain.address || !neutronChain.getSigningStargateClient) {
            console.error("Neutron chain wallet not connected or signing client not available");
            return;
        }
        const hubSigningClient = await hubChain.getSigningStargateClient();
        const neutronSigningClient = await neutronChain.getSigningStargateClient();

        try {
            const msg = {
                typeUrl: "/cosmos.staking.v1beta1.MsgTokenizeShares",
                value: {
                    amount: {
                        amount: (amount * 1000000).toString(), // Convert to uatom
                        denom: "uatom"
                    },
                    delegatorAddress: hubChain.address,
                    tokenizedShareOwner: hubChain.address,
                    validatorAddress: validator
                }
            };

            const fee = await hubChain.estimateFee([msg]);

            setStep(LockStep.WaitingForTokenizeSigning);
            const signedTx = await hubSigningClient.sign(hubChain.address, [msg], fee, "");
            console.log("Transaction signed successfully:", signedTx);

            // Broadcast the transaction
            setStep(LockStep.WaitingForTokenizeBroadcast);
            const broadcastResult = await hubSigningClient.broadcastTx(new Uint8Array(txRaw.encode(signedTx).finish()));
            console.log("Transaction broadcast result:", broadcastResult);

            setStep(LockStep.WaitingForIBCSigning);
            const ibcMsg = {
                typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
                value: {
                    sourcePort: "transfer",
                    sourceChannel: "channel-0", // Replace with the correct channel
                    token: {
                        denom: "ibc/XXXX", // Replace with the correct IBC denom for tokenized shares
                        amount: (amount * 1000000).toString(),
                    },
                    sender: hubChain.address,
                    receiver: neutronChain.address,
                    timeoutHeight: undefined,
                    timeoutTimestamp: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
                }
            };

            const ibcFee = await hubChain.estimateFee([ibcMsg]);

            const ibcSignedTx = await hubSigningClient.sign(hubChain.address, [ibcMsg], ibcFee, "");

            setStep(LockStep.WaitingForIBCBroadcastAndRelay);

            const ibcBroadcastResult = await hubSigningClient.broadcastTx(new Uint8Array(txRaw.encode(ibcSignedTx).finish()));
            console.log("IBC transaction broadcast result:", ibcBroadcastResult);

            // Wait for relaying to complete
            // Note: waitForIbcTransfer function needs to be implemented
            await waitForIbcTransfer();

            setStep(LockStep.WaitingForLockingSigning);

            // Prepare the lock tokens message for Hydro
            const lockMsg = {
                typeUrl: "/hydro.base.v1beta1.MsgLockTokens",
                value: {
                    sender: neutronChain.address,
                    lockDuration: 1209600, // 14 days in seconds
                }
            };

            const lockFee = await neutronChain.estimateFee([lockMsg]);

            // Sign the lock tokens transaction
            const lockSignedTx = await neutronSigningClient.sign(neutronChain.address, [lockMsg], lockFee, "");

            setStep(LockStep.WaitingForLockingBroadcast);

            // Broadcast the lock tokens transaction
            const lockBroadcastResult = await neutronSigningClient.broadcastTx(new Uint8Array(txRaw.encode(lockSignedTx).finish()));
            console.log("Lock transaction broadcast result:", lockBroadcastResult);

            setStep(LockStep.Success);

        } catch (error) {
            console.error("Error during process:", error);
            setStep(LockStep.Error);
        }
    };

    const renderStep = () => {
        switch (step) {
            case LockStep.Init:
                return (
                    <>
                        <p>Nice! You're about to lock {amount} staked ATOM into Hydro to get {amount} hATOM.</p>
                        <p>This should take about a minute and will require 3 wallet approvals.</p>
                        <Button onClick={signTokenizeShares}>Start locking</Button>
                    </>
                );
            case LockStep.WaitingForTokenizeSigning:
                return (
                    <>
                        <p>Approve the transaction in your wallet to continue</p>
                        <p>This will start the tokenization of your staked {denom} tokens in preparation for locking in Hydro.</p>
                    </>
                );
            case LockStep.WaitingForTokenizeBroadcast:
                return (
                    <>
                        <p>Tokenizing your staked ATOM...</p>
                        <p>Just a few seconds, unless the network is congested.</p>
                    </>
                );
            case LockStep.Error:
                return (
                    <>
                        <p>Transaction error</p>
                        <p>This transaction could not be completed. Your staked ATOM has not been locked in Hydro.</p>
                        {/* <Button onClick={onExit}>Exit</Button>
                        <Button onClick={onTryAgain}>Try Again</Button> */}
                    </>
                );
            case LockStep.WaitingForIBCSigning:
                return (
                    <>
                        <p>Approve the transaction in your wallet to continue</p>
                        <p>This will start the transfer of your tokenized ATOM to Hydro to start the locking process.</p>
                    </>
                );
            case LockStep.WaitingForIBCBroadcastAndRelay:
                return (
                    <>
                        <p>Sending your staked {denom} to Hydro...</p>
                        <p>This could take 30 seconds or longer if the network is congested. If you exit Hydro, this status may not be visible when you return, but the transfer will continue. Once the transfer is complete, you will need to return to initiate the staking process.</p>
                    </>
                );
            case LockStep.WaitingForLockingSigning:
                return (
                    <>
                        <p>Transfer complete! Approve in your wallet again to lock your {denom}</p>
                        <p>This will initiate locking your staked {denom} into the Hydro contract and receiving voting power.</p>
                    </>
                );
            case LockStep.WaitingForLockingBroadcast:
                return (
                    <>
                        <p>Staking your {denom}...</p>
                        <p>Just a few seconds, unless the network is congested</p>
                    </>
                );
            case LockStep.Success:
                return (
                    <>
                        <p>Success!</p>
                        <p>You locked {amount} {denom} in Hydro received {amount} h{denom} (voting power).</p>
                        <p>Do you want to view the list of proposals to vote for?</p>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-neutral-900 rounded-[10px] border-none w-[698px] p-12">
            {renderStep()}
        </div>
    );
};

async function checkLSMShares(hubAddress: string, neutronAddress: string): Promise<{ hub: boolean, neutron: boolean }> {
    return { hub: false, neutron: false }
}

async function hasEnoughGas(neutronAddress: string) {
    return true
}

async function transferGasMoney(neutronAddress: string, hubAddress: string) {

}

// Tokenize
// {
//     "typeUrl": "/cosmos.staking.v1beta1.MsgTokenizeShares",
//     "value": {
//       "amount": {
//         "amount": "10000",
//         "denom": "uatom"
//       },
//       "delegatorAddress": "cosmos13r7j89tfe5n6z5secywjt2dru7t4apy6gwuhew",
//       "tokenizedShareOwner": "cosmos13r7j89tfe5n6z5secywjt2dru7t4apy6gwuhew",
//       "validatorAddress": "cosmosvaloper124maqmcqv8tquy764ktz7cu0gxnzfw54n3vww8"
//     }
//   }

// Revert
// {
//     "typeUrl": "/cosmos.staking.v1beta1.MsgRedeemTokensForShares",
//     "value": {
//       "amount": {
//         "amount": "10000",
//         "denom": "cosmosvaloper124maqmcqv8tquy764ktz7cu0gxnzfw54n3vww8/51266"
//       },
//       "delegatorAddress": "cosmos13r7j89tfe5n6z5secywjt2dru7t4apy6gwuhew"
//     }
//   }