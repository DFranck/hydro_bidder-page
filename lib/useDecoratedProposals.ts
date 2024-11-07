"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { useMyVotes } from "@/hooks/hooks"
import { sumTributeAmounts } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"

export const useDecoratedProposals = ({ trancheId }: { trancheId: number }) => {
  const {
    currentProposalTranches,
    currentProposalTributes,
    globalState,
    assetListWithPrices,
  } = useAppContext()

  const { address } = useChain("neutron")

  const { data: myVotes } = useMyVotes(
    address || "",
    globalState.currentRound,
    Array.from(currentProposalTranches.keys())
  )

  const proposals = currentProposalTranches.get(trancheId)

  const decoratedProposals = proposals?.map((proposal, index) => {
    const tributes = currentProposalTributes.get(proposal.proposal_id)!

    const summedTributes = sumTributeAmounts(tributes)

    const pricedAndNamedTributes = summedTributes.map((tribute) => {
      const assetInfo = assetListWithPrices.get(tribute.denom)
      return {
        ...tribute,
        priceUsd: assetInfo?.priceUsd,
        symbol: assetInfo?.symbol,
        decimals: assetInfo?.decimals,
      }
    })

    const hasVotedOnProp =
      myVotes?.get(trancheId) &&
      myVotes.get(trancheId)?.prop_id === proposal.proposal_id

    return {
      ...proposal,
      ...(globalState.bidDescriptions[proposal.proposal_id] ?? {}),
      pricedAndNamedTributes,
      hasVotedOnProp,
    }
  })

  return decoratedProposals
}
