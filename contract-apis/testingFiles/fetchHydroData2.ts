"use server"

import {
  getHydroQueryClient,
  getTributeQueryClient,
} from "@/contract-apis/getClient"
import { fetchRoundBids } from "@/contract-apis/mergedFetchers/fetchRoundBids"
import { fetchRoundTributes } from "@/contract-apis/mergedFetchers/fetchRoundTributes"
import { RawHydroData } from "@/contract-apis/types"
import { range } from "lodash"

export async function fetchHydroData2(): Promise<RawHydroData> {
  console.log("Fetching Hydro data...")
  const hydroQueryClient = await getHydroQueryClient()
  const tributeQueryClient = await getTributeQueryClient()
  console.log("Clients fetched")

  const a = await Promise.all([hydroQueryClient.constants()])
  console.log("Clients fetched")

  const [
    { constants },
    { round_end, round_id },
    { tranches },
    { total_locked_tokens },
  ] = await Promise.all([
    hydroQueryClient.constants(),
    hydroQueryClient.currentRound(),
    hydroQueryClient.tranches(),
    hydroQueryClient.totalLockedTokens(),
  ])

  const currentRoundId = round_id
  const allRoundIds = range(0, currentRoundId + 1)

  const everyRoundAndTranchePair = allRoundIds.flatMap((roundId) =>
    tranches.map((tranche) => ({
      roundId,
      trancheId: tranche.id,
    }))
  )

  const proposalsAndLiquidityDeployments = await Promise.all(
    everyRoundAndTranchePair.map(async ({ roundId, trancheId }) => {
      const [proposals, { liquidity_deployments }] = await Promise.all([
        fetchRoundBids(roundId, trancheId, currentRoundId),
        hydroQueryClient.roundTrancheLiquidityDeployments({
          roundId,
          trancheId,
          startFrom: 0,
          limit: 1000,
        }),
      ])
      return { proposals, liquidity_deployments }
    })
  )

  const proposals = proposalsAndLiquidityDeployments
    .flatMap((o) => o.proposals)
    .sort((a, b) => a.proposal_id - b.proposal_id)
  const liquidity_deployments = proposalsAndLiquidityDeployments.flatMap(
    (o) => o.liquidity_deployments
  )

  const tributes = (
    await Promise.all(
      allRoundIds.map(async (roundId) => {
        const tributes = await fetchRoundTributes(roundId, currentRoundId)
        return tributes
      })
    )
  ).flat()

  return {
    constants,
    liquidity_deployments,
    proposals,
    round_end,
    round_id,
    total_locked_tokens,
    tranches,
    tributes,
  }
}
