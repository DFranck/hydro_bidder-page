import { getHydroQueryClient } from "@/contract-apis/getClient"
import { RawHydroRoundData } from "@/contract-apis/types"
import { fetchRoundBids } from "@/functions/build-hydro-round-data-in-background/_fetchers/fetchRoundBids"
import { fetchRoundLockups } from "@/functions/build-hydro-round-data-in-background/_fetchers/fetchRoundLockups"
import { fetchRoundTributes } from "@/functions/build-hydro-round-data-in-background/_fetchers/fetchRoundTributes"

export async function fetchHydroRoundsData({
  hydroContractAddress,
  numiaCosmosHydroAppApiKey,
  numiaBidsEndpoint,
  numiaTributesEndpoint,
  numiaLockupsEndpoint,
  tributeContractAddress,
}: {
  hydroContractAddress: string
  numiaCosmosHydroAppApiKey: string
  numiaBidsEndpoint: string
  numiaTributesEndpoint: string
  numiaLockupsEndpoint: string
  tributeContractAddress: string
}): Promise<RawHydroRoundData[]> {
  const hydroQueryClient = await getHydroQueryClient({
    hydroContractAddress,
    numiaCosmosHydroAppApiKey,
  })

  // Fetch Rounds & Tranches data to iterate over
  const { round_end, round_id } = await hydroQueryClient.currentRound()

  const { tranches } = await hydroQueryClient.tranches()

  // Generate all possible rounds & tranches
  const allRoundIds = Array.from({ length: round_id + 1 }, (_, i) => i)
  const allTrancheIds = tranches.map((tranche) => tranche.id)

  // Fetch all data for each round
  const rawRoundData = await Promise.all(
    allRoundIds.map(async (evaluatedRoundId) => {
      // Fetch tributes and lockups for the evaluated round
      const roundTributes = await fetchRoundTributes({
        roundId: evaluatedRoundId,
        currentRoundId: round_id,
        numiaTributesEndpoint,
        numiaCosmosHydroAppApiKey,
        tributeContractAddress,
      })
      const roundLockups = await fetchRoundLockups({
        roundId: evaluatedRoundId,
        currentRoundId: round_id,
        numiaCosmosHydroAppApiKey,
        numiaLockupsEndpoint,
        hydroContractAddress,
      })

      // Fetch bids for each tranche in the evaluated round
      const roundBids = (
        await Promise.all(
          allTrancheIds.map(async (tranche_id) => {
            return await fetchRoundBids({
              roundId: evaluatedRoundId,
              trancheId: tranche_id,
              currentRoundId: round_id,
              hydroContractAddress,
              numiaBidsEndpoint,
              numiaCosmosHydroAppApiKey,
            })
          })
        )
      ).flat()

      return {
        round_id: evaluatedRoundId,
        round_bids: roundBids,
        round_lockups: roundLockups,
        round_tributes: roundTributes,
      }
    })
  )

  return rawRoundData
}
