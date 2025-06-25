import { augmentNumiaBids } from "@/contract-apis/augmentNumiaBids"
import {
  AugmentedBackendDataBeforeWallet,
  BackendDataBeforeWalletSlimmed,
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

  const { constants, round_end, round_id, tranches, liquidity_deployments } =
    hydroMetaData

  const { bidMetaDataById, numiaBids, numiaMetrics } = externalData

  const hydroRoundsData = hydroRoundData
  const currentRoundId = round_id

  // Aux Fields
  const currentRoundEndDate = new Date(Number(round_end) / 1e6)

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
    currentRoundPrices: hydroRoundsData[round_id]?.round_prices,
    atomPrice,
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
  }
}
