"use server"

import { range } from "lodash"
import { getHydroQueryClient } from "../../contract-apis/getClient"
import { RawHydroRoundData } from "../../contract-apis/types"
import { fetchRoundBids } from "./../mergedFetchers/fetchRoundBids"
import { fetchRoundLockups } from "./../mergedFetchers/fetchRoundLockups"
import { fetchRoundTributes } from "./../mergedFetchers/fetchRoundTributes"

export async function fetchHydroRoundsData(): Promise<RawHydroRoundData[]> {
  const hydroQueryClient = await getHydroQueryClient()

  // Fetch Rounds & Tranches data to iterate over
  const { round_end, round_id } = await hydroQueryClient.currentRound()
  const { tranches } = await hydroQueryClient.tranches()

  // Generate all possible rounds & tranches
  const allRoundIds = range(0, round_id + 1)
  const allTrancheIds = tranches.map((tranche) => tranche.id)

  // Fetch all data for each round
  const roundRawData = await Promise.all(
    allRoundIds.map(async (evaluatedRoundId) => {
      // Fetch tributes and lockups for the evaluated round
      const roundTributes = await fetchRoundTributes(evaluatedRoundId, round_id)
      const roundLockups = await fetchRoundLockups(evaluatedRoundId, round_id)

      // Fetch bids for each tranche in the evaluated round
      const roundBids = (
        await Promise.all(
          allTrancheIds.map(async (tranche_id) => {
            return await fetchRoundBids(evaluatedRoundId, tranche_id, round_id)
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

  return roundRawData
}
