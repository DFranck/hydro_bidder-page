import { augmentBidBeforeWallet } from "@/contract-apis/augmentBidBeforeWallet"
import { augmentNumiaBids } from "@/contract-apis/augmentNumiaBids"
import {
  AugmentedBackendDataBeforeWallet,
  BackendDataBeforeWalletSlimmed,
  GlobalLockupCapacityInfo,
} from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import groupBy from "lodash/groupBy"
import keyBy from "lodash/keyBy"
import mapValues from "lodash/mapValues"
import sumBy from "lodash/sumBy"
import { augmentRoundDeploymentMetrics } from "./testingFiles/augmentRoundDeploymentMetrics"

export function augmentBackendDataBeforeWallet(
  rawBackendDataBeforeWallet: BackendDataBeforeWalletSlimmed
): AugmentedBackendDataBeforeWallet {
  // Extract data
  const { hydroMetaData, hydroRoundData, externalData } =
    rawBackendDataBeforeWallet

  const { constants, round_end, round_id, total_locked_tokens, tranches } =
    hydroMetaData

  const { assetListWithPrices, bidMetaDataById, numiaBids, numiaMetrics } =
    externalData

  const hydroRoundsData = hydroRoundData

  const proposals = hydroRoundsData.flatMap((round) => round.round_bids)

  // Aux Fields
  const atomPrice =
    assetListWithPrices[
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
    ]?.priceUsd ?? 0
  const currentRoundEndDate = new Date(Number(round_end) / 1e6)
  const currentRoundId = round_id

  // Hydro Capacity Info

  const lockedAtomMaxGlobal = constants.max_locked_tokens / 1e6
  const lockedAtomTotalGlobal = total_locked_tokens / 1e6
  const lockedAtomRemainingCapacityGlobal = Number(
    (lockedAtomMaxGlobal - lockedAtomTotalGlobal).toFixed(6)
  )
  const lockedAtomPercentageGlobal = Math.floor(
    (lockedAtomTotalGlobal / lockedAtomMaxGlobal) * 100
  )
  const lockedAtomIsAtCapacityGlobal = lockedAtomPercentageGlobal === 100

  const globalLockupCapacityInfo: GlobalLockupCapacityInfo = {
    lockedAtomMaxGlobal,
    lockedAtomTotalGlobal,
    lockedAtomRemainingCapacityGlobal,
    lockedAtomIsAtCapacityGlobal,
    lockedAtomPercentageGlobal,
  }

  // Legacy Info
  const totalPowerByRoundId = mapValues(
    groupBy(proposals, "round_id"),
    (roundProposals) => sumBy(roundProposals, (o) => Number(o.power))
  )

  const augmentedBidsBeforeWallet = proposals.map((proposal) =>
    augmentBidBeforeWallet({
      atomPrice,
      bid: proposal,
      rawBackendDataBeforeWallet,
      totalPowerByRoundId,
    })
  )
  const { postHydroBids, preHydroBids } = augmentNumiaBids(numiaBids)

  // New Bids Info
  const bidsInfo = hydroRoundsData
    .map(
      ({
        round_id,
        round_bids,
        round_lockups,
        round_tributes,
        round_prices,
      }) => {
        const roundParsedBids = augmentRoundDeploymentMetrics(
          round_id,
          round_bids,
          round_lockups,
          round_tributes,
          round_id === currentRoundId
            ? mapValues(assetListWithPrices, (a) => ({
                token_symbol: a.symbol,
                token_exponent: a.decimals,
                token_price: a.priceUsd,
              }))
            : round_prices,
          bidMetaDataById,
          currentRoundId
        )
        return roundParsedBids
      }
    )
    .flat()

  return {
    assetListWithPrices,
    atomPrice,
    bidMetaDataById,
    bidsInfo: keyBy(bidsInfo, "id"),
    bidsById: keyBy(augmentedBidsBeforeWallet, "id"),
    currentRoundEndDate,
    currentRoundId: round_id,
    currentRoundIsPilot: true,
    lockedAtomEpochInNanos: constants.lock_epoch_length,
    lockedAtomMaxWallet: 250, // TODO: get this from contract
    metricsForPostHydroBids: postHydroBids,
    metricsForPreHydroBids: preHydroBids,
    metricsGlobal: keysFromSnakeToCamelCase(numiaMetrics),
    minTributeFactor: 0.0001, // TODO: get this from contract
    tranches,
    ...globalLockupCapacityInfo,
  }
}
