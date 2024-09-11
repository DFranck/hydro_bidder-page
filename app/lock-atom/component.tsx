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

type IncompleteNotice =
    | { type: 'LSMSharesOnHub', validator: string, amount: number }
    | { type: 'LSMSharesOnNeutron', validator: string, amount: number }

export default function LSMInteraction() {
    const hubChain = useChain("cosmoshubtestnet");
    const neutronChain = useChain("neutrontestnet");

    const [incompleteNotices, setIncompleteNotices] = useState<IncompleteNotice[]>([]);

    useEffect(() => {
        if (hubChain.address && neutronChain.address) {
            checkLSMShares(hubChain.address, neutronChain.address).then(shares => {
                const notices: IncompleteNotice[] = [];
                if (shares.hub) {
                    notices.push({
                        type: 'LSMSharesOnHub',
                        validator: shares.hub.validator,
                        amount: shares.hub.amount
                    });
                }
                if (shares.neutron) {
                    notices.push({
                        type: 'LSMSharesOnNeutron',
                        validator: shares.neutron.validator,
                        amount: shares.neutron.amount
                    });
                }
                setIncompleteNotices(notices);
            });
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
            {stepper && stepper.type === 'revertFromHubLSM' && <RevertFromHubStepper amount={stepper.amount} validator={stepper.validator} denom="uatom" hubChain={hubChain} neutronChain={neutronChain} onExit={() => setStepper(undefined)} />}
            {stepper && stepper.type === 'revertFromNeutronLSM' && <RevertFromNeutronStepper amount={stepper.amount} validator={stepper.validator} denom="uatom" hubChain={hubChain} neutronChain={neutronChain} onExit={() => setStepper(undefined)} />}
            {stepper && stepper.type === 'continueFromHubLSM' && <ContinueFromHubStepper amount={stepper.amount} validator={stepper.validator} denom="uatom" hubChain={hubChain} neutronChain={neutronChain} onExit={() => setStepper(undefined)} />}
            {stepper && stepper.type === 'continueFromNeutronLSM' && <ContinueFromNeutronStepper amount={stepper.amount} validator={stepper.validator} denom="uatom" hubChain={hubChain} neutronChain={neutronChain} onExit={() => setStepper(undefined)} />}
            <div>
                {incompleteNotices.map((notice, index) => (
                    <div key={index}>
                        {notice.type === 'LSMSharesOnHub' && <HubIncompleteNotice amount={notice.amount} validator={notice.validator} setStepper={setStepper} />}
                        {notice.type === 'LSMSharesOnNeutron' && <NeutronIncompleteNotice amount={notice.amount} validator={notice.validator} setStepper={setStepper} />}
                    </div>
                ))}
                <LockForm onSubmit={(validator, amount, duration) => setStepper({ type: 'lock', validator, amount, duration })} />
            </div>
        </div>
}

const HubIncompleteNotice = ({ amount, validator, setStepper }: { amount: number, validator: string, setStepper: (stepper: Stepper) => void }) => {
    return <div>
        <p>Looks like you might have been interrupted while locking your ATOM. Would you like to continue from where you left off?</p>
        <Button onClick={() => setStepper({ type: 'continueFromHubLSM', validator, amount })}>Continue</Button>
        <Button onClick={() => setStepper({ type: 'revertFromHubLSM', validator, amount })}>Revert</Button>
    </div>
}

const NeutronIncompleteNotice = ({ amount, validator, setStepper }: { amount: number, validator: string, setStepper: (stepper: Stepper) => void }) => {
    return <div>
        <p>Looks like you might have been interrupted while locking your ATOM. Would you like to continue from where you left off?</p>
        <Button onClick={() => setStepper({ type: 'continueFromNeutronLSM', validator, amount })}>Continue</Button>
        <Button onClick={() => setStepper({ type: 'revertFromNeutronLSM', validator, amount })}>Revert</Button>
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
    type LockStep = "Init" | "WaitingForTokenizeSigning" | "WaitingForTokenizeBroadcast" | "Error" | "WaitingForIBCSigning" | "WaitingForIBCBroadcastAndRelay" | "WaitingForLockingSigning" | "WaitingForLockingBroadcast" | "Success";
    
    const [step, setStep] = useState<LockStep>("Init");

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

            setStep("WaitingForTokenizeSigning");
            const signedTx = await hubSigningClient.sign(hubChain.address, [msg], fee, "");
            console.log("Transaction signed successfully:", signedTx);

            // Broadcast the transaction
            setStep("WaitingForTokenizeBroadcast");
            const broadcastResult = await hubSigningClient.broadcastTx(new Uint8Array(txRaw.encode(signedTx).finish()));
            console.log("Transaction broadcast result:", broadcastResult);

            setStep("WaitingForIBCSigning");
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

            setStep("WaitingForIBCBroadcastAndRelay");

            const ibcBroadcastResult = await hubSigningClient.broadcastTx(new Uint8Array(txRaw.encode(ibcSignedTx).finish()));
            console.log("IBC transaction broadcast result:", ibcBroadcastResult);

            // Wait for relaying to complete
            // Note: waitForIbcTransfer function needs to be implemented
            await waitForIbcTransfer();

            setStep("WaitingForLockingSigning");

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

            setStep("WaitingForLockingBroadcast");

            // Broadcast the lock tokens transaction
            const lockBroadcastResult = await neutronSigningClient.broadcastTx(new Uint8Array(txRaw.encode(lockSignedTx).finish()));
            console.log("Lock transaction broadcast result:", lockBroadcastResult);

            setStep("Success");

        } catch (error) {
            console.error("Error during process:", error);
            setStep("Error");
        }
    };

    const renderStep = () => {
        switch (step) {
            case "Init":
                return (
                    <>
                        <p>Nice! You're about to lock {amount} ATOM staked to {validator} in Hydro to get {amount} hATOM.</p>
                        <p>This should take about a minute and will require 3 wallet approvals.</p>
                        <Button onClick={lockExecute}>Start locking</Button>
                    </>
                );
            case "WaitingForTokenizeSigning":
                return (
                    <>
                        <p>Approve the transaction in your wallet to continue</p>
                        <p>This will start the tokenization of your staked {denom} tokens in preparation for locking in Hydro.</p>
                    </>
                );
            case "WaitingForTokenizeBroadcast":
                return (
                    <>
                        <p>Tokenizing your staked ATOM...</p>
                        <p>Just a few seconds, unless the network is congested.</p>
                    </>
                );
            case "Error":
                return (
                    <>
                        <p>Transaction error</p>
                        <p>This transaction could not be completed. Your staked ATOM has not been locked in Hydro.</p>
                        {/* <Button onClick={onExit}>Exit</Button>
                        <Button onClick={onTryAgain}>Try Again</Button> */}
                    </>
                );
            case "WaitingForIBCSigning":
                return (
                    <>
                        <p>Approve the transaction in your wallet to continue</p>
                        <p>This will start the transfer of your tokenized ATOM to Hydro to start the locking process.</p>
                    </>
                );
            case "WaitingForIBCBroadcastAndRelay":
                return (
                    <>
                        <p>Sending your staked {denom} to Hydro...</p>
                        <p>This could take 30 seconds or longer if the network is congested. If you exit Hydro, this status may not be visible when you return, but the transfer will continue. Once the transfer is complete, you will need to return to initiate the staking process.</p>
                    </>
                );
            case "WaitingForLockingSigning":
                return (
                    <>
                        <p>Transfer complete! Approve in your wallet again to lock your {denom}</p>
                        <p>This will initiate locking your staked {denom} into the Hydro contract and receiving voting power.</p>
                    </>
                );
            case "WaitingForLockingBroadcast":
                return (
                    <>
                        <p>Staking your {denom}...</p>
                        <p>Just a few seconds, unless the network is congested</p>
                    </>
                );
            case "Success":
                return (
                    <>
                        <p>Success!</p>
                        <p>You locked {amount} ATOM in Hydro and received {amount} ATOM (voting power).</p>
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

const RevertFromHubStepper = ({ amount, validator, denom, hubChain, neutronChain, onExit }: {
    amount: number;
    validator: string;
    denom: string;
    hubChain: ChainContext;
    neutronChain: ChainContext;
    onExit: () => void;
}) => {
    const [step, setStep] = useState<'Init' | 'WaitingForRedeemSigning' | 'WaitingForRedeemBroadcast' | 'Success'>('Init');

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
        setStep('WaitingForRedeemSigning');
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
        setStep('WaitingForRedeemBroadcast');
        const broadcastResult = await hubSigningClient.broadcastTx(new Uint8Array(txRaw.encode(signedTx).finish()));
        console.log("Transaction broadcast result:", broadcastResult);
        setStep('Success');
    }
    const renderStep = () => {
        switch (step) {
            case 'Init':
                return (
                    <>
                        <p>You're about to revert {amount} {denom} back to its original state, staked with {validator}.</p>
                        <p>This should take about a minute and will require 1 wallet approval.</p>
                        <button onClick={execute}>Revert</button>
                    </>
                );
            case 'WaitingForRedeemSigning':
                return (
                    <>
                        <p>Approve the transaction in your wallet to continue</p>
                        <p>This will restore your previous staked position with the amount of {amount} {denom} to {validator}.</p>
                    </>
                );
            case 'WaitingForRedeemBroadcast':
                return (
                    <>
                        <p>Redeeming {denom}...</p>
                        <p>Hang tight, we're restoring your previous staked position.</p>
                    </>
                );
            case 'Success':
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

const RevertFromNeutronStepper = ({ amount, validator, denom, hubChain, neutronChain, onExit }: { amount: number, validator: string, denom: string, hubChain: ChainContext, neutronChain: ChainContext, onExit: () => void }) => {
    type RevertStep = 'Init' | 'WaitingForIBCSigning' | 'WaitingForIBCBroadcast' | 'WaitingForRedeemSigning' | 'WaitingForRedeemBroadcast' | 'Success';

    const [step, setStep] = useState<RevertStep>('Init');

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
            setStep('WaitingForIBCSigning');
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

            const ibcFee = await neutronChain.estimateFee([ibcMsg]);
            const ibcSignedTx = await neutronSigningClient.sign(neutronChain.address, [ibcMsg], ibcFee, "");

            setStep('WaitingForIBCBroadcast');
            const ibcBroadcastResult = await neutronSigningClient.broadcastTx(new Uint8Array(txRaw.encode(ibcSignedTx).finish()));
            console.log("IBC Transaction broadcast result:", ibcBroadcastResult);

            // Redeem tokens for shares
            setStep('WaitingForRedeemSigning');
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

            const redeemFee = await hubChain.estimateFee([redeemMsg]);
            const redeemSignedTx = await hubSigningClient.sign(hubChain.address, [redeemMsg], redeemFee, "");

            setStep('WaitingForRedeemBroadcast');
            const redeemBroadcastResult = await hubSigningClient.broadcastTx(new Uint8Array(txRaw.encode(redeemSignedTx).finish()));
            console.log("Redeem Transaction broadcast result:", redeemBroadcastResult);

            setStep('Success');
        } catch (error) {
            console.error("Error during revert process:", error);
            // Handle error appropriately
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'Init':
                return (
                    <>
                        <p>You're about to revert {amount} ATOM back to its original state.</p>
                        <p>This should take about a minute and will require 2 wallet approvals.</p>
                        <button onClick={execute}>Revert</button>
                    </>
                );
            case 'WaitingForIBCSigning':
                return (
                    <>
                        <p>Approve the transaction in your wallet to continue</p>
                        <p>This will start the transfer of your ATOM tokens to your Cosmos Hub wallet.</p>
                    </>
                );
            case 'WaitingForIBCBroadcast':
                return (
                    <>
                        <p>Transferring tokenized ATOM to Cosmos Hub...</p>
                        <p>This could take 30 seconds or longer if the network is congested.</p>
                    </>
                );
            case 'WaitingForRedeemSigning':
                return (
                    <>
                        <p>Approve the transaction in your wallet to continue</p>
                        <p>This will restore your previous staked position with the amount of {amount} ATOM to {validator}.</p>
                    </>
                );
            case 'WaitingForRedeemBroadcast':
                return (
                    <>
                        <p>Redeeming ATOM...</p>
                        <p>Hang tight, we're restoring your previous staked position.</p>
                    </>
                );
            case 'Success':
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

const ContinueFromNeutronStepper = ({ amount, validator, denom, hubChain, neutronChain, onExit }: { amount: number, validator: string, denom: string, hubChain: ChainContext, neutronChain: ChainContext, onExit: () => void }) => {
    const [step, setStep] = useState<'Init' | 'WaitingForLockSigning' | 'WaitingForLockBroadcast' | 'Success' | 'Error'>('Init');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const executeContinueFromNeutron = async () => {
        if (!neutronChain.address || !neutronChain.getSigningStargateClient) {
            console.error("Neutron chain wallet not connected or signing client not available");
            setStep('Error');
            setErrorMessage("Neutron chain wallet not connected or signing client not available");
            return;
        }

        try {
            setStep('WaitingForLockSigning');
            const client = await neutronChain.getSigningStargateClient();
            
            const msg = {
                typeUrl: "/hydro.lockup.MsgLock",
                value: {
                    sender: neutronChain.address,
                    amount: {
                        amount: amount.toString(),
                        denom: denom
                    },
                    validator: validator
                }
            };

            setStep('WaitingForLockBroadcast');
            const response = await client.signAndBroadcast(neutronChain.address, [msg], 'auto');

            if (response.code !== undefined && response.code !== 0) {
                throw new Error(response.rawLog);
            }

            setStep('Success');
        } catch (error) {
            console.error("Error in executeContinueFromNeutron:", error);
            setStep('Error');
            setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'Init':
                return (
                    <>
                        <p>Nice! You're about to lock {amount} ATOM staked to {validator} in Hydro to get {amount} hATOM.</p>
                        <p>This will require one wallet approval.</p>
                        <Button onClick={executeContinueFromNeutron}>Lock</Button>
                    </>
                );
            case 'WaitingForLockSigning':
                return (
                    <p>Approve in your wallet again to lock your ATOM into the Hydro contract to receive voting power.</p>
                );
            case 'WaitingForLockBroadcast':
                return (
                    <>
                        <p>Locking your ATOM...</p>
                        <p>Just a few seconds, unless the network is congested</p>
                    </>
                );
            case 'Success':
                return (
                    <>
                        <p>Success!</p>
                        <p>You locked {amount} ATOM in Hydro and received {amount} hATOM (voting power).</p>
                        <p>Do you want to view the list of proposals to vote for?</p>
                        <Button onClick={onExit}>Done</Button>
                    </>
                );
            case 'Error':
                return (
                    <>
                        <p>An error occurred:</p>
                        <p>{errorMessage}</p>
                        <Button onClick={() => setStep('Init')}>Try Again</Button>
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

const ContinueFromHubStepper = ({ amount, validator, denom, hubChain, neutronChain, onExit }: { amount: number, validator: string, denom: string, hubChain: ChainContext, neutronChain: ChainContext, onExit: () => void }) => {
    const [step, setStep] = useState<'Init' | 'WaitingForIBCSigning' | 'WaitingForIBCBroadcastAndRelay' | 'WaitingForLockingSigning' | 'WaitingForLockingBroadcast' | 'Success' | 'Error'>('Init');
    const [errorMessage, setErrorMessage] = useState('');

    const executeContinueFromHub = async () => {
        try {
            setStep('WaitingForIBCSigning');

            const hubSigningClient = await hubChain.getSigningCosmWasmClient();
            const neutronSigningClient = await neutronChain.getSigningCosmWasmClient();

            // Prepare IBC transfer message
            const ibcMsg = {
                typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
                value: {
                    sourcePort: "transfer",
                    sourceChannel: "channel-391", // Replace with correct channel
                    token: {
                        denom: `${validator}/51579`, // Replace with correct denom
                        amount: amount.toString(),
                    },
                    sender: hubChain.address,
                    receiver: neutronChain.address,
                    timeoutHeight: { revisionHeight: "0" }, // Replace with correct timeout
                    timeoutTimestamp: "0" // Replace with correct timestamp
                }
            };

            const ibcFee = await hubChain.estimateFee([ibcMsg]);
            const ibcSignedTx = await hubSigningClient.sign(hubChain.address || "", [ibcMsg], ibcFee, "");

            setStep('WaitingForIBCBroadcastAndRelay');

            const ibcBroadcastResult = await hubSigningClient.broadcastTx(new Uint8Array(txRaw.encode(ibcSignedTx).finish()));
            console.log("IBC transaction broadcast result:", ibcBroadcastResult);

            // Wait for relaying to complete
            // Note: waitForIbcTransfer function needs to be implemented
            await waitForIbcTransfer();

            setStep('WaitingForLockingSigning');

            // Prepare the lock tokens message for Hydro
            const lockMsg = {
                typeUrl: "/hydro.base.v1beta1.MsgLockTokens",
                value: {
                    sender: neutronChain.address,
                    lockDuration: 1209600, // 14 days in seconds
                }
            };

            const lockFee = await neutronChain.estimateFee([lockMsg]);
            const lockSignedTx = await neutronSigningClient.sign(neutronChain.address || "", [lockMsg], lockFee, "");

            setStep('WaitingForLockingBroadcast');

            const lockBroadcastResult = await neutronSigningClient.broadcastTx(new Uint8Array(txRaw.encode(lockSignedTx).finish()));
            console.log("Lock transaction broadcast result:", lockBroadcastResult);

            setStep('Success');

        } catch (error) {
            console.error("Error during process:", error);
            setStep('Error');
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'Init':
                return (
                    <>
                        <p>Nice! You're about to lock {amount} ATOM staked to {validator} in Hydro to get {amount} hATOM.</p>
                        <p>This will require two wallet approvals.</p>
                        <Button onClick={executeContinueFromHub}>Lock</Button>
                    </>
                );
            case 'WaitingForIBCSigning':
                return (
                    <>
                        <p>Approve the transaction in your wallet to continue</p>
                        <p>This will start the transfer of your tokenized ATOM to Hydro to start the locking process.</p>
                    </>
                );
            case 'WaitingForIBCBroadcastAndRelay':
                return (
                    <>
                        <p>Sending your staked ATOM to Hydro...</p>
                        <p>This could take 30 seconds or longer if the network is congested. If you exit Hydro, this status may not be visible when you return, but the transfer will continue. Once the transfer is complete, you will need to return to initiate the staking process.</p>
                    </>
                );
            case 'WaitingForLockingSigning':
                return (
                    <p>Transfer complete! Approve in your wallet again to lock your ATOM</p>
                );
            case 'WaitingForLockingBroadcast':
                return (
                    <>
                        <p>Locking your ATOM...</p>
                        <p>Just a few seconds, unless the network is congested</p>
                    </>
                );
            case 'Success':
                return (
                    <>
                        <p>Success!</p>
                        <p>You locked {amount} ATOM in Hydro and received {amount} hATOM (voting power).</p>
                        <p>Do you want to view the list of proposals to vote for?</p>
                        <Button onClick={onExit}>Done</Button>
                    </>
                );
            case 'Error':
                return (
                    <>
                        <p>An error occurred:</p>
                        <p>{errorMessage}</p>
                        <Button onClick={() => setStep('Init')}>Try Again</Button>
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


async function checkLSMShares(hubAddress: string, neutronAddress: string): Promise<{ hub: {amount: number, validator: string} | undefined, neutron: {amount: number, validator: string} | undefined }> {
    return { hub: undefined, neutron: undefined }
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