"use client"

import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { MsgWithdrawAllTokenizeShareRecordReward } from "moonkittjs/dist/codegen/gaia/liquid/v1beta1/tx"

export async function signClaimTokenizedRewards(
  hubChain: ChainContext,
  hubSigner: SigningStargateClient
) {
  if (!hubChain.address) {
    throw new Error("Hub chain address not set")
  }

  const msg: {
    typeUrl: string
    value: MsgWithdrawAllTokenizeShareRecordReward
  } = {
    typeUrl: "/gaia.liquid.v1beta1.MsgWithdrawAllTokenizeShareRecordReward",
    value: {
      ownerAddress: hubChain.address,
    },
  }

  const fee = await hubChain.estimateFee([msg], undefined, undefined, 1.5)
  return await hubSigner.signAndBroadcast(hubChain.address, [msg], fee, "")
}
