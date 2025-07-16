import { TributeBaseClient } from "@/app/ts_types/TributeBase.client"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export async function getTributeSigningClient({
  address,
  tributeContractAddress,
  getSigningCosmWasmClient,
}: {
  address: string
  tributeContractAddress: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
}) {
  const client = await getSigningCosmWasmClient()

  const tributeClient = new TributeBaseClient(
    client,
    address,
    tributeContractAddress
  )

  return tributeClient
}
