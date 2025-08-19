import { TributeBaseClient } from "@/app/ts_types/TributeBase.client"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { invariant } from "ts-invariant"

export async function executeAddTribute({
  address,
  roundId,
  trancheId,
  proposalId,
  amount,
  denom,
  description,
  getSigningCosmWasmClient,
}: {
  address: string
  roundId: number
  trancheId: number
  proposalId: number
  amount: string
  denom: string
  description?: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
}) {
  const tributeContractAddress =
    process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS

  invariant(
    tributeContractAddress,
    "NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS is not set"
  )

  const query = {
    proposalId,
    roundId,
    trancheId,
  }

  const client = await getSigningCosmWasmClient()

  const tributeClient = new TributeBaseClient(
    client,
    address,
    tributeContractAddress
  )

  return tributeClient.addTribute(query, "auto", description, [
    { amount, denom },
  ])
}
