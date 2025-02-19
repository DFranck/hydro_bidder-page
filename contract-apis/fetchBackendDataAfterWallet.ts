"use server"

import { unstable_cache } from "next/cache"
import { fetchWalletData } from "./api/fetchWalletData"
import { processBackendDataAfterWallet } from "./processors/processBackendDataAfterWallet"
import { BackendDataBeforeWallet } from "./types"

async function uncachedFetchBackendDataAfterWallet({
  address,
  backendDataBeforeWallet,
}: {
  address: string
  backendDataBeforeWallet: BackendDataBeforeWallet
}) {
  const walletData = await fetchWalletData({
    address,
    currentRoundId: backendDataBeforeWallet.currentRoundId,
    tranches: backendDataBeforeWallet.tranches,
  })

  return processBackendDataAfterWallet({
    address,
    backendDataBeforeWallet,
    walletData,
  })
}

export const fetchBackendDataAfterWallet = unstable_cache(
  uncachedFetchBackendDataAfterWallet,
  ["fetchBackendDataAfterWallet"],
  {
    revalidate: 60 * 5,
    tags: ["backendData"],
  }
)
