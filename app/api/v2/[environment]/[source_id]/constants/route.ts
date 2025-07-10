import { getHydroQueryClient } from '@/app/api/v2/_helpers/getHydroQueryClient'
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
  const { hydroContract } = sourceObject

  try {
    const hydroQueryClient = await getHydroQueryClient({ hydroContract })
    const { constants } = await hydroQueryClient.constants()

    return Response.json(constants, {
      headers: {
        'Cache-Control': `public, s-maxage=${cacheDuration}, stale-while-revalidate=${cacheDuration * 2}`,
      },
    })
  } catch (error) {
    console.error('Error in constants operation:', error)
    return Response.json(
      { error: 'Failed to execute constants operation' },
      { status: 500 }
    )
  }
}
