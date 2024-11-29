import { Proposal } from "@/app/ts_types/HydroBase.types"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { fetchProposalTributes } from "./fetchProposalTributes"

export async function fetchProposalTributesForRound(
  bidsByTrancheId: Map<number, Proposal[]>,
  roundId: number
): Promise<Map<number, Tribute[]>> {
  const allBids = Array.from(bidsByTrancheId.values()).flat()

  const tributesResults = await Promise.all(
    allBids.map((bid) =>
      fetchProposalTributes(roundId, bid.tranche_id, bid.proposal_id).then(
        (tributes) => ({ proposal: bid, tributes })
      )
    )
  )

  const tributesByBidId = new Map<number, Tribute[]>()

  tributesResults.forEach(({ proposal, tributes }) => {
    tributesByBidId.set(proposal.proposal_id, tributes)
  })

  return tributesByBidId
}
