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
    tranches,
    liquidity_deployments,
    total_locked_tokens,
  } = hydroMetaData

  const { bidMetaDataById, numiaBids, numiaMetrics } = externalData

  const hydroRoundsData = hydroRoundData
  const currentRoundId = round_id

  // Aux Fields
  const currentRoundEndDate = new Date(Number(round_end) / 1e6)

  // Legacy Info
  const { postHydroBids, preHydroBids } = augmentNumiaBids(numiaBids)

  // Hydro Capacity Info
  const lockedTokenMaxGlobal = constants.max_locked_tokens / 1e6
  const lockedTokenTotalGlobal = total_locked_tokens ?? 0 / 1e6
  const lockedTokenRemainingCapacityGlobal = Number(
    (lockedTokenMaxGlobal - lockedTokenTotalGlobal).toFixed(6)
  )
  const lockedTokenPercentageGlobal = Math.floor(
    (lockedTokenTotalGlobal / lockedTokenMaxGlobal) * 100
  )
  const lockedTokenIsAtCapacityGlobal = lockedTokenPercentageGlobal === 100

  const globalLockupCapacityInfo: GlobalLockupCapacityInfo = {
    lockedTokenMaxGlobal,
    lockedTokenTotalGlobal,
    lockedTokenRemainingCapacityGlobal,
    lockedTokenIsAtCapacityGlobal,
    lockedTokenPercentageGlobal,
  }

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

  const dAtomPrice =
    hydroRoundsData[round_id]?.round_prices[
      "ibc/factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom"
    ]?.token_price ?? 0

  const stAtomPrice =
    hydroRoundsData[round_id]?.round_prices[
      "ibc/B7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C"
    ]?.token_price ?? 0

  return {
    currentRoundPrices: hydroRoundsData[round_id]?.round_prices,
    atomPrice,
    dAtomPrice,
    stAtomPrice,
    bidMetaDataById,
    bidsInfo: keyBy(bidsInfo, "id"),
    currentRoundEndDate,
    currentRoundId: round_id,
    currentRoundIsPilot: true,
    lockedTokenEpochInNanos: constants.lock_epoch_length,
    lockedTokenMaxWallet: 250, // TODO: get this from contract
    metricsForPostHydroBids: postHydroBids,
    metricsForPreHydroBids: preHydroBids,
    metricsGlobal: keysFromSnakeToCamelCase(numiaMetrics),
    minTributeFactor: 0.0001, // TODO: get this from contract
    tranches,
    ...globalLockupCapacityInfo,
  }
}
