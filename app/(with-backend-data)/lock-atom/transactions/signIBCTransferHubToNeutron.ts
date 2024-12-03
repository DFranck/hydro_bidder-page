"use client"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { MsgTransfer } from "stridejs/types/codegen/ibc/applications/transfer/v1/tx"

export async function signIBCTransferHubToNeutron(
  hubChain: ChainContext,
  hubSigner: SigningStargateClient,
  neutronChain: ChainContext,
  amount: string,
  denom: string
) {
  if (!hubChain.address) {
    throw new Error("Hub chain address not set")
  }
  if (!neutronChain.address) {
    throw new Error("Neutron chain address not set")
  }

  const msg: { typeUrl: string; value: MsgTransfer } = {
    typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
    value: {
      sourcePort: "transfer",
      sourceChannel: "channel-569",
      token: { denom, amount },
      sender: hubChain.address,
      receiver: neutronChain.address,
      timeoutHeight: {
        revisionHeight: BigInt(0),
        revisionNumber: BigInt(0),
      },
      timeoutTimestamp: BigInt(Date.now() + 5 * 60 * 1000) * BigInt(1000000),
      memo: "",
    },
  }

  const fee = await hubChain.estimateFee([msg], undefined, undefined, 1.5)
  return await hubSigner.sign(hubChain.address, [msg], fee, "")
}
