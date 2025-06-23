import { Environment, getSource, SourceID } from "@v2/environments"
import { getHydroQueryClient } from "../../../_helpers/getHydroQueryClient"

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      environment: Environment
      source_id: SourceID
    }>
  }
) {
  const { environment, source_id } = await params
  const sourceObject = getSource(environment, source_id)
  const cacheDuration = sourceObject.cacheDuration

  const { hydroContract } = sourceObject

  const hydroQueryClient = await getHydroQueryClient({
    hydroContract,
  })

  const { round_id, round_end } = await hydroQueryClient.currentRound()

  return Response.json({ round_id, round_end }, {
    headers: {
      'Cache-Control': `public, s-maxage=${cacheDuration}, stale-while-revalidate=${cacheDuration * 2}`,
    },
  })
}
