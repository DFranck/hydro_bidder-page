"use client"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { MsgRedeemTokensForShares } from "moonkittjs/dist/codegen/gaia/liquid/v1beta1/tx"

export async function signRedeemTokensForShares(
  hubChain: ChainContext,
  hubSigner: SigningStargateClient,
  amount: string,
  denom: string
) {
  if (!hubChain.address) {
    throw new Error("Hub chain address not set")
  }

  const msg: { typeUrl: string; value: MsgRedeemTokensForShares } = {
    typeUrl: "/gaia.liquid.v1beta1.MsgRedeemTokensForShares",
    value: {
      delegatorAddress: hubChain.address,
      amount: { denom, amount },
    },
  }

  const fee = await hubChain.estimateFee([msg], undefined, undefined, 1.5)
  return await hubSigner.sign(hubChain.address, [msg], fee, "")
}
