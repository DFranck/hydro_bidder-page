"use client"

import React from "react"
import { LockStepper } from "./LockStepper"
import { RevertFromHubStepper } from "./RevertFromHubStepper"
import { RevertFromNeutronStepper } from "./RevertFromNeutronStepper"
import { ContinueFromHubStepper } from "./ContinueFromHubStepper"
import { ContinueFromNeutronStepper } from "./ContinueFromNeutronStepper"

import { ChainContext } from "@cosmos-kit/core"
import { SigningStargateClient } from "@cosmjs/stargate"
import { Validator } from "@/hooks/hooks"

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

export const StepperOverview: React.FC = () => {
    return (
        <div className="flex flex-wrap justify-around p-4">
            <div className="w-full md:w-1/2 lg:w-1/5 p-2">
                <h2 className="text-xl font-bold mb-4">Lock</h2>
                {[
                    "Init",
                    "WaitingForTokenizeSigning",
                    "WaitingForTokenizeBroadcast",
                    "Error",
                    "WaitingForIBCSigning",
                    "WaitingForIBCBroadcastAndRelay",
                    "WaitingForLockingSigning",
                    "WaitingForLockingBroadcast",
                    "Success",
                ].map((state) => (
                    <div key={state} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{state}</h3>
                        <LockStepper
                            amount="100"
                            validator="cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv"
                            lockDuration={180 * 86400000000000} // 14 days in seconds
                            hubChain={mockChainContext}
                            hubSigner={{} as SigningStargateClient} // Mock signer
                            neutronChain={mockChainContext}
                            neutronSigner={{} as SigningStargateClient} // Mock signer
                            onExit={mockOnExit}
                            startState={state as any}
                            validatorMap={mockValidatorMap}
                        />
                    </div>
                ))}
            </div>

            <div className="w-full md:w-1/2 lg:w-1/5 p-2">
                <h2 className="text-xl font-bold mb-4">RevertFromHub</h2>
                {[
                    "Init",
                    "WaitingForRedeemSigning",
                    "WaitingForRedeemBroadcast",
                    "Success",
                    "Error",
                ].map((state) => (
                    <div key={state} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{state}</h3>
                        <RevertFromHubStepper
                            amount="100"
                            validator="cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv"
                            denom="uatom"
                            hubChain={mockChainContext}
                            neutronChain={mockChainContext}
                            onExit={mockOnExit}
                            startState={state as any}
                            validatorMap={mockValidatorMap}
                            deleteIncompleteNotice={mockOnExit}
                        />
                    </div>
                ))}
            </div>

            <div className="w-full md:w-1/2 lg:w-1/5 p-2">
                <h2 className="text-xl font-bold mb-4">RevertFromNeutron</h2>
                {[
                    "Init",
                    "WaitingForIBCSigning",
                    "WaitingForIBCBroadcast",
                    "WaitingForRedeemSigning",
                    "WaitingForRedeemBroadcast",
                    "Success",
                    "Error",
                ].map((state) => (
                    <div key={state} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{state}</h3>
                        <RevertFromNeutronStepper
                            amount="100"
                            validator="cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv"
                            denom="uatom"
                            hubChain={mockChainContext}
                            neutronChain={mockChainContext}
                            onExit={mockOnExit}
                            startState={state as any}
                            validatorMap={mockValidatorMap}
                            baseDenom="uatom"
                            deleteIncompleteNotice={mockOnExit}
                        />
                    </div>
                ))}
            </div>

            <div className="w-full md:w-1/2 lg:w-1/5 p-2">
                <h2 className="text-xl font-bold mb-4">ContinueFromNeutron</h2>
                {[
                    "Init",
                    "WaitingForLockSigning",
                    "WaitingForLockBroadcast",
                    "Success",
                    "Error",
                ].map((state) => (
                    <div key={state} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{state}</h3>
                        <ContinueFromNeutronStepper
                            amount="100"
                            validator="cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv"
                            denom="uatom"
                            hubChain={mockChainContext}
                            neutronChain={mockChainContext}
                            onExit={mockOnExit}
                            startState={state as any}
                            validatorMap={mockValidatorMap}
                            baseDenom="uatom"
                            deleteIncompleteNotice={mockOnExit}
                        />
                    </div>
                ))}
            </div>

            <div className="w-full md:w-1/2 lg:w-1/5 p-2">
                <h2 className="text-xl font-bold mb-4">ContinueFromHub</h2>
                {[
                    "Init",
                    "WaitingForIBCSigning",
                    "WaitingForIBCBroadcastAndRelay",
                    "WaitingForLockingSigning",
                    "WaitingForLockingBroadcast",
                    "Success",
                    "Error",
                ].map((state) => (
                    <div key={state} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{state}</h3>
                        <ContinueFromHubStepper
                            amount="100"
                            validator="cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv"
                            denom="uatom"
                            hubChain={mockChainContext}
                            neutronChain={mockChainContext}
                            onExit={mockOnExit}
                            startState={state as any}
                            validatorMap={mockValidatorMap}
                            deleteIncompleteNotice={mockOnExit}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
