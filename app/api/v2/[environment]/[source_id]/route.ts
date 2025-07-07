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
  const cacheDuration = sourceObject.cacheDuration
  const { hydroContract, tributeContract } = sourceObject

  const { searchParams } = new URL(request.url)
  const operation = searchParams.get('operation')

  if (!operation) {
    return Response.json(
      { error: 'operation parameter is required. Available: constants, current_round, tranches, total_locked_tokens, wallet_data' },
      { status: 400 }
    )
  }

  try {
    switch (operation) {
      case 'constants': {
        const hydroQueryClient = await getHydroQueryClient({ hydroContract })
        const { constants } = await hydroQueryClient.constants()

        return Response.json(constants, {
          headers: {
            'Cache-Control': `public, s-maxage=${cacheDuration}, stale-while-revalidate=${cacheDuration * 2}`,
          },
        })
      }

      case 'current_round': {
        const hydroQueryClient = await getHydroQueryClient({ hydroContract })
        const { round_id, round_end } = await hydroQueryClient.currentRound()

        return Response.json({ round_id: 7, round_end }, {
          headers: {
            'Cache-Control': `public, s-maxage=${cacheDuration}, stale-while-revalidate=${cacheDuration * 2}`,
          },
        })
      }

      case 'tranches': {
        const hydroQueryClient = await getHydroQueryClient({ hydroContract })
        const { tranches } = await hydroQueryClient.tranches()

        return Response.json(tranches, {
          headers: {
            'Cache-Control': `public, s-maxage=${cacheDuration}, stale-while-revalidate=${cacheDuration * 2}`,
          },
        })
      }

      case 'total_locked_tokens': {
        const hydroQueryClient = await getHydroQueryClient({ hydroContract })
        const { total_locked_tokens } = await hydroQueryClient.totalLockedTokens()

        return Response.json(total_locked_tokens, {
          headers: {
            'Cache-Control': `public, s-maxage=${cacheDuration}, stale-while-revalidate=${cacheDuration * 2}`,
          },
        })
      }

      case 'wallet_data': {
        const address = searchParams.get('address')

        if (!address) {
          return Response.json(
            { error: 'address parameter is required for wallet_data operation' },
            { status: 400 }
          )
        }

        const hydroQueryClient = await getHydroQueryClient({ hydroContract })
        const [currentRoundResult, tranchesResult] = await Promise.all([
          hydroQueryClient.currentRound(),
          hydroQueryClient.tranches(),
        ])

        const { round_id: currentRoundId } = currentRoundResult
        const { tranches } = tranchesResult

        const tributeQueryClient = await getTributeQueryClient({ tributeContract })
        const trancheIds = tranches.map((tranche: Tranche) => tranche.id)

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
      }

      default:
        return Response.json(
          { error: `Unknown operation: ${operation}. Available: constants, current_round, tranches, total_locked_tokens, wallet_data` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error(`Error in ${operation} operation:`, error)
    return Response.json(
      { error: `Failed to execute ${operation} operation` },
      { status: 500 }
    )
  }
}
