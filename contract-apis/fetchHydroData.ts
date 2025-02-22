"use server"

import {
  getHydroQueryClient,
  getTributeQueryClient,
} from "@/contract-apis/getClient"
import { RawHydroData } from "@/contract-apis/types"
import range from "lodash/range"

export async function fetchHydroData(): Promise<RawHydroData> {
  const hydroQueryClient = await getHydroQueryClient()
  const tributeQueryClient = await getTributeQueryClient()

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

  const allRoundIds = range(0, round_id + 1)

  const everyRoundAndTranchePair = allRoundIds.flatMap((roundId) =>
    tranches.map((tranche) => ({
      roundId,
      trancheId: tranche.id,
    }))
  )

  const proposalsAndLiquidityDeployments = await Promise.all(
    everyRoundAndTranchePair.map(async ({ roundId, trancheId }) => {
      const [{ proposals }, { liquidity_deployments }] = await Promise.all([
        hydroQueryClient.roundProposals({
          limit: 50,
          roundId,
          startFrom: 0,
          trancheId,
        }),
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

  const proposals = proposalsAndLiquidityDeployments.flatMap((o) => o.proposals)
  const liquidity_deployments = proposalsAndLiquidityDeployments.flatMap(
    (o) => o.liquidity_deployments
  )

  const tributes = (
    await Promise.all(
      proposals.map(async ({ round_id, proposal_id }) => {
        const { tributes } = await tributeQueryClient.proposalTributes({
          roundId: round_id,
          proposalId: proposal_id,
          limit: 10,
          startFrom: 0,
        })
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
