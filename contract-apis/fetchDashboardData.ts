"use server"

import { Proposal } from "@/app/ts_types/HydroBase.types"
import { fetchAssetListWithPrices } from "./fetchAssetListWithPrices"
import { fetchGlobalState } from "./fetchGlobalState"
import { fetchProposalTributesForRound } from "./fetchProposalTributesForRound"
import { fetchProposals } from "./fetchProposals"
import { fetchRoundState } from "./fetchRoundState"

export async function fetchDashboardData() {
  const globalState = await fetchGlobalState()

  const { currentRound, tranches } = globalState

  const lastRound = currentRound - 1
  const lastRoundExists = lastRound > -1

  // TODO: Lots of sequential "awaits" here, but shouldn't matter since this stuff will be fetched on the server
  const currentProposals = await Promise.all(
    tranches.map((tranche) => {
      return fetchProposals(currentRound, tranche.id)
    })
  )

  let currentRoundEnd = undefined
  let currentVotingPower = undefined

  const currentRoundData = await fetchRoundState(currentRound)
  currentRoundEnd = currentRoundData.roundEnd
  currentVotingPower = currentRoundData.totalVotingPower

  // The first round that Hydro runs, there will be no deployed proposals
  let lastProposalTranches = undefined
  let lastVotingPower = undefined
  let lastProposalTributes = undefined
  if (lastRoundExists) {
    const lastProposals = await Promise.all(
      tranches.map((tranche) => fetchProposals(lastRound, tranche.id))
    )
    lastVotingPower = await fetchRoundState(lastRound).then(
      (response) => response.totalVotingPower
    )

    lastProposalTranches = tranches.reduce((acc, tranche, idx) => {
      return acc.set(tranche.id, lastProposals[idx])
    }, new Map<number, Proposal[]>())

    lastProposalTributes = await fetchProposalTributesForRound(
      lastProposalTranches,
      lastRound
    )
  }

  const currentProposalTranches: Map<number, Proposal[]> = tranches.reduce(
    (acc, tranche, idx) => {
      return acc.set(tranche.id, currentProposals[idx])
    },
    new Map<number, Proposal[]>()
  )

  const currentProposalTributes = await fetchProposalTributesForRound(
    currentProposalTranches,
    currentRound
  )

  const assetListWithPrices = await fetchAssetListWithPrices()

  const atomPrice =
    assetListWithPrices.get(
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
    )?.priceUsd ?? 0

  return {
    lastProposalTranches,
    currentProposalTranches,
    lastVotingPower,
    currentVotingPower,
    globalState: {
      ...globalState,
      atomPrice,
    },
    currentProposalTributes,
    lastProposalTributes,
    currentRoundEnd,
    assetListWithPrices,
  }
}
