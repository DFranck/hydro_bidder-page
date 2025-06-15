import { getHydroQueryClient } from "@/app/api/v2/_helpers/getHydroQueryClient"
import { Environment, getSource, SourceID } from "@v2/environments"

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

  const hydroQueryClient = await getHydroQueryClient({
    hydroContract,
  })

  const { total_locked_tokens } = await hydroQueryClient.totalLockedTokens()

  return Response.json(total_locked_tokens)
}
