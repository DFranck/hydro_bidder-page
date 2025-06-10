import { Environment, SourceID } from "@/app/(v2)/v2/environments"
import range from "lodash/range"

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

  const urlPrefix = `/api/v2/${environment}/${source_id}`

  const currentRoundIdResponse = await fetch(
    new URL(`${urlPrefix}/current_round`, request.url)
  )
  const { round_id: currentRoundId } = await currentRoundIdResponse.json()

  const allRoundIds = range(0, currentRoundId + 1)

  const roundData = await Promise.all(
    allRoundIds.map(async (round_id) => {
      return await fetch(
        new URL(`${urlPrefix}/build_round_data/${round_id}`, request.url)
      ).then((res) => res.json())
    })
  )

  return Response.json(roundData)
}
