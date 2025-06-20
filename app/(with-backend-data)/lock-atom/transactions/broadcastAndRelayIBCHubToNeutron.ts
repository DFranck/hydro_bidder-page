"use client"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx"
import { txRaw } from "./_consts"
import { checkForNeutronLSMShares } from "./checkForNeutronLSMShares"

export async function broadcastAndRelayIBCHubToNeutron(
  hubSigner: SigningStargateClient,
  hubChain: ChainContext,
  neutronSigner: SigningStargateClient,
  neutronChain: ChainContext,
  denom: string,
  signedTx: TxRaw,
  resolveResponsesTimeoutMs: number = 180000,
  resolveResponsesCheckIntervalMs: number = 12000
) {
  await hubSigner.broadcastTx(new Uint8Array(txRaw.encode(signedTx).finish()))

  const startTime = Date.now()

  while (Date.now() - startTime < resolveResponsesTimeoutMs) {
    await new Promise((resolve) =>
      setTimeout(resolve, resolveResponsesCheckIntervalMs)
    )

    const neutronShares = await checkForNeutronLSMShares(neutronChain)
    const foundShare = neutronShares.find((share) => share.baseDenom === denom)

    if (foundShare) {
      console.log(`LSM shares (${denom}) successfully transferred to Neutron`)
      return foundShare
    }
  }

  throw new Error(
    `Timeout: LSM shares (${denom}) transfer not detected within ${resolveResponsesTimeoutMs}ms`
  )
}
