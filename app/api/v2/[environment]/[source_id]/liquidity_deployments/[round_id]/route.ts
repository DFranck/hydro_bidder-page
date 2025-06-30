import { getHydroQueryClient } from "@/app/api/v2/_helpers/getHydroQueryClient"
import { Tranche } from "@/app/ts_types/HydroBase.types"
import { Environment, getSource, SourceID } from "@v2/environments"

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      environment: Environment
      source_id: SourceID
      round_id: number
    }>
  }
) {
  const { environment, source_id, round_id } = await params

  const sourceObject = getSource(environment, source_id)

  const { hydroContract } = sourceObject

  const hydroQueryClient = await getHydroQueryClient({
    hydroContract,
  })

  // Get the tranches
  const tranchesResponse = await fetch(
    new URL(`/api/v2/${environment}/${source_id}?operation=tranches`, request.url)
  )
  const tranches = (await tranchesResponse.json()) as Tranche[]

  const tranchePairs = tranches.map((tranche) => ({
    roundId: round_id,
    trancheId: tranche.id,
  }))

  const liquidity_deployments = await Promise.all(
    tranchePairs.map(async ({ roundId, trancheId }) => {
      const { liquidity_deployments } =
        await hydroQueryClient.roundTrancheLiquidityDeployments({
          roundId: Number(roundId),
          trancheId: Number(trancheId),
          startFrom: 0,
          limit: 1000,
        })
      return liquidity_deployments
    })
  )

  return Response.json(liquidity_deployments)
}
