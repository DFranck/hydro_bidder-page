import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { defaultLimit, defaultStartFrom } from "./_globals"
import { getCosmWasmClient } from "./getCosmWasmClient"

export const fetchMyExpiredLockups = async (address: string) => {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const response = await hydroQueryClient.expiredUserLockups({
    address,
    limit: defaultLimit,
    startFrom: defaultStartFrom,
  })
  return response.lockups
}
