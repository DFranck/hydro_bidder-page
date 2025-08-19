import { TributeBaseClient } from "@/app/ts_types/TributeBase.client"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { invariant } from "ts-invariant"

export async function executeRefundTribute({
  address,
  proposalId,
  roundId,
  trancheId,
  tributeId,
  getSigningCosmWasmClient,
  memo,
}: {
  address: string
  proposalId: number
  roundId: number
  trancheId: number
  tributeId: number
  memo?: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
}) {
  const tributeContractAddress = process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS
  invariant(tributeContractAddress, "NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS is not set")

  const client = await getSigningCosmWasmClient()
  const tributeClient = new TributeBaseClient(client, address, tributeContractAddress)

  return tributeClient.refundTribute(
    { proposalId, roundId, trancheId, tributeId },
    "auto",
    memo
  )
}
