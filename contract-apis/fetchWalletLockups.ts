import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { defaultLimit, defaultStartFrom } from "./_globals"
import { getCosmWasmClient } from "./getCosmWasmClient"

export async function fetchWalletLockups(address: string) {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )
  const lockups = await hydroQueryClient.allUserLockups({
    address,
    limit: defaultLimit,
    startFrom: defaultStartFrom,
  })
  return lockups.lockups
}
