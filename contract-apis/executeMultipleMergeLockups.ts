import {
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate"
import { toUtf8 } from "@cosmjs/encoding"
import { invariant } from "ts-invariant"
import { AugmentedLockup } from "./types"

export async function executeMultipleMergeLockups({
  address,
  getSigningCosmWasmClient,
  lockups,
}: {
  address: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
  lockups: AugmentedLockup[]
}) {
  const hydroContractAddress = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS

  invariant(
    hydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set"
  )

  const grouped = new Map<string, number[]>()

  for (const lockup of lockups) {
    const denom = lockup.funds.denom
    if (!grouped.has(denom)) {
      grouped.set(denom, [])
    }
    grouped.get(denom)!.push(lockup.id)
  }

  const client = await getSigningCosmWasmClient()

  const messages: MsgExecuteContractEncodeObject[] = Array.from(
    grouped.entries()
  )
    .filter(([_, lockIds]) => lockIds.length >= 2)
    .map(([_, lockIds]) => ({
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: address,
        contract: hydroContractAddress,
        msg: toUtf8(JSON.stringify({ merge_locks: { lock_ids: lockIds } })),
        funds: [],
      },
    }))

  const response = await client.signAndBroadcast(address, messages, "auto")

  return response
}
