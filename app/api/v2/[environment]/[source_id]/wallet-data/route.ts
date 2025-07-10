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
      { error: 'address parameter is required for wallet-data operation' },
      { status: 400 }
    )
  }

  try {
    const hydroQueryClient = await getHydroQueryClient({ hydroContract })
    const [currentRoundResult, tranchesResult] = await Promise.all([
      hydroQueryClient.currentRound(),
      hydroQueryClient.tranches(),
    ])

    const { round_id: currentRoundId } = currentRoundResult
    const { tranches } = tranchesResult

    const tributeQueryClient = await getTributeQueryClient({ tributeContract })
    const trancheIds = (Array.isArray(tranches) ? tranches : []).map((tranche: Tranche) => tranche.id)

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

    let votes: any[] = []
    let outstanding_tribute_claims: any[] = []

    if (voting_power > 0) {
      const currentRoundTrancheIdPairs = trancheIds.map((trancheId) => ({
        roundId: currentRoundId,
        trancheId
      }))

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
                  roundId,
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
    console.error('Error in wallet-data operation:', error)
    return Response.json(
      { error: 'Failed to execute wallet-data operation' },
      { status: 500 }
    )
  }
}
