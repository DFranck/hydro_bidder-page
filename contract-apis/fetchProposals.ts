"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { Proposal } from "@/app/ts_types/HydroBase.types"
import { unstable_cache } from "next/cache"
import { cacheRevalidationInterval } from "./_globals"
import { getCosmWasmClient } from "./getCosmWasmClient"

export const fetchProposals = async (
  roundId: number,
  trancheId: number
): Promise<Proposal[]> => {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )
  // query all proposals and enrich with topNProposals percentage data
  // return proposals sorted by percentage in descending order
  const response = await unstable_cache(
    async () => {
      const roundProposals = await hydroQueryClient.roundProposals({
        limit: 20,
        roundId,
        startFrom: 0,
        trancheId,
      })
      const topNProposals = await hydroQueryClient.topNProposals({
        numberOfProposals: 20,
        roundId,
        trancheId,
      })

      const enrichedProposals = roundProposals.proposals
        .map((proposal) => {
          const matchingTopProposal = topNProposals.proposals.find(
            (topProposal) => topProposal.proposal_id === proposal.proposal_id
          )
          return {
            ...proposal,
            percentage: matchingTopProposal
              ? matchingTopProposal.percentage
              : proposal.percentage,
          }
        })
        .sort((a, b) => parseInt(b.percentage) - parseInt(a.percentage))

      return { proposals: enrichedProposals }
    },
    ["topNProposals", roundId.toString(), trancheId.toString()],
    { revalidate: cacheRevalidationInterval }
  )()
  return response.proposals
}
