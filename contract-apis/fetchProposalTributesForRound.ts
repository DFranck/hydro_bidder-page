"use server"

import { Proposal } from "@/app/ts_types/HydroBase.types"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { fetchProposalTributes } from "./fetchProposalTributes"

// returns a map of proposal id to tributes
export async function fetchProposalTributesForRound(
  proposalTranches: Map<number, Proposal[]>,
  round: number
): Promise<Map<number, Tribute[]>> {
  const allProposals = Array.from(proposalTranches.values()).flat()
  const tributePromises = allProposals.map((proposal) =>
    fetchProposalTributes(
      round,
      proposal.tranche_id,
      proposal.proposal_id
    ).then((tributes) => ({ proposal, tributes }))
  )
  const tributesResults = await Promise.all(tributePromises)

  const proposalTributes = new Map<number, Tribute[]>()
  tributesResults.forEach(({ proposal, tributes }) => {
    proposalTributes.set(proposal.proposal_id, tributes)
  })

  return proposalTributes
}
