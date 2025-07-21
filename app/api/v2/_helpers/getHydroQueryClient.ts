import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"

export async function getHydroQueryClient({
  hydroContract,
}: {
  hydroContract: string
}) {
  const client = await getCosmWasmClient()

  const hydroQueryClient = new HydroBaseQueryClient(client, hydroContract)

  return hydroQueryClient
}
