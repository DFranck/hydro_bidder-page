"use client";
import { useState, useEffect } from "react";
import { useChain } from "@cosmos-kit/react";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ChainContext } from "@cosmos-kit/core";

import { cosmos } from 'interchain';
const txRaw = cosmos.tx.v1beta1.TxRaw;

type Stepper =
    | { type: 'lock', validator: string, amount: number, duration: number }
    | { type: 'revertFromHubLSM', validator: string, amount: number }
    | { type: 'revertFromNeutronLSM', validator: string, amount: number }
    | { type: 'continueFromHubLSM', validator: string, amount: number }
    | { type: 'continueFromNeutronLSM', validator: string, amount: number }

export default function LSMInteraction() {
    const hubChain = useChain("cosmoshubtestnet");
    const neutronChain = useChain("neutrontestnet");

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

    const [stepper, setStepper] = useState<Stepper | undefined>(undefined)

    useEffect(() => {
        console.log('Hub Chain Wallet Connected:', hubChain.isWalletConnected);
        console.log('Neutron Chain Wallet Connected:', neutronChain.isWalletConnected);
    }, [hubChain.isWalletConnected, neutronChain.isWalletConnected]);

    return hubChain.isWalletConnected && neutronChain.isWalletConnected &&
        <div>
            {stepper && stepper.type === 'lock' && <LockStepper amount={stepper.amount} validator={stepper.validator} denom="uatom" hubChain={hubChain} neutronChain={neutronChain} onExit={() => setStepper(undefined)} />}
            {stepper && stepper.type === 'revertFromHubLSM' && <RevertFromHubLSMStepper amount={stepper.amount} validator={stepper.validator} denom="uatom" hubChain={hubChain} neutronChain={neutronChain} onExit={() => setStepper(undefined)} />}
            <div>
                <LockForm onSubmit={(validator, amount, duration) => setStepper({ type: 'lock', validator, amount, duration })} />
            </div>
        </div>
}

const LockForm = ({ onSubmit }: { onSubmit: (validator: string, amount: number, duration: number) => void }) => {
    // Using SimplyStaking for testing
    const [validator, setValidator] = useState('cosmosvaloper124maqmcqv8tquy764ktz7cu0gxnzfw54n3vww8');
    // 0.01 atom in uatom for testing
    const [amount, setAmount] = useState('10000');
    // 3 months for testing
    const [duration, setDuration] = useState('7884000000000000');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(validator, parseInt(amount), parseInt(duration));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="validator">
                    Validator Address
                </label>
                <input
                    type="text"
                    id="validator"
                    value={validator}
                    onChange={(e) => setValidator(e.target.value)}
                    required
                    className="text-black"
                />
            </div>
            <div>
                <label htmlFor="amount">
                    Amount
                </label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="text-black"
                />
            </div>
            <div>
                <label htmlFor="duration">
                    Duration
                </label>
                <input
                    type="text"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    className="text-black"
                />
            </div>
            <Button type="submit">Submit</Button>
        </form>
    );
};


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

    const lockExecute = async () => {
        console.log("Locking execute");
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

        console.log("Hub signing client:", hubSigningClient);
        console.log("Neutron signing client:", neutronSigningClient);

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
                        <p>Nice! You're about to lock {amount} ATOM staked to {validator} in Hydro to get {amount} hATOM.</p>
                        <p>This should take about a minute and will require 3 wallet approvals.</p>
                        <Button onClick={lockExecute}>Start locking</Button>
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

enum RevertStep {
    Init,
    WaitingForRedeemSigning,
    WaitingForRedeemBroadcast,
    Success
}

const RevertFromHubLSMStepper = ({ amount, validator, denom, hubChain, neutronChain, onExit }: {
    amount: number;
    validator: string;
    denom: string;
    hubChain: ChainContext;
    neutronChain: ChainContext;
    onExit: () => void;
}) => {
    const [step, setStep] = useState<RevertStep>(RevertStep.Init);

    const execute = async () => {
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
        setStep(RevertStep.WaitingForRedeemSigning);
        const msg = {
            typeUrl: "/cosmos.staking.v1beta1.MsgRedeemTokensForShares",
            value: {
                amount: {
                    amount: amount,
                    denom: denom
                },
                delegatorAddress: neutronChain.address
            }
        }
        const fee = await hubChain.estimateFee([msg]);
        const signedTx = await hubSigningClient.sign(hubChain.address, [msg], fee, "");
        setStep(RevertStep.WaitingForRedeemBroadcast);
        const broadcastResult = await hubSigningClient.broadcastTx(new Uint8Array(txRaw.encode(signedTx).finish()));
        console.log("Transaction broadcast result:", broadcastResult);
        setStep(RevertStep.Success);
    }
    const renderStep = () => {
        switch (step) {
            case RevertStep.Init:
                return (
                    <>
                        <p>You're about to revert {amount} {denom} back to its original state, staked with {validator}.</p>
                        <p>This should take about a minute and will require 1 wallet approval.</p>
                        <button onClick={execute}>Revert</button>
                    </>
                );
            case RevertStep.WaitingForRedeemSigning:
                return (
                    <>
                        <p>Approve the transaction in your wallet to continue</p>
                        <p>This will restore your previous staked position with the amount of {amount} {denom} to {validator}.</p>
                    </>
                );
            case RevertStep.WaitingForRedeemBroadcast:
                return (
                    <>
                        <p>Redeeming {denom}...</p>
                        <p>Hang tight, we're restoring your previous staked position.</p>
                    </>
                );
            case RevertStep.Success:
                return (
                    <>
                        <p>Success!</p>
                        <p>Your {amount} ATOM has been restored to your previous staked position.</p>
                        <button onClick={onExit}>Done</button>
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

const RevertFromNeutronLSMStepper = ({ amount, validator, denom, hubChain, neutronChain, onExit }: { amount: number, validator: string, denom: string, hubChain: ChainContext, neutronChain: ChainContext, onExit: () => void }) => {
    enum RevertStep {
        Init,
        WaitingForIBCSigning,
        WaitingForIBCBroadcast,
        WaitingForRedeemSigning,
        WaitingForRedeemBroadcast,
        Success
    }

    const [step, setStep] = useState<RevertStep>(RevertStep.Init);

    const execute = async () => {
        if (!hubChain.address || !hubChain.getSigningStargateClient) {
            console.error("Hub chain wallet not connected or signing client not available");
            return;
        }
        if (!neutronChain.address || !neutronChain.getSigningStargateClient) {
            console.error("Neutron chain wallet not connected or signing client not available");
            return;
        }
        const neutronSigningClient = await neutronChain.getSigningStargateClient();
        const hubSigningClient = await hubChain.getSigningStargateClient();
        try {
            // Connect to clients
            const neutronSigningClient = await neutronChain.getSigningStargateClient();
            const hubSigningClient = await hubChain.getSigningStargateClient();

            // IBC Transfer
            setStep(RevertStep.WaitingForIBCSigning);
            const ibcMsg = {
                typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
                value: {
                    sourcePort: "transfer",
                    sourceChannel: "channel-391", // Assuming this is the correct channel
                    token: {
                        denom: `${validator}/51579`, // Assuming this is the correct denom format
                        amount: amount.toString(),
                    },
                    sender: neutronChain.address,
                    receiver: hubChain.address,
                    timeoutHeight: { revisionHeight: "0" },
                    timeoutTimestamp: "0",
                }
            };

            const ibcFee = await neutronSigningClient.simulate(neutronChain.address, [ibcMsg], "");
            const ibcSignedTx = await neutronSigningClient.sign(neutronChain.address, [ibcMsg], ibcFee, "");

            setStep(RevertStep.WaitingForIBCBroadcast);
            const ibcBroadcastResult = await neutronSigningClient.broadcastTx(new Uint8Array(txRaw.encode(ibcSignedTx).finish()));
            console.log("IBC Transaction broadcast result:", ibcBroadcastResult);

            // Redeem tokens for shares
            setStep(RevertStep.WaitingForRedeemSigning);
            const redeemMsg = {
                typeUrl: "/cosmos.staking.v1beta1.MsgRedeemTokensForShares",
                value: {
                    delegatorAddress: hubChain.address,
                    amount: {
                        amount: amount.toString(),
                        denom: `${validator}/51579`, // Assuming this is the correct denom format
                    },
                }
            };

            const redeemFee = await hubChain.estimateFee(hubChain.address, [redeemMsg], "");
            const redeemSignedTx = await hubSigningClient.sign(hubChain.address, [redeemMsg], redeemFee, "");

            setStep(RevertStep.WaitingForRedeemBroadcast);
            const redeemBroadcastResult = await hubSigningClient.broadcastTx(new Uint8Array(txRaw.encode(redeemSignedTx).finish()));
            console.log("Redeem Transaction broadcast result:", redeemBroadcastResult);

            setStep(RevertStep.Success);
        } catch (error) {
            console.error("Error during revert process:", error);
            // Handle error appropriately
        }
    };

    const renderStep = () => {
        switch (step) {
            case RevertStep.Init:
                return (
                    <>
                        <p>You're about to revert {amount} ATOM back to its original state.</p>
                        <p>This should take about a minute and will require 2 wallet approvals.</p>
                        <button onClick={execute}>Revert</button>
                    </>
                );
            case RevertStep.WaitingForIBCSigning:
                return (
                    <>
                        <p>Approve the transaction in your wallet to continue</p>
                        <p>This will start the transfer of your ATOM tokens to your Cosmos Hub wallet.</p>
                    </>
                );
            case RevertStep.WaitingForIBCBroadcast:
                return (
                    <>
                        <p>Transferring tokenized ATOM to Cosmos Hub...</p>
                        <p>This could take 30 seconds or longer if the network is congested.</p>
                    </>
                );
            case RevertStep.WaitingForRedeemSigning:
                return (
                    <>
                        <p>Approve the transaction in your wallet to continue</p>
                        <p>This will restore your previous staked position with the amount of {amount} ATOM to {validator}.</p>
                    </>
                );
            case RevertStep.WaitingForRedeemBroadcast:
                return (
                    <>
                        <p>Redeeming ATOM...</p>
                        <p>Hang tight, we're restoring your previous staked position.</p>
                    </>
                );
            case RevertStep.Success:
                return (
                    <>
                        <p>Success!</p>
                        <p>Your {amount} ATOM has been restored to your previous staked position.</p>
                        <button onClick={onExit}>Done</button>
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
//         "denom": "cosmosvaloper124maqmcqv8tquy764ktz7cu0gxnzfw54n3vww8/51579"
//       },
//       "delegatorAddress": "cosmos13r7j89tfe5n6z5secywjt2dru7t4apy6gwuhew"
//     }
//   }

// IBC transfer
// {
//     "typeUrl": "/ibc.applications.transfer.v1.MsgTransfer",
//     "value": {
//       "memo": "",
//       "receiver": "stride13r7j89tfe5n6z5secywjt2dru7t4apy6t9utdz",
//       "sender": "cosmos13r7j89tfe5n6z5secywjt2dru7t4apy6gwuhew",
//       "sourceChannel": "channel-391",
//       "sourcePort": "transfer",
//       "timeoutHeight": {
//         "revisionHeight": "0",
//         "revisionNumber": "0"
//       },
//       "timeoutTimestamp": "1726007000998000000",
//       "token": {
//         "amount": "10000",
//         "denom": "cosmosvaloper124maqmcqv8tquy764ktz7cu0gxnzfw54n3vww8/51622"
//       }
//     }
//   }