"use client"

import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { MsgWithdrawAllTokenizeShareRecordReward } from "stridejs/types/codegen/cosmos/distribution/v1beta1/tx"

// ✅ Using MsgWithdrawAllTokenizeShareRecordReward from `stridejs` works as expected.
// The message shape is compatible with the transaction logic and signer.
// Can be swapped with moonkittjs if needed (commented above).
// import { MsgWithdrawAllTokenizeShareRecordReward } from "moonkittjs/dist/codegen/cosmos/distribution/v1beta1/tx"

export async function signClaimTokenizedRewards(
  hubChain: ChainContext,
  hubSigner: SigningStargateClient,
) {
  if (!hubChain.address) {
    throw new Error("Hub chain address not set")
  }

  const msg = {
    typeUrl:
      "/cosmos.distribution.v1beta1.MsgWithdrawAllTokenizeShareRecordReward",
    value: {
      ownerAddress: hubChain.address,
    } satisfies MsgWithdrawAllTokenizeShareRecordReward,
  }

  const fee = await hubChain.estimateFee([msg], undefined, undefined, 1.5)
  return await hubSigner.signAndBroadcast(hubChain.address, [msg], fee, "")
}
