"use client";
import { useState } from "react";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ChainContext } from "@cosmos-kit/core";

import { cosmos } from 'interchain';
const txRaw = cosmos.tx.v1beta1.TxRaw;

import {
  signTokenizeShares,
  signRedeemTokensForShares,
  signIBCTransfer,
  signLockTokens,
  broadcastTx,
  broadcastAndRelayIBC
} from './transactions';

export const LockStepper = ({ amount, validator, denom, hubChain, neutronChain, onExit }: {
    amount: number;
    validator: string;
    denom: string;
    hubChain: ChainContext;
    neutronChain: ChainContext;
    onExit: () => void;
}) => {
    type LockStep = "Init" | "WaitingForTokenizeSigning" | "WaitingForTokenizeBroadcast" | "Error" | "WaitingForIBCSigning" | "WaitingForIBCBroadcastAndRelay" | "WaitingForLockingSigning" | "WaitingForLockingBroadcast" | "Success";
    
    const [step, setStep] = useState<LockStep>("Init");

    const execute = async () => {
        try {
            const hubSigner = await hubChain.getSigningStargateClient();
            const neutronSigner = await neutronChain.getSigningStargateClient();

            if (!hubChain.address || !hubSigner || !neutronChain.address || !neutronSigner) {
                throw new Error("Signing clients or addresses not available");
            }

            // Sign the tokenize shares transaction
            setStep("WaitingForTokenizeSigning");
            const signedTokenizeTx = await signTokenizeShares(hubChain, hubSigner, amount, validator);

            // Broadcast the transaction
            setStep("WaitingForTokenizeBroadcast");
            const broadcastResult = await broadcastTx(hubSigner, neutronSigner, signedTokenizeTx);

            // Wait for the user to sign the IBC transfer transaction
            setStep("WaitingForIBCSigning");
            const signedIBCTx = await signIBCTransfer(hubChain, hubSigner, neutronChain, neutronSigner, 'hubToNeutron', amount, "lsmDenom"); // TODO: figure out how to get the correct denoms

            // Wait for the IBC transfer to be broadcast and relayed
            setStep("WaitingForIBCBroadcastAndRelay");
            const ibcBroadcastResult = await broadcastAndRelayIBC(hubSigner, neutronSigner, 'hubToNeutron', signedIBCTx);

            // Wait for the user to sign the lock tokens transaction
            setStep("WaitingForLockingSigning");
            const signedLockTx = await signLockTokens(neutronChain, neutronSigner, amount);

            // Broadcast the lock tokens transaction
            setStep("WaitingForLockingBroadcast");
            const lockBroadcastResult = await broadcastTx(neutronSigner, hubSigner, signedLockTx);

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
                        <Button onClick={execute}>Start locking</Button>
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

export const RevertFromHubStepper = ({ amount, validator, denom, hubChain, neutronChain, onExit }: {
    amount: number;
    validator: string;
    denom: string;
    hubChain: ChainContext;
    neutronChain: ChainContext;
    onExit: () => void;
}) => {
    const [step, setStep] = useState<'Init' | 'WaitingForRedeemSigning' | 'WaitingForRedeemBroadcast' | 'Success' | 'Error'>('Init');

    const execute = async () => {
        try {
            const hubSigner = await hubChain.getSigningStargateClient();
            const neutronSigner = await neutronChain.getSigningStargateClient();

            if (!hubChain.address || !hubSigner || !neutronChain.address || !neutronSigner) {
                throw new Error("Signing clients or addresses not available");
            }

            // Wait for the user to sign the redeem transaction
            setStep('WaitingForRedeemSigning');
            const signedRedeemTx = await signRedeemTokensForShares(hubChain, hubSigner, amount, validator);
            
            // Broadcast the redeem transaction
            setStep('WaitingForRedeemBroadcast');
            const redeemBroadcastResult = await broadcastTx(hubSigner, neutronSigner, signedRedeemTx);

            setStep('Success');
        } catch (error) {
            console.error("Error during revert process:", error);
            setStep('Error');
        }
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
            case 'Error':
                return (
                    <>
                        <p>An error occurred during the revert process.</p>
                        <p>Please try again later or contact support if the problem persists.</p>
                        <button onClick={onExit}>Close</button>
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

export const RevertFromNeutronStepper = ({ amount, validator, denom, hubChain, neutronChain, onExit }: { amount: number, validator: string, denom: string, hubChain: ChainContext, neutronChain: ChainContext, onExit: () => void }) => {
    type RevertStep = 'Init' | 'WaitingForIBCSigning' | 'WaitingForIBCBroadcast' | 'WaitingForRedeemSigning' | 'WaitingForRedeemBroadcast' | 'Success' | 'Error';

    const [step, setStep] = useState<RevertStep>('Init');

    const execute = async () => {
        try {
            const hubSigner = await hubChain.getSigningStargateClient();
            const neutronSigner = await neutronChain.getSigningStargateClient();
    
            if (!hubChain.address || !hubSigner || !neutronChain.address || !neutronSigner) {
                throw new Error("Signing clients or addresses not available");
            }

            // Wait for the user to sign the IBC transfer transaction
            setStep('WaitingForIBCSigning');
            const signedIBCTx = await signIBCTransfer(hubChain, hubSigner, neutronChain, neutronSigner, 'hubToNeutron', amount, denom); // TODO: figure out how to get the correct denoms
            
            // Broadcast the IBC transfer transaction
            setStep('WaitingForIBCBroadcast');
            const ibcBroadcastResult = await broadcastAndRelayIBC(hubSigner, neutronSigner, 'hubToNeutron', signedIBCTx);

            // Redeem tokens for shares
            setStep('WaitingForRedeemSigning');
            const signedRedeemTx = await signRedeemTokensForShares(hubChain, hubSigner, amount, validator);

            // Broadcast the redeem transaction
            setStep('WaitingForRedeemBroadcast');
            const redeemBroadcastResult = await broadcastTx(hubSigner, neutronSigner, signedRedeemTx);
            
            setStep('Success');
        } catch (error) {
            console.error("Error during revert process:", error);
            setStep('Error');
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
            case 'Error':
                return (
                    <>
                        <p>An error occurred during the revert process.</p>
                        <button onClick={onExit}>Exit</button>
                        <button onClick={execute}>Try Again</button>
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

export const ContinueFromNeutronStepper = ({ amount, validator, denom, hubChain, neutronChain, onExit }: { amount: number, validator: string, denom: string, hubChain: ChainContext, neutronChain: ChainContext, onExit: () => void }) => {
    const [step, setStep] = useState<'Init' | 'WaitingForLockSigning' | 'WaitingForLockBroadcast' | 'Success' | 'Error'>('Init');

    const executeContinueFromNeutron = async () => {
        try {
            const hubSigner = await hubChain.getSigningStargateClient();
            const neutronSigner = await neutronChain.getSigningStargateClient();
    
            if (!hubChain.address || !hubSigner || !neutronChain.address || !neutronSigner) {
                throw new Error("Signing clients or addresses not available");
            }

            // Wait for the user to sign the lock tokens transaction
            setStep('WaitingForLockSigning');
            const signedLockTx = await signLockTokens(neutronChain, neutronSigner, amount);

            // Broadcast the lock tokens transaction
            setStep('WaitingForLockBroadcast');
            const lockBroadcastResult = await broadcastTx(neutronSigner, hubSigner, signedLockTx);

            setStep('Success');
        } catch (error) {
            console.error("Error in executeContinueFromNeutron:", error);
            setStep('Error');
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

export const ContinueFromHubStepper = ({ amount, validator, denom, hubChain, neutronChain, onExit }: { amount: number, validator: string, denom: string, hubChain: ChainContext, neutronChain: ChainContext, onExit: () => void }) => {
    const [step, setStep] = useState<'Init' | 'WaitingForIBCSigning' | 'WaitingForIBCBroadcastAndRelay' | 'WaitingForLockingSigning' | 'WaitingForLockingBroadcast' | 'Success' | 'Error'>('Init');
    const [errorMessage, setErrorMessage] = useState('');

    const execute = async () => {
        try {
            const hubSigner = await hubChain.getSigningStargateClient();
            const neutronSigner = await neutronChain.getSigningStargateClient();
    
            if (!hubChain.address || !hubSigner || !neutronChain.address || !neutronSigner) {
                throw new Error("Signing clients or addresses not available");
            }

            // Wait for the user to sign the IBC transfer transaction
            setStep('WaitingForIBCSigning');
            const signedIBCTx = await signIBCTransfer(hubChain, hubSigner, neutronChain, neutronSigner, 'hubToNeutron', amount, denom);

            // Broadcast the IBC transfer transaction
            setStep('WaitingForIBCBroadcastAndRelay');
            const ibcBroadcastResult = await broadcastAndRelayIBC(hubSigner, neutronSigner, 'hubToNeutron', signedIBCTx);

            // Wait for the user to sign the lock tokens transaction
            setStep('WaitingForLockingSigning');
            const signedLockTx = await signLockTokens(neutronChain, neutronSigner, amount);

            // Broadcast the lock tokens transaction
            setStep('WaitingForLockingBroadcast');
            const lockBroadcastResult = await broadcastTx(neutronSigner, hubSigner, signedLockTx);

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
                        <Button onClick={execute}>Lock</Button>
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