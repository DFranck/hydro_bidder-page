import { TributeBaseClient } from "@/app/ts_types/TributeBase.client"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export async function executeWalletAddTribute({
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
  description: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
}) {
  if (!process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS) {
    throw new Error("Tribute contract address not set")
  }

  const query = {
    proposalId,
    roundId,
    trancheId,
  }
  const client = await getSigningCosmWasmClient()
  const tributeClient = new TributeBaseClient(
    client,
    address,
    process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS,
  )

  return tributeClient.addTribute(query, "auto", description, [{ amount, denom }])
}
