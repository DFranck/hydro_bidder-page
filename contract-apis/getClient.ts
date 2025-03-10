import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import {
  TributeBaseClient,
  TributeBaseQueryClient,
} from "@/app/ts_types/TributeBase.client"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export async function getHydroQueryClient({
  hydroContractAddress,
  numiaCosmosHydroAppApiKey,
}: {
  hydroContractAddress: string
  numiaCosmosHydroAppApiKey: string
}) {
  const client = await getCosmWasmClient({ numiaCosmosHydroAppApiKey })
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    hydroContractAddress
  )
  return hydroQueryClient
}

export async function getTributeQueryClient({
  tributeContractAddress,
  numiaCosmosHydroAppApiKey,
}: {
  tributeContractAddress: string
  numiaCosmosHydroAppApiKey: string
}) {
  const client = await getCosmWasmClient({ numiaCosmosHydroAppApiKey })
  const tributeQueryClient = new TributeBaseQueryClient(
    client,
    tributeContractAddress
  )
  return tributeQueryClient
}

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
