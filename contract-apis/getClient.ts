import { DTokenInfoProviderBaseQueryClient } from "@/app/ts_types/DTokenInfoProviderBase.client"
import { GatekeeperBaseQueryClient } from "@/app/ts_types/GatekeeperBase.client"
import {
  HydroBaseClient,
  HydroBaseQueryClient,
} from "@/app/ts_types/HydroBase.client"
import {
  MarketplaceBaseClient,
  MarketplaceBaseQueryClient,
} from "@/app/ts_types/MarketplaceBase.client"
import {
  TributeBaseClient,
  TributeBaseQueryClient,
} from "@/app/ts_types/TributeBase.client"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

import { invariant } from "ts-invariant"

const nextPublicHydroContractAddress =
  process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS

const nextPublicTributeContractAddress =
  process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS

const nextPublicMarketplaceContractAddress =
  process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS

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


export async function getLSTQueryClient(
  contract: string | undefined
) {
  invariant(contract, "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set")

  const client = await getCosmWasmClient()

  const lstQueryClient = new DTokenInfoProviderBaseQueryClient(client, contract)

  return lstQueryClient
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
export async function getMarketplaceQueryClient() {
  invariant(
    nextPublicMarketplaceContractAddress,
    "NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS is not set"
  )

  const client = await getCosmWasmClient()

  const marketplaceClient = new MarketplaceBaseQueryClient(
    client,
    nextPublicMarketplaceContractAddress
  )

  return marketplaceClient
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

export async function getGatekeeperQueryClient() {
  invariant(
    nextPublicHydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set"
  )

  const client = await getCosmWasmClient()

  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    nextPublicHydroContractAddress
  )

  const { gatekeeper: gatekeeperContractAddress } =
    await hydroQueryClient.gatekeeper()

  const gatekeeperQueryClient = new GatekeeperBaseQueryClient(
    client,
    gatekeeperContractAddress
  )

  return gatekeeperQueryClient
}

// Get Hydro signing client
export async function getHydroSigningClient({
  address,
  getSigningCosmWasmClient,
}: {
  address: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
}) {
  invariant(
    nextPublicHydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set"
  )

  const client = await getSigningCosmWasmClient()

  const hydroClient = new HydroBaseClient(
    client,
    address,
    nextPublicHydroContractAddress
  )

  return hydroClient
}

// Get Marketplace signing client
export async function getMarketplaceSigningClient({
  address,
  getSigningCosmWasmClient,
}: {
  address: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
}) {
  invariant(
    nextPublicMarketplaceContractAddress,
    "NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS is not set"
  )

  const client = await getSigningCosmWasmClient()

  const marketplaceClient = new MarketplaceBaseClient(
    client,
    address,
    nextPublicMarketplaceContractAddress
  )

  return marketplaceClient
}
