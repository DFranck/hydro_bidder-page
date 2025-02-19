import { fetchExternalData } from "@/contract-apis/api/fetchExternalData"
import { fetchHydroData } from "@/contract-apis/api/fetchHydroData"
import { fetchBidsBeforeWallet } from "@/contract-apis/fetchBidsBeforeWallet"
import { BackendDataBeforeWallet } from "@/contract-apis/types"
import keyBy from "lodash/keyBy"

export async function processBackendDataBeforeWallet({
  hydroData,
  externalData,
}: {
  hydroData: Awaited<ReturnType<typeof fetchHydroData>>
  externalData: Awaited<ReturnType<typeof fetchExternalData>>
}): Promise<BackendDataBeforeWallet> {
  const { constants, currentRound, tranches, roundEnd } = hydroData
  const {
    assetListWithPrices,
    numiaData,
    bidDescriptionsByBidId,
    metrics,
    globalLockupCapacityInfo,
  } = externalData

  const atomPrice =
    assetListWithPrices[
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
    ]?.priceUsd ?? 0

  const currentRoundEndDate = new Date(Number(roundEnd) / 1e6)

  const bids = await fetchBidsBeforeWallet({
    assetListWithPrices,
    atomPrice,
    bidDescriptionsByBidId,
    currentRoundId: currentRound.round_id,
    lockedAtomEpochInNanos: constants.lock_epoch_length,
    postHydroBids: numiaData.postHydroBids,
    tranches,
  })

  return {
    assetListWithPrices,
    atomPrice,
    bidDescriptionsByBidId,
    bidsById: keyBy(bids, "id"),
    currentRoundEndDate,
    currentRoundId: currentRound.round_id,
    currentRoundIsPilot: true,
    lockedAtomEpochInNanos: constants.lock_epoch_length,
    lockedAtomMaxWallet: 250, // TODO: get this from contract
    metricsForPostHydroBids: numiaData.postHydroBids,
    metricsForPreHydroBids: numiaData.preHydroBids,
    metricsGlobal: metrics,
    minTributeFactor: 0.0001, // TODO: get this from contract
    tranches,
    ...globalLockupCapacityInfo,
  }
}
