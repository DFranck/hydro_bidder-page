"use client"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx"
import { checkForGasOnNeutron } from "./checkForGasOnNeutron"

export async function broadcastAndRelayIBCGasToNeutron(
  hubSigner: SigningStargateClient,
  neutronChain: ChainContext,
  signedTx: TxRaw,
  resolveResponsesTimeoutMs: number = 180000,
  resolveResponsesCheckIntervalMs: number = 12000
) {
  await hubSigner.broadcastTx(new Uint8Array(TxRaw.encode(signedTx).finish()))

  const startTime = Date.now()

  while (Date.now() - startTime < resolveResponsesTimeoutMs) {
    await new Promise((resolve) =>
      setTimeout(resolve, resolveResponsesCheckIntervalMs)
    )

    const gasCheck = await checkForGasOnNeutron(neutronChain)

    if (gasCheck.hasEnoughUatom) {
      console.log(
        `Gas (${gasCheck.uatomBalance} uatom) successfully transferred to Neutron`
      )
      return gasCheck
    }
  }

  throw new Error(
    `Timeout: Gas transfer not detected within ${resolveResponsesTimeoutMs}ms`
  )
}
