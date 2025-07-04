import { getHydroQueryClient } from "../../../contract-apis/getClient"
import { RawHydroRoundData } from "../../../contract-apis/types"
import { fetchRoundBids } from "./fetchRoundBids"
import { fetchRoundLockups } from "./fetchRoundLockups"
import { fetchRoundPrices } from "./fetchRoundPrices"
import { fetchRoundTributes } from "./fetchRoundTributes"

export async function fetchHydroRoundsData(): Promise<RawHydroRoundData[]> {
  const hydroQueryClient = await getHydroQueryClient()

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
      })
      const roundLockups = await fetchRoundLockups({
        roundId: evaluatedRoundId,
        currentRoundId: round_id,
      })
      const roundPrices = await fetchRoundPrices({
        roundId: evaluatedRoundId,
      })

      // Fetch bids for each tranche in the evaluated round
      const roundBids = (
        await Promise.all(
          allTrancheIds.map(async (tranche_id) => {
            return await fetchRoundBids({
              roundId: evaluatedRoundId,
              trancheId: tranche_id,
              currentRoundId: round_id,
            })
          }),
        )
      ).flat()

      return {
        round_id: evaluatedRoundId,
        round_bids: roundBids,
        round_lockups: roundLockups,
        round_tributes: roundTributes,
        round_prices: roundPrices,
      }
    }),
  )

  return rawRoundData
}
