"use client"
import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"
import { StdFee } from "@cosmjs/amino"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { MsgExecuteContract } from "interchain/dist/codegen/cosmwasm/wasm/v1/tx"

export async function signLockTokens(
  neutronChain: ChainContext,
  neutronSigner: SigningStargateClient,
  lockDuration: number,
  denom: string,
  amount: string
) {
  const client = await neutronChain.getSigningCosmWasmClient()

  if (!neutronChain.address) {
    throw new Error("Neutron chain address not set")
  }

  const hydroClient = new HydroBaseClient(
    client,
    neutronChain.address,
    getEnvironmentVariable("NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS")
  )

  // pepare message for simulating gas
  const simulateMsg = MsgExecuteContract.fromPartial({
    contract: getEnvironmentVariable("NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS"),
    sender: neutronChain.address,
    msg: new TextEncoder().encode(
      JSON.stringify({
        lock_tokens: {
          lock_duration: lockDuration,
        },
      })
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
    ""
  )

  // use gas from simulated message with a gas multiplier
  const fee: StdFee = {
    amount: [],
    gas: Math.round(gasEstimate * 1.55).toString(),
  }
  const response = await hydroClient.lockTokens({ lockDuration }, fee, "", [
    { denom, amount },
  ])
  return response
}
