import { Environment, getSource, SourceID } from '@v2/environments'

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
  const { hydroContract, tributeContract } = sourceObject

  return Response.json(
    { error: 'This endpoint has been deprecated. Please use the specific operation endpoints: /constants, /current-round, /tranches, /total-locked-tokens, /wallet-data' },
    { status: 410 }
  )
}
