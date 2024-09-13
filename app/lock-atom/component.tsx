"use client";
import { useState, useEffect } from "react";
import { useChain } from "@cosmos-kit/react";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ChainContext } from "@cosmos-kit/core";

import { cosmos } from 'interchain';
const txRaw = cosmos.tx.v1beta1.TxRaw;

import {
    LockStepper,
    RevertFromHubStepper,
    RevertFromNeutronStepper,
    ContinueFromHubStepper,
    ContinueFromNeutronStepper
} from './steppers';

type Stepper =
    | { type: 'lock', validator: string, amount: string, duration: number }
    | { type: 'revertFromHubLSM', validator: string, amount: string }
    | { type: 'revertFromNeutronLSM', validator: string, amount: string }
    | { type: 'continueFromHubLSM', validator: string, amount: string }
    | { type: 'continueFromNeutronLSM', validator: string, amount: string }

type IncompleteNotice =
    | { type: 'LSMSharesOnHub', validator: string, amount: string }
    | { type: 'LSMSharesOnNeutron', validator: string, amount: string }

export default function LSMInteraction() {
    const hubChain = useChain("cosmoshub");
    const neutronChain = useChain("neutron");

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

    return hubChain.isWalletConnected && neutronChain.isWalletConnected &&
        <div>
            {stepper && stepper.type === 'lock' && <LockStepper amount={stepper.amount} validator={stepper.validator} denom="uatom" lockDuration={stepper.duration} hubChain={hubChain} neutronChain={neutronChain} onExit={() => setStepper(undefined)} />}
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
        </div> || <div>Wallet not connected</div>
}

const HubIncompleteNotice = ({ amount, validator, setStepper }: { amount: string, validator: string, setStepper: (stepper: Stepper) => void }) => {
    return <div>
        <p>Looks like you might have been interrupted while locking your ATOM. Would you like to continue from where you left off, or revert to get back your staked ATOM?</p>
        <Button onClick={() => setStepper({ type: 'continueFromHubLSM', validator, amount })}>Continue</Button>
        <Button onClick={() => setStepper({ type: 'revertFromHubLSM', validator, amount })}>Revert</Button>
    </div>
}

const NeutronIncompleteNotice = ({ amount, validator, setStepper }: { amount: string, validator: string, setStepper: (stepper: Stepper) => void }) => {
    return <div>
        <p>Looks like you might have been interrupted while locking your ATOM. Would you like to continue from where you left off, or revert to get back your staked ATOM?</p>
        <Button onClick={() => setStepper({ type: 'continueFromNeutronLSM', validator, amount })}>Continue</Button>
        <Button onClick={() => setStepper({ type: 'revertFromNeutronLSM', validator, amount })}>Revert</Button>
    </div>
}

const LockForm = ({ onSubmit }: { onSubmit: (validator: string, amount: string, duration: number) => void }) => {
    const [validator, setValidator] = useState('cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv');
    // 0.01 atom in uatom for testing
    const [amount, setAmount] = useState('10000');
    // 3 months for testing
    const [duration, setDuration] = useState('7884000000000000');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(validator, amount, parseInt(duration));
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

async function checkLSMShares(hubAddress: string, neutronAddress: string): Promise<{ hub: {amount: string, validator: string} | undefined, neutron: {amount: string, validator: string} | undefined }> {
    return { hub: undefined, neutron: undefined }
}
