"use client"

import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { generateProof } from "@/contract-apis/generateProof"
import { StdFee } from "@cosmjs/amino"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { MsgExecuteContract } from "interchain/dist/codegen/cosmwasm/wasm/v1/tx"
import { invariant } from "ts-invariant"

export async function signLockTokens(
  neutronChain: ChainContext,
  neutronSigner: SigningStargateClient,
  lockDuration: number,
  denom: string,
  amount: string,
  hasGatekeeper: boolean
) {
  const client = await neutronChain.getSigningCosmWasmClient()

  const hydroContractAddress = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS

  invariant(neutronChain.address, "Neutron chain address not set")

  invariant(
    hydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set",
  )

  const hydroClient = new HydroBaseClient(
    client,
    neutronChain.address,
    hydroContractAddress,
  )

  let proof
  if (hasGatekeeper) {
    const proofResponse = await generateProof(neutronChain.address)
    proof = proofResponse
      ? {
          maximum_amount: proofResponse.amount,
          proof: [...proofResponse.proofs],
        }
      : undefined
  }

  // pepare message for simulating gas
  const simulateMsg = MsgExecuteContract.fromPartial({
    contract: hydroContractAddress,
    sender: neutronChain.address,
    msg: new TextEncoder().encode(
      JSON.stringify({
        lock_tokens: {
          lock_duration: lockDuration,
          proof,
        },
      }),
    ),
    funds: [{ amount, denom }],
  })

  // gas estimate from simulated message
  const gasEstimate = await hydroClient.client.simulate(
    neutronChain.address,
    [
      {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: simulateMsg,
      },
    ],
    "",
  )

  // use gas from simulated message with a gas multiplier
  const fee: StdFee = {
    amount: [],
    gas: Math.round(gasEstimate * 1.55).toString(),
  }

  const response = await hydroClient.lockTokens(
    { lockDuration, proof },
    fee,
    "",
    [{ denom, amount }]
  )
  return response
}
