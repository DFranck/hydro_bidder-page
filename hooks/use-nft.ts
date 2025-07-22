import { useQuery } from "@tanstack/react-query"
import { AugmentedLockup } from "@/contract-apis/types"
import { NFT_SIZES } from "@/app/(with-backend-data)/lockups/config"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useChain } from "@cosmos-kit/react"
import { executeWalletSimulateLockup } from "@/contract-apis/executeWalletSimulateLockup"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

interface LockupsResult {
  selectedLockups: VirtualLockup[]
  selectedLockupsCount: number
  totalAmount: number
  remainder: number
  totalLockupSelected: number
  demon: string
  hasVirtualLockups: boolean
  hasMultipleDenoms: boolean
  sharedDenomCount: number
  virtualLockupsCount: number
  virtualLockups: VirtualLockup[]
  hasMatchingDenoms: boolean
  hasDenomCombination?: boolean
}

interface SimulatedLockup {
  lock_id: number
  dtoken_amount: string
}

interface VirtualLockup extends AugmentedLockup {
  isVirtual?: boolean
  originalAmount?: number
}

export function findLSTLockupsForNFT(
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
    if (totalAmount >= NFT_SIZE) {
      break
    }
  }

  // Return empty result if requirement is not met (needs NFT_SIZE + 0.01)
  if (totalAmount < NFT_SIZE) {
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

export function useFindLockupsForNFTQuery(
  NFT_SIZE: number,
  denom: string,
  lockups: AugmentedLockup[]
) {
  const { address } = useBackendData()
  const { getSigningCosmWasmClient } = useChain("neutron")
  return useQuery({
    queryKey: ["findLockupsForNFtSizes", NFT_SIZE, denom],
    queryFn: async () => {
      return findLockupsForNFtSizes(
        NFT_SIZE,
        denom,
        lockups,
        getSigningCosmWasmClient,
        address
      )
    },
    enabled: !!NFT_SIZE && !!denom,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export async function findLockupsForNFtSizes(
  NFT_SIZE: number,
  denom: string,
  lockups: AugmentedLockup[],
  getSigningCosmWasmClient?: () => Promise<SigningCosmWasmClient>,
  address?: string
): Promise<LockupsResult> {
  const requiredAmount = NFT_SIZE + 0.0001
  const isFactoryDenom = denom.startsWith("factory")

  const nativeResult = findLSTLockupsForNFT(requiredAmount, denom, lockups)

  const dAtomNativeLockup = isFactoryDenom
    ? lockups.find(
        (lockup) =>
          lockup.funds.denom.includes("factory") && !NFT_SIZES.includes(lockup.funds.amount) && lockup.funds.amount > 0
      )
    : undefined

  // ✅ Early return if native lockups are sufficient
  if (nativeResult.totalAmount >= requiredAmount) {
    return {
      ...nativeResult,
      selectedLockups: nativeResult.selectedLockups,
      selectedLockupsCount: nativeResult.selectedLockups.length,
      totalAmount: nativeResult.totalAmount,
      remainder: nativeResult.remainder,
      totalLockupSelected: 0,
      hasVirtualLockups: false,
      hasMultipleDenoms: false,
      sharedDenomCount: 0,
      virtualLockupsCount: 0,
      virtualLockups: [],
      hasMatchingDenoms: false,
      hasDenomCombination: false,
      demon: denom,
    }
  }

  let virtualLockupsLSM: VirtualLockup[] = []

  if (
    isFactoryDenom &&
    executeWalletSimulateLockup &&
    getSigningCosmWasmClient &&
    address
  ) {
    const atomLockups = lockups.filter(
      (lockup) => lockup.funds.denomInfo?.humanReadableDenom === "ATOM"
    )

    if (atomLockups.length > 0) {
      try {
        const dtokenResponse = await executeWalletSimulateLockup({
          getSigningCosmWasmClient,
          address,
          lockIds: atomLockups.map((el) => el.id),
        })

        const simulatedResults: SimulatedLockup[] =
          dtokenResponse.dtokens_response

        virtualLockupsLSM = atomLockups.map((atomLockup) => {
          const simulatedResult = simulatedResults.find(
            (result) => result.lock_id === atomLockup.id
          )

          const simulatedAmount = simulatedResult
            ? parseInt(simulatedResult.dtoken_amount) / 1e6
            : atomLockup.funds.amount / 1e6

          return {
            ...atomLockup,
            funds: {
              ...atomLockup.funds,
              amount: simulatedAmount,
            },
          }
        })
      } catch (error) {
        console.warn("Failed to simulate ATOM lockups:", error)
      }
    }
  }

  const denomGroups = virtualLockupsLSM.reduce(
    (groups, lockup) => {
      const key = lockup.funds.denom
      if (!groups[key]) groups[key] = []
      groups[key].push(lockup)
      return groups
    },
    {} as Record<string, VirtualLockup[]>
  )

  Object.keys(denomGroups).forEach((denom) => {
    denomGroups[denom].sort((a, b) => b.funds.amount - a.funds.amount)
  })

  const hasMultipleDenoms = Object.keys(denomGroups).length > 1
  const sharedDenomGroups = Object.values(denomGroups).filter(
    (group) => group.length > 1
  )
  const sharedDenomCount = sharedDenomGroups.length

  let baseSelection: VirtualLockup[] = nativeResult.selectedLockups.map(
    (l) => ({
      ...l,
      funds: { ...l.funds, amount: l.funds.amount / 1e6 },
    })
  )
  let baseAmount = baseSelection.reduce((sum, l) => sum + l.funds.amount, 0)

  const selectedCombination: VirtualLockup[] = []

  // ✅ Always add dATOM native lockup first (if applicable)
  if (dAtomNativeLockup) {
    selectedCombination.push(dAtomNativeLockup)
    baseAmount += dAtomNativeLockup.funds.amount
  }

  // ✅ Add baseSelection, avoiding duplicates
  for (const base of baseSelection) {
    if (!selectedCombination.find((l) => l.id === base.id)) {
      selectedCombination.push(base)
      baseAmount += base.funds.amount
    }
  }

  // 🧠 Try shared denom groups
  for (const group of sharedDenomGroups) {
    let groupTotal = 0
    const groupSelection: VirtualLockup[] = []

    for (const lockup of group) {
      if (selectedCombination.some((l) => l.id === lockup.id)) continue

      groupSelection.push(lockup)
      groupTotal += lockup.funds.amount

      if (baseAmount + groupTotal >= requiredAmount) {
        for (const g of groupSelection) {
          selectedCombination.push(g)
          baseAmount += g.funds.amount
        }
        break
      }
    }

    if (baseAmount >= requiredAmount) break
  }

  // 🔁 Try greedy fallback if needed
  if (baseAmount < requiredAmount) {
    const sortedVirtual = [...virtualLockupsLSM]
      .filter((l) => !selectedCombination.some((sel) => sel.id === l.id))
      .sort((a, b) => b.funds.amount - a.funds.amount)

    for (const lockup of sortedVirtual) {
      selectedCombination.push(lockup)
      baseAmount += lockup.funds.amount
      if (baseAmount >= requiredAmount) break
    }
  }

  // ❌ Still not enough, return empty
  if (baseAmount < requiredAmount) {
    return {
      selectedLockups: [],
      selectedLockupsCount: 0,
      totalAmount: 0,
      remainder: 0,
      totalLockupSelected: 0,
      demon: denom,
      hasVirtualLockups: false,
      hasMultipleDenoms,
      sharedDenomCount,
      virtualLockupsCount: 0,
      virtualLockups: [],
      hasMatchingDenoms: false,
      hasDenomCombination: false,
    }
  }

  const denomSet = new Set(selectedCombination.map((l) => l.funds.denom))
  const hasDenomCombination =
    denomSet.size === 1 && selectedCombination.length > 1

  const virtualOnly = selectedCombination.filter(
    (l) =>
      !nativeResult.selectedLockups.find((n) => n.id === l.id) &&
      (!dAtomNativeLockup || l.id !== dAtomNativeLockup.id)
  )

  console.log({ selectedCombination })
  console.log({ virtualOnly })

  return {
    selectedLockups: selectedCombination,
    selectedLockupsCount: selectedCombination.length,
    totalAmount: baseAmount,
    remainder: baseAmount - NFT_SIZE,
    totalLockupSelected: baseAmount,
    demon: denom,
    hasVirtualLockups: virtualOnly.length > 0,
    hasMultipleDenoms,
    sharedDenomCount,
    virtualLockupsCount: virtualOnly.length,
    virtualLockups: virtualOnly,
    hasMatchingDenoms: sharedDenomCount > 0,
    hasDenomCombination,
  }
}
