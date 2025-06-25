import { getHydroQueryClient } from '@/app/api/v2/_helpers/getHydroQueryClient'
import { getTributeQueryClient } from '@/app/api/v2/_helpers/getTributeQueryClient'
import { Tranche } from '@/app/ts_types/HydroBase.types'
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
  const { hydroContract, tributeContract } = sourceObject

  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return Response.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    )
  }

  try {
    const urlPrefix = `/api/v2/${environment}/${source_id}`
    const [currentRoundResponse, tranchesResponse] = await Promise.all([
      fetch(new URL(`${urlPrefix}/current_round`, request.url)),
      fetch(new URL(`${urlPrefix}/tranches`, request.url)),
    ])

    if (!currentRoundResponse.ok || !tranchesResponse.ok) {
      throw new Error('Failed to fetch round or tranche data')
    }

    const { round_id: currentRoundId } = await currentRoundResponse.json()
    const tranches = (await tranchesResponse.json()) as Tranche[]

    const hydroQueryClient = await getHydroQueryClient({ hydroContract })
    const tributeQueryClient = await getTributeQueryClient({ tributeContract })

    const trancheIds = tranches.map((tranche: Tranche) => tranche.id)

    // Fetch basic user data first
    const [votingPowerResult, lockupsResult] = await Promise.all([
      hydroQueryClient
        .userVotingPower({ address })
        .catch(() => ({ voting_power: 0 })),
      hydroQueryClient
        .allUserLockupsWithTrancheInfos({
          address,
          limit: 10_000,
          startFrom: 0,
        })
        .catch(() => ({ lockups_with_per_tranche_infos: [] })),
    ])

    const { voting_power } = votingPowerResult
    const { lockups_with_per_tranche_infos } = lockupsResult

    // Only fetch votes and claims if user has voting power
    let votes: any[] = []
    let outstanding_tribute_claims: any[] = []

    if (voting_power > 0) {
      const currentRoundTrancheIdPairs = trancheIds.map((trancheId) => ({
        roundId: currentRoundId,
        trancheId
      }))

      // Process tranches in smaller batches to avoid overwhelming the RPC
      const batchSize = 2
      const votesAndClaims = []

      for (let i = 0; i < currentRoundTrancheIdPairs.length; i += batchSize) {
        const batch = currentRoundTrancheIdPairs.slice(i, i + batchSize)

        const batchResults = await Promise.all(
          batch.map(async ({ roundId, trancheId }) => {
            const [votesResult, claimsResult] = await Promise.all([
              hydroQueryClient
                .userVotes({
                  address,
                  roundId,
                  trancheId,
                })
                .catch(() => ({ votes: [] })),
              tributeQueryClient
                .outstandingTributeClaims({
                  limit: 100,
                  roundId,
                  startFrom: 0,
                  trancheId,
                  userAddress: address,
                })
                .catch(() => ({ claims: [] })),
            ])
            return { votes: votesResult.votes, claims: claimsResult.claims }
          })
        )

        votesAndClaims.push(...batchResults)
      }

      votes = votesAndClaims.flatMap((o) => o.votes)
      outstanding_tribute_claims = votesAndClaims.flatMap((o) => o.claims)
    }

    const responseData = {
      voting_power,
      lockups_with_per_tranche_infos,
      votes,
      outstanding_tribute_claims,
      historical_tribute_claims: [],
    }

    return Response.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error fetching wallet data:', error)
    return Response.json(
      { error: 'Failed to fetch wallet data' },
      { status: 500 }
    )
  }
}
