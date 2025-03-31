import { augmentNumiaBids } from "@/contract-apis/augmentNumiaBids"
import {
  AugmentedBackendDataBeforeWallet,
  BackendDataBeforeWalletSlimmed,
  GlobalLockupCapacityInfo,
} from "@/contract-apis/types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import keyBy from "lodash/keyBy"
import { augmentRoundDeploymentMetrics } from "./testingFiles/augmentRoundDeploymentMetrics"

export function augmentBackendDataBeforeWallet(
  rawBackendDataBeforeWallet: BackendDataBeforeWalletSlimmed
): AugmentedBackendDataBeforeWallet {
  // Extract data
  const { hydroMetaData, hydroRoundData, externalData } =
    rawBackendDataBeforeWallet

  const {
    constants,
    round_end,
    round_id,
    total_locked_tokens,
    tranches,
    liquidity_deployments,
  } = hydroMetaData

  const { assetListWithPrices, bidMetaDataById, numiaBids, numiaMetrics } =
    externalData

  const hydroRoundsData = hydroRoundData
  const currentRoundId = round_id

  // Aux Fields
  const currentRoundEndDate = new Date(Number(round_end) / 1e6)

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
          round_prices,
          bidMetaDataById,
          currentRoundId,
          liquidity_deployments
        )
        return roundParsedBids
      }
    )
    .flat()

  const atomPrice =
    hydroRoundsData[round_id]?.round_prices[
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
    ]?.token_price ?? 0

  return {
    assetListWithPrices,
    atomPrice,
    bidMetaDataById,
    bidsInfo: keyBy(bidsInfo, "id"),
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
