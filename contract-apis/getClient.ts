import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import {
  TributeBaseClient,
  TributeBaseQueryClient,
} from "@/app/ts_types/TributeBase.client"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import "@netlify/functions"
import { invariant } from "ts-invariant"

const nextPublicHydroContractAddress =
  process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS ??
  Netlify?.env?.get("NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS")

const nextPublicTributeContractAddress =
  process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS ??
  Netlify?.env?.get("NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS")

export async function getHydroQueryClient() {
  invariant(
    nextPublicHydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set"
  )

  const client = await getCosmWasmClient()

  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    nextPublicHydroContractAddress
  )

  return hydroQueryClient
}

export async function getTributeQueryClient() {
  invariant(
    nextPublicTributeContractAddress,
    "NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS is not set"
  )

  const client = await getCosmWasmClient()

  const tributeQueryClient = new TributeBaseQueryClient(
    client,
    nextPublicTributeContractAddress
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
  invariant(
    nextPublicTributeContractAddress,
    "NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS is not set"
  )

  const client = await getSigningCosmWasmClient()

  const tributeClient = new TributeBaseClient(
    client,
    address,
    nextPublicTributeContractAddress
  )

  return tributeClient
}
