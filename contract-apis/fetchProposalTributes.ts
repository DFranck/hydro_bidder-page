"use server"

import { TributeBaseQueryClient } from "@/app/ts_types/TributeBase.client"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { getCosmWasmClient } from "./getCosmWasmClient"
import { endpointsShared } from "@/config"

export async function fetchProposalTributes(
  roundId: number,
  trancheId: number,
  bidId: number
): Promise<Tribute[]> {
  if (!process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS) {
    throw new Error("Tribute contract address not set")
  }

  const neutronRpcEndpoint = endpointsShared.neutron.rpc[0]

  const client = await getCosmWasmClient({
    endpoint: neutronRpcEndpoint,
  })
  const tributeQueryClient = new TributeBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_TRIBUTE_CONTRACT_ADDRESS
  )

  const query = {
    roundId,
    trancheId,
    proposalId: bidId,
    limit: 10,
    startFrom: 0,
  }

  const { tributes } = await tributeQueryClient.proposalTributes(query)

  return tributes
}
