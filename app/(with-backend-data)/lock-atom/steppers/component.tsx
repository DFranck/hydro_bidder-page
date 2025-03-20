"use client"

import React from "react"

import { Validator } from "@/contract-apis/fetchWalletValidators"
import { ChainContext } from "@cosmos-kit/core"

// Mock chain contexts and onExit function for demonstration
const mockChainContext: ChainContext = {} as ChainContext
const mockOnExit = () => {}

// Add a mock validatorMap
const mockValidatorMap = new Map<string, Validator>([
  [
    "cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv",
    {
      operator_address: "cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv",
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
