import { getHydroQueryClient } from '@/app/api/v2/_helpers/getHydroQueryClient'
import { getTributeQueryClient } from '@/app/api/v2/_helpers/getTributeQueryClient'
import { Tranche } from '@/app/ts_types/HydroBase.types'
import { Environment, getSource, SourceID } from '@v2/environments'
import range from 'lodash/range'

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

  // Get address from query params
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return Response.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    )
  }

  // Get current round and tranches for context
  const urlPrefix = `/api/v2/${environment}/${source_id}`
  const [currentRoundResponse, tranchesResponse] = await Promise.all([
    fetch(new URL(`${urlPrefix}/current_round`, request.url)),
    fetch(new URL(`${urlPrefix}/tranches`, request.url)),
  ])

  const { round_id: currentRoundId } = await currentRoundResponse.json()
  const tranches = (await tranchesResponse.json()) as Tranche[]

  // Initialize query clients
  const hydroQueryClient = await getHydroQueryClient({ hydroContract })
  const tributeQueryClient = await getTributeQueryClient({ tributeContract })

  const allRoundIds = range(0, currentRoundId + 1)
  const trancheIds = tranches.map((tranche: Tranche) => tranche.id)
  const allRoundTrancheIdPairs = allRoundIds.flatMap((roundId) =>
    trancheIds.map((trancheId) => ({ roundId, trancheId }))
  )

  // Fetch basic wallet data
  const [
    { voting_power },
    { lockups_with_per_tranche_infos },
    { claims: historical_tribute_claims },
  ] = await Promise.all([
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
    tributeQueryClient
      .historicalTributeClaims({
        limit: 100,
        startFrom: 0,
        userAddress: address,
      })
      .catch(() => ({ claims: [] })),
  ])

  // Fetch votes and claims for all round-tranche combinations
  const votesAndClaims = await Promise.all(
    allRoundTrancheIdPairs.map(async ({ roundId, trancheId }) => {
      const [{ votes }, { claims }] = await Promise.all([
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
      return { votes, claims }
    })
  )

  const votes = votesAndClaims.flatMap((o) => o.votes)
  const outstanding_tribute_claims = votesAndClaims.flatMap((o) => o.claims)

  return Response.json({
    voting_power,
    lockups_with_per_tranche_infos,
    votes,
    outstanding_tribute_claims,
    historical_tribute_claims,
  })
}
