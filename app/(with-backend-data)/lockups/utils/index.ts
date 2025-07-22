import { AugmentedLockup } from "@/contract-apis/types"

const NFT_SIZES = [25, 50, 100, 200, 500, 1000]

export function findLockupsForNFT(
  NFT_SIZE: number,
  denom: string,
  lockups: AugmentedLockup[]
) {
  // Filter lockups by the specified denomination and exclude NFT_SIZES amounts
  const filteredLockups = lockups.filter(
    (lockup) =>
      lockup.funds.denom === denom && !NFT_SIZES.includes(lockup.funds.amount)
  )

  // Handle edge case - no lockups found
  if (filteredLockups.length === 0) {
    return {
      selectedLockups: [],
      selectedLockupsCount: 0,
      totalAmount: 0,
      remainder: 0,
      totalLockupSelected: 0,
      demon: denom,
    }
  }

  // Sort by funds.amount in descending order (biggest first)
  const sortedLockups = filteredLockups.sort(
    (a, b) => b.funds.amount - a.funds.amount
  )

  // Find the minimum combination of lockups that meets or exceeds NFT_SIZE
  let totalAmount = 0
  let selectedLockups = []

  for (let i = 0; i < sortedLockups.length; i++) {
    const lockup = sortedLockups[i]
    selectedLockups.push(lockup)
    totalAmount += lockup.funds.amount

    // If we've met or exceeded the NFT_SIZE + 0.01, we can stop
    if (totalAmount >= NFT_SIZE + 0.01) {
      break
    }
  }

  // Return empty result if requirement is not met (needs NFT_SIZE + 0.01)
  if (totalAmount < NFT_SIZE + 0.01) {
    return {
      selectedLockups: [],
      selectedLockupsCount: 0,
      totalAmount: 0,
      remainder: 0,
      totalLockupSelected: 0,
      demon: denom,
    }
  }

  // Return the result with all requested properties
  return {
    selectedLockups,
    selectedLockupsCount: selectedLockups.length,
    totalAmount,
    remainder: totalAmount - NFT_SIZE,
    totalLockupSelected: totalAmount,
    demon: denom,
  }
}
