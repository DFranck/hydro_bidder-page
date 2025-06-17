import { getHydroQueryClient } from "../../../contract-apis/getClient"
import { RawHydroMetaData } from "../../../contract-apis/types"

export async function fetchHydroMetaData(): Promise<RawHydroMetaData> {
  const hydroQueryClient = await getHydroQueryClient()

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
  const allRoundIds = Array.from(
    { length: currentRoundId + 1 },
    (_, index) => index
  )

  const everyRoundAndTranchePair = allRoundIds.flatMap((roundId) =>
    tranches.map((tranche) => ({
      roundId,
      trancheId: tranche.id,
    }))
  )

  const liquidity_deployments = (
    await Promise.all(
      everyRoundAndTranchePair.map(async ({ roundId, trancheId }) => {
        const [{ liquidity_deployments }] = await Promise.all([
          hydroQueryClient.roundTrancheLiquidityDeployments({
            roundId,
            trancheId,
            startFrom: 0,
            limit: 1000,
          }),
        ])
        return liquidity_deployments
      })
    )
  ).flat()

  return {
    constants,
    liquidity_deployments,
    round_end,
    round_id,
    total_locked_tokens,
    tranches,
  }
}
