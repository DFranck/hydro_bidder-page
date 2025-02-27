"use server"

import {
  getHydroQueryClient,
  getTributeQueryClient,
} from "../../contract-apis/getClient"
import { RawHydroData } from "../../contract-apis/types"
import {range} from "lodash"
import { fetchRoundTributes } from "./../mergedFetchers/fetchRoundTributes"
import { fetchRoundLockups } from "./../mergedFetchers/fetchRoundLockups"
import { fetchRoundBids } from "./../mergedFetchers/fetchRoundBids"
import { Proposal } from "../../app/ts_types/HydroBase.types"
import { calculateRoundDeploymentMetrics } from "./../testingFiles/calculateRoundDeploymentMetrics"
import { hydroPrices } from "./../auxFiles/hydro_prices"
import { fetchBidDescriptionsById } from "../mergedFetchers/fetchBidDescriptions"

export async function fetchBidsData(): Promise<RawHydroData> {
  const hydroQueryClient   = await getHydroQueryClient()

  const [
    { constants },
    { round_end, round_id },
    { tranches },
    { total_locked_tokens },
    bidDescriptions
  ] = await Promise.all([
    hydroQueryClient.constants(),
    hydroQueryClient.currentRound(),
    hydroQueryClient.tranches(),
    hydroQueryClient.totalLockedTokens(),
    fetchBidDescriptionsById()
  ])

  const allRoundIds = range(0, round_id + 1)

  const proposals = (await Promise.all(allRoundIds.map(async (evaluatedRoundId) => {
  
    console.log('Fetching proposal tributes...');
    const roundTributes = await fetchRoundTributes(evaluatedRoundId, round_id);
    //console.log('Round Tributes:', roundTributes);
  
    console.log("Fetching proposal lockups...")
    const roundLockups = await fetchRoundLockups(evaluatedRoundId, round_id)
    //console.log("Round lockups:", roundLockups)
  
    console.log("Fetching proposal bids...")
    const roundBids = (await Promise.all(tranches.map(async (tranche) => {
        return await fetchRoundBids(evaluatedRoundId, tranche.id, round_id);
    }))).flat() as Proposal[]
    //console.log("Round bids:", roundBids)
  
    return calculateRoundDeploymentMetrics(evaluatedRoundId, roundBids, roundLockups, roundTributes, hydroPrices, bidDescriptions, round_id)
  }))).flat()

  console.log(proposals)

  return {
    constants,
    liquidity_deployments: [],
    proposals: [],
    round_end,
    round_id,
    total_locked_tokens,
    tranches,
    tributes: []
  }
}
