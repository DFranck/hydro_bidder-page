import { Environment, getSource, SourceID } from "@/app/(v2)/v2/environments"
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

  const sourceObject = getSource(environment, source_id)

  const { hydroContract } = sourceObject

  // Fetch Rounds & Tranches data to iterate over
  const currentRoundIdResponse = await fetch(
    new URL(`/api/v2/current_round/${hydroContract}`, request.url)
  )
  const { round_id: currentRoundId } = await currentRoundIdResponse.json()

  const allRoundIds = range(0, currentRoundId + 1)

  const roundData = await Promise.all(
    allRoundIds.map(async (round_id) => {
      return await fetch(
        new URL(`/api/v2/round_data/${hydroContract}/${round_id}`, request.url)
      ).then((res) => res.json())
    })
  )

  return Response.json(roundData)
}
