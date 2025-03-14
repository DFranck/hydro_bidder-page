import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import {
  TributeBaseClient,
  TributeBaseQueryClient,
} from "@/app/ts_types/TributeBase.client"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export async function getHydroQueryClient() {
  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    getEnvironmentVariable("NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS")
  )
  return hydroQueryClient
}

export async function getTributeQueryClient() {
  const client = await getCosmWasmClient()
  const tributeQueryClient = new TributeBaseQueryClient(
    client,
    getEnvironmentVariable("NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS")
  )
  return tributeQueryClient
}

export async function getTributeSigningClient({
  address,
  getSigningCosmWasmClient,
}: {
  address: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
}) {
  const client = await getSigningCosmWasmClient()
  const tributeClient = new TributeBaseClient(
    client,
    address,
    getEnvironmentVariable("NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS")
  )
  return tributeClient
}
