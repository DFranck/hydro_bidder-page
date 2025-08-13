// getNextStateAfterWalletRefetch.ts

import { getMarketplaceLockups } from "@/app/(with-backend-data)/lockups/marketplace/utils/getMarketplaceLockups"
import { mergeWithOverwrite } from "@/lib/mergeWithOverwrite"
import { augmentBackendDataAfterWallet } from "./augmentBackendDataAfterWallet"
import { AugmentedBackendDataAfterWallet, BackendDataTweak } from "./types"

export function getNextStateAfterWalletRefetch({
  loadedTweaks,
  previousState,
  walletData,
  lockedTokenRemainingCapacityGlobal
}: {
  loadedTweaks: BackendDataTweak[]
  previousState: AugmentedBackendDataAfterWallet
  walletData: any
  lockedTokenRemainingCapacityGlobal: number
}): Partial<AugmentedBackendDataAfterWallet> {
  const enabledTweaks: BackendDataTweak["json"] = mergeWithOverwrite(
    {},
    ...loadedTweaks
      .filter((tweak) => !tweak.disabled)
      .map((tweak) => tweak.json),
  )
  const { patchData = {}, walletData: walletDataTweaks } = enabledTweaks

  const tweakedWalletData = mergeWithOverwrite(
    {},
    walletData,
    walletDataTweaks ?? {},
  )
  const augmented = augmentBackendDataAfterWallet({
    address: previousState.address,
    augmentedBackendDataBeforeWallet: previousState,
    walletData: tweakedWalletData,
    lockedTokenRemainingCapacityGlobal
  })
  const patchedAugmented = mergeWithOverwrite({}, augmented, patchData)

  const marketplaceLockups = getMarketplaceLockups(
    patchedAugmented.lockups,
    walletData.listings,
  )

  return {
    ...patchedAugmented,
    marketplaceLockups,
  }
}
