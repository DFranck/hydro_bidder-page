"use client"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx"
import { txRaw } from "./_consts"
import { checkForHubLSMShares } from "./checkForHubLSMShares"

export async function broadcastAndRelayIBCNeutronToHub(
  hubSigner: SigningStargateClient,
  hubChain: ChainContext,
  neutronSigner: SigningStargateClient,
  neutronChain: ChainContext,
  denom: string,
  baseDenom: string,
  signedTx: TxRaw,
  resolveResponsesTimeoutMs: number = 180000,
  resolveResponsesCheckIntervalMs: number = 12000
) {
  neutronSigner.broadcastTx(new Uint8Array(txRaw.encode(signedTx).finish()))

  const startTime = Date.now()

  while (Date.now() - startTime < resolveResponsesTimeoutMs) {
    await new Promise((resolve) =>
      setTimeout(resolve, resolveResponsesCheckIntervalMs)
    )

    const hubShares = await checkForHubLSMShares(hubChain, hubSigner)
    const foundShare = hubShares.find((share) => share.denom === baseDenom)

    if (foundShare) {
      console.log(`LSM shares (${foundShare}) successfully transferred to Hub`)
      return foundShare
    }
  }

  throw new Error(
    `Timeout: LSM shares (${denom}) transfer not detected within ${resolveResponsesTimeoutMs}ms`
  )
}
