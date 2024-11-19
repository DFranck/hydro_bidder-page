"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { fetchAssetListWithPrices } from "@/contract-apis/fetchAssetListWithPrices"
import { useMyVotes } from "@/contract-apis/useMyVotes"
import { estimatedRewardForPower, sumTributeAmounts } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"

function proposalTotalTribute(
  pricedAndNamedTributes: {
    priceUsd: number | undefined
    symbol: string | undefined
    decimals: number | undefined
    denom: string
    amount: number
  }[]
) {
  return pricedAndNamedTributes.reduce((total, tribute) => {
    return (
      total +
      ((tribute.priceUsd ?? 0) * tribute.amount) / 10 ** (tribute.decimals ?? 0)
    )
  }, 0)
}

const getPricedAndNamedTributes = (
  tributes: Tribute[],
  assetListWithPrices: Awaited<ReturnType<typeof fetchAssetListWithPrices>>
) => {
  const summedTributes = sumTributeAmounts(tributes)
  return summedTributes.map((tribute) => {
    const assetInfo = assetListWithPrices.get(tribute.denom)
    return {
      ...tribute,
      priceUsd: assetInfo?.priceUsd,
      symbol: assetInfo?.symbol,
      decimals: assetInfo?.decimals,
    }
  })
}

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

  const chosenProposalId = myVotes?.get(trancheId)?.prop_id

  const chosenProposal = proposals?.find(
    (proposal) => proposal.proposal_id === chosenProposalId
  )

  const chosenProposalReward = chosenProposal
    ? estimatedRewardForPower(
        proposalTotalTribute(
          getPricedAndNamedTributes(
            currentProposalTributes.get(chosenProposal.proposal_id)!,
            assetListWithPrices
          )
        ),
        Number(myVotes?.get(trancheId)?.power ?? 0),
        Number(chosenProposal.power ?? 0)
      )
    : undefined

  const decoratedProposals = proposals?.map((proposal) => {
    const tributes = currentProposalTributes.get(proposal.proposal_id)!

    const pricedAndNamedTributes = getPricedAndNamedTributes(
      tributes,
      assetListWithPrices
    )

    const hasVotedOnProp =
      myVotes?.get(trancheId)?.prop_id === proposal.proposal_id

    const totalTributeValue = proposalTotalTribute(pricedAndNamedTributes)

    const estimatedRewardForUser = trancheId
      ? estimatedRewardForPower(
          totalTributeValue,
          Number(myVotes?.get(trancheId)?.power ?? 0),
          Number(proposal.power ?? 0)
        )
      : undefined

    const percentDifferenceRewardForUser = chosenProposalReward
      ? Math.round(
          (((estimatedRewardForUser ?? 0) - chosenProposalReward) /
            chosenProposalReward) *
            100
        )
      : undefined

    return {
      ...proposal,
      ...(globalState.bidDescriptions[proposal.proposal_id] ?? {}),
      pricedAndNamedTributes,
      hasVotedOnProp,
      estimatedRewardForUser,
      percentDifferenceRewardForUser,
      totalTributeValue,
    }
  })

  return decoratedProposals
}
