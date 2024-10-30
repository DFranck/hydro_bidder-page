"use client"

import React from "react"
import { ContinueFromHubStepper } from "./ContinueFromHubStepper"
import { ContinueFromNeutronStepper } from "./ContinueFromNeutronStepper"
import { LockStepper } from "./LockStepper"
import { RevertFromHubStepper } from "./RevertFromHubStepper"
import { RevertFromNeutronStepper } from "./RevertFromNeutronStepper"

import { Validator } from "@/hooks/hooks"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"

// Mock chain contexts and onExit function for demonstration
const mockChainContext: ChainContext = {} as ChainContext
const mockOnExit = () => {}

// Add a mock validatorMap
const mockValidatorMap = new Map<string, Validator>([
    [
        "cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv",
        {
            operator_address:
                "cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv",
            validator_bond_shares: "100",
            liquid_shares: "100",
            delegator_shares: "100",
            description: {
                moniker: "Mock Validator",
            },
        },
    ],
])

type StepperProps = {
    title: string
    states: string[]
    StepperComponent: React.FC<any>
    additionalProps?: Record<string, any>
}

function StepperSection({
    title,
    states,
    StepperComponent,
    additionalProps = {},
}: StepperProps) {
    return (
        <div className="w-full p-2 md:w-1/2 lg:w-1/5">
            <h2 className="mb-4 text-xl font-bold">{title}</h2>
            {states.map((state) => (
                <div key={state} className="mb-4">
                    <h3 className="mb-2 text-lg font-semibold">{state}</h3>
                    <StepperComponent
                        amount="100"
                        validator="cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv"
                        hubChain={mockChainContext}
                        neutronChain={mockChainContext}
                        onExit={mockOnExit}
                        startState={state as any}
                        validatorMap={mockValidatorMap}
                        {...additionalProps}
                    />
                </div>
            ))}
        </div>
    )
}

export const StepperOverview: React.FC = () => {
    return (
        <div className="flex flex-wrap justify-around p-4">
            <StepperSection
                title="Lock"
                states={[
                    "Init",
                    "WaitingForTokenizeSigning",
                    "WaitingForTokenizeBroadcast",
                    "Error",
                    "WaitingForIBCSigning",
                    "WaitingForIBCBroadcastAndRelay",
                    "WaitingForLockingSigning",
                    "WaitingForLockingBroadcast",
                    "Success",
                ]}
                StepperComponent={LockStepper}
                additionalProps={{
                    lockDuration: 180 * 86400000000000, // 14 days in seconds
                    hubSigner: {} as SigningStargateClient, // Mock signer
                    neutronSigner: {} as SigningStargateClient, // Mock signer
                }}
            />
            <StepperSection
                title="RevertFromHub"
                states={[
                    "Init",
                    "WaitingForRedeemSigning",
                    "WaitingForRedeemBroadcast",
                    "Success",
                    "Error",
                ]}
                StepperComponent={RevertFromHubStepper}
                additionalProps={{
                    denom: "uatom",
                    deleteIncompleteNotice: mockOnExit,
                }}
            />
            <StepperSection
                title="RevertFromNeutron"
                states={[
                    "Init",
                    "WaitingForIBCSigning",
                    "WaitingForIBCBroadcast",
                    "WaitingForRedeemSigning",
                    "WaitingForRedeemBroadcast",
                    "Success",
                    "Error",
                ]}
                StepperComponent={RevertFromNeutronStepper}
                additionalProps={{
                    denom: "uatom",
                    baseDenom: "uatom",
                    deleteIncompleteNotice: mockOnExit,
                }}
            />
            <StepperSection
                title="ContinueFromNeutron"
                states={[
                    "Init",
                    "WaitingForLockSigning",
                    "WaitingForLockBroadcast",
                    "Success",
                    "Error",
                ]}
                StepperComponent={ContinueFromNeutronStepper}
                additionalProps={{
                    denom: "uatom",
                    baseDenom: "uatom",
                    deleteIncompleteNotice: mockOnExit,
                }}
            />
            <StepperSection
                title="ContinueFromHub"
                states={[
                    "Init",
                    "WaitingForIBCSigning",
                    "WaitingForIBCBroadcastAndRelay",
                    "WaitingForLockingSigning",
                    "WaitingForLockingBroadcast",
                    "Success",
                    "Error",
                ]}
                StepperComponent={ContinueFromHubStepper}
                additionalProps={{
                    denom: "uatom",
                    deleteIncompleteNotice: mockOnExit,
                }}
            />
        </div>
    )
}
