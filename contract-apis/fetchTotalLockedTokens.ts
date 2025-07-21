"use server"

import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { getCosmWasmClient } from "@/contract-apis/getCosmWasmClient"
import { invariant } from "ts-invariant"

interface CachedData {
  totalLockedTokens: number
  lockedAtomMaxGlobal: number
  timestamp: number
}

let cache: CachedData | null = null
const CACHE_DURATION = 30 * 1000 // 30 seconds

export async function fetchTotalLockedTokens(): Promise<{
  totalLockedTokens: number
  lockedAtomMaxGlobal: number
}> {
  // Check cache first
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return {
      totalLockedTokens: cache.totalLockedTokens,
      lockedAtomMaxGlobal: cache.lockedAtomMaxGlobal,
    }
  }

  const hydroContractAddress = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS

  invariant(
    hydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set"
  )

  const client = await getCosmWasmClient()

  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    hydroContractAddress
  )

  const [{ total_locked_tokens }, { constants }] = await Promise.all([
    hydroQueryClient.totalLockedTokens(),
    hydroQueryClient.constants(),
  ])

  const result = {
    totalLockedTokens: total_locked_tokens,
    lockedAtomMaxGlobal: constants.max_locked_tokens,
  }

  // Update cache
  cache = {
    ...result,
    timestamp: Date.now(),
  }

  return result
}
