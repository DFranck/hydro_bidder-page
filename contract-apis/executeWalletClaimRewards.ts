import { getTributeSigningClient } from "@/contract-apis/getClient"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export async function executeWalletClaimRewards({
  address,
  roundId,
  trancheId,
  tributeId,
  getSigningCosmWasmClient,
}: {
  address: string
  roundId: number
  trancheId: number
  tributeId: number
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
}) {
  const tributeSigningClient = await getTributeSigningClient({
    getSigningCosmWasmClient,
    address,
  })

  const query = {
    roundId,
    trancheId,
    tributeId,
    voterAddress: address,
  }

  return tributeSigningClient.claimTribute(query)
}
