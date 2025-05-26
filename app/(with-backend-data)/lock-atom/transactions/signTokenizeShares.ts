"use client"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { MsgTokenizeShares } from "moonkittjs/dist/codegen/gaia/liquid/v1beta1/tx"

export async function signTokenizeShares(
  hubChain: ChainContext,
  hubSigner: SigningStargateClient,
  amount: string,
  validator: string
) {
  if (!hubChain.address) {
    throw new Error("Hub chain address not set")
  }

  const msg: { typeUrl: string; value: MsgTokenizeShares } = {
    typeUrl: "/gaia.liquid.v1beta1.MsgTokenizeShares",
    value: {
      delegatorAddress: hubChain.address,
      validatorAddress: validator,
      amount: { denom: "uatom", amount: amount },
      tokenizedShareOwner: hubChain.address,
    },
  }

  const fee = await hubChain.estimateFee([msg], undefined, undefined, 1.5)
  return await hubSigner.sign(hubChain.address, [msg], fee, "")
}
