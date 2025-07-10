import { TributeBaseQueryClient } from "@/app/ts_types/TributeBase.client"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"

export async function getTributeQueryClient({
  tributeContract,
}: {
  tributeContract: string
}) {
  const client = await getCosmWasmClient()

  const tributeQueryClient = new TributeBaseQueryClient(client, tributeContract)

  return tributeQueryClient
}
