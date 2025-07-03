import {
  getHydroQueryClient,
  getLSTQueryClient,
} from "@/contract-apis/getClient"
import { AugmentedLockup } from "@/contract-apis/types"
import { useQuery } from "@tanstack/react-query"

export function useRatioQuery(
  lockup: AugmentedLockup | null,
  currentRoundId: number
) {
  return useQuery({
    queryKey: ["denom-ratio", lockup?.funds.denom, currentRoundId],
    queryFn: () => getDenomRatio(lockup, currentRoundId),
    enabled: !!lockup && lockup.funds.denom !== "ATOM",
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

async function getDenomRatio(
  token: AugmentedLockup | null,
  currentRoundId: number
): Promise<number> {
  const fallbackRatio = 1

  const denom = token?.funds.denom

  try {
    const hydroQueryClient = await getHydroQueryClient()
    const tokenProvider = await hydroQueryClient.tokenInfoProviders()

    const filteredContracts = tokenProvider.providers
      .filter((provider) => !("lsm" in provider))
      .flatMap((provider) => {
        const value = Object.values(provider)[0]
        return value?.contract || []
      })

    for (const contract of filteredContracts) {
      try {
        const lstClient = await getLSTQueryClient(contract)
        const denomInfo = await lstClient.denomInfo({ roundId: currentRoundId })

        if (denomInfo.denom === denom) {
          const resolvedRatio = Number(denomInfo.ratio)
          return resolvedRatio
        }
      } catch (err) {
        console.warn(`Error querying denomInfo from ${contract}:`, err)
      }
    }
    return fallbackRatio
  } catch (err) {
    return fallbackRatio
  }
}
