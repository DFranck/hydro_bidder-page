import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { GlobalState } from "@/app/types"
import { unstable_cache } from "next/cache"
import { cacheRevalidationInterval } from "./_globals"
import { getCosmWasmClient } from "./getCosmWasmClient"

export const fetchGlobalState = async (): Promise<GlobalState> => {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()
  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const [
    constants,
    currentRound,
    totalLockedTokens,
    tranches,
    whitelistAdmins,
    whitelist,
    // bidDescriptions,
  ] = await Promise.all([
    unstable_cache(
      async () => {
        return hydroQueryClient
          .constants()
          .then((response) => response.constants)
      },
      ["constants"],
      { revalidate: cacheRevalidationInterval }
    )(),
    unstable_cache(
      async () => {
        return hydroQueryClient
          .currentRound()
          .then((response) => response.round_id)
      },
      ["currentRound"],
      { revalidate: cacheRevalidationInterval }
    )(),
    unstable_cache(
      async () => {
        return hydroQueryClient
          .totalLockedTokens()
          .then((response) => response.total_locked_tokens)
      },
      ["totalLockedTokens"],
      { revalidate: cacheRevalidationInterval }
    )(),
    unstable_cache(
      async () => {
        return hydroQueryClient.tranches().then((response) => response.tranches)
      },
      ["tranches"],
      { revalidate: cacheRevalidationInterval }
    )(),
    unstable_cache(
      async () => {
        return hydroQueryClient
          .whitelistAdmins()
          .then((response) => response.admins)
      },
      ["whitelistAdmins"],
      { revalidate: cacheRevalidationInterval }
    )(),
    unstable_cache(
      async () => {
        return hydroQueryClient
          .whitelist()
          .then((response) => response.whitelist)
      },
      ["whitelist"],
      { revalidate: cacheRevalidationInterval }
    )(),
    unstable_cache(
      async () => {
        return fetch(
          "https://raw.githubusercontent.com/informalsystems/hydro-bid-descriptions/refs/heads/main/bid-descriptions.json"
        ).then((response) => response.json())
      },
      ["bidDescriptions"],
      { revalidate: cacheRevalidationInterval }
    )(),
  ])

  return {
    constants,
    currentRound,
    totalLockedTokens,
    tranches,
    whitelistAdmins,
    whitelist,
    bidDescriptions: [],
  }
}
