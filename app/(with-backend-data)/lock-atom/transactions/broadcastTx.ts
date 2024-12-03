"use client"
import { SigningStargateClient } from "@cosmjs/stargate"
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx"
import { txRaw } from "./_consts"

export async function broadcastTx(
  hubSigner: SigningStargateClient,
  neutronSigner: SigningStargateClient,
  signedTx: TxRaw
) {
  return await hubSigner.broadcastTx(
    new Uint8Array(txRaw.encode(signedTx).finish())
  )
}
