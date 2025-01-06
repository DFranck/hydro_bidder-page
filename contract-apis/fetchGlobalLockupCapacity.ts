import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { getCosmWasmClient } from "./getCosmWasmClient"

export interface GlobalLockupCapacityInfo {
  lockedAtomIsAtCapacityGlobal: boolean
  lockedAtomMaxGlobal: number
  lockedAtomPercentageGlobal: number
  lockedAtomRemainingCapacityGlobal: number
  lockedAtomTotalGlobal: number
}

export async function fetchGlobalLockupCapacity(): Promise<GlobalLockupCapacityInfo> {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()

  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const [
    {
      constants: { max_locked_tokens: lockedUatomMaxGlobal },
    },
    { total_locked_tokens: lockedUatomTotalGlobal },
  ] = await Promise.all([
    hydroQueryClient.constants(),
    hydroQueryClient.totalLockedTokens(),
  ])

  const lockedAtomMaxGlobal = lockedUatomMaxGlobal / 1e6

  const lockedAtomTotalGlobal = lockedUatomTotalGlobal / 1e6

  // must be rounded to 6 decimal places
  const lockedAtomRemainingCapacityGlobal = Number(
    (lockedAtomMaxGlobal - lockedAtomTotalGlobal).toFixed(6)
  )

  const lockedAtomPercentageGlobal = Math.floor(
    (lockedAtomTotalGlobal / lockedAtomMaxGlobal) * 100
  )

  const lockedAtomIsAtCapacityGlobal = lockedAtomPercentageGlobal === 100

  return {
    lockedAtomIsAtCapacityGlobal,
    lockedAtomMaxGlobal,
    lockedAtomPercentageGlobal,
    lockedAtomRemainingCapacityGlobal,
    lockedAtomTotalGlobal,
  }
}
