import { TributeBaseClient } from "@/app/ts_types/TributeBase.client"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export async function executeWalletClaimRewards(
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
  address: string,
  roundId: number,
  trancheId: number,
  tributeId: number
) {
  if (!process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS) {
    throw new Error("Tribute contract address not set")
  }

  const client = await getSigningCosmWasmClient()
  const tributeClient = new TributeBaseClient(
    client,
    address,
    process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS
  )

  const query = {
    roundId,
    trancheId,
    tributeId,
    voterAddress: address,
  }

  return tributeClient.claimTribute(query)
}
