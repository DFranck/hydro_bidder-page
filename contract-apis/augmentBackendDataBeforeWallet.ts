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

export function augmentBackendDataBeforeWallet(
  rawBackendDataBeforeWallet: BackendDataBeforeWalletSlimmed
): AugmentedBackendDataBeforeWallet {
  const { hydroData, externalData } = rawBackendDataBeforeWallet

  const {
    constants,
    proposals,
    round_end,
    round_id,
    total_locked_tokens,
    tranches,
  } = hydroData

  const { assetListWithPrices, bidMetaDataById, numiaBids, numiaMetrics } =
    externalData

  const atomPrice =
    assetListWithPrices[
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
    ]?.priceUsd ?? 0

  const currentRoundEndDate = new Date(Number(round_end) / 1e6)

  // Capacity info
  const lockedUatomMaxGlobal = constants.max_locked_tokens
  const lockedUatomTotalGlobal = total_locked_tokens
  const lockedAtomMaxGlobal = lockedUatomMaxGlobal / 1e6
  const lockedAtomTotalGlobal = lockedUatomTotalGlobal / 1e6
  const lockedAtomRemainingCapacityGlobal = Number(
    (lockedAtomMaxGlobal - lockedAtomTotalGlobal).toFixed(6)
  )
  const lockedAtomPercentageGlobal = Math.floor(
    (lockedAtomTotalGlobal / lockedAtomMaxGlobal) * 100
  )
  const lockedAtomIsAtCapacityGlobal = lockedAtomPercentageGlobal === 100
  const globalLockupCapacityInfo: GlobalLockupCapacityInfo = {
    lockedAtomIsAtCapacityGlobal,
    lockedAtomMaxGlobal,
    lockedAtomPercentageGlobal,
    lockedAtomRemainingCapacityGlobal,
    lockedAtomTotalGlobal,
  }

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

  return {
    assetListWithPrices,
    atomPrice,
    bidMetaDataById,
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
