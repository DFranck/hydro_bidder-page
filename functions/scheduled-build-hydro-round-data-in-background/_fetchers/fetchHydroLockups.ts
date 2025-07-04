import { AllNftInfoResponse } from "@/app/ts_types/HydroBase.types"
import { OutstandingLockupClaimableCoinsResponse } from "@/app/ts_types/TributeBase.types"
import {
  getHydroQueryClient,
  getTributeQueryClient,
} from "@/contract-apis/getClient"

type AllNftInfoWithOutstanding = Omit<AllNftInfoResponse, "info"> & {
  info: Omit<AllNftInfoResponse["info"], "extension"> & {
    extension: AllNftInfoResponse["info"]["extension"] & {
      outstanding: OutstandingLockupClaimableCoinsResponse
    }
  }
}

export async function fetchHydroLockups(): Promise<
  AllNftInfoWithOutstanding[]
> {
  console.log(
    `Fetching hydro meta data from contract ending ${process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS?.slice(-6)}`,
  )
  const hydroQueryClient = await getHydroQueryClient()
  const tributeQueryClient = await getTributeQueryClient()

  let tokenIds: string[] = []
  let startAfter: string | undefined = undefined
  const limit = 100

  while (true) {
    const res = await hydroQueryClient.allTokens({ limit, startAfter })
    tokenIds.push(...res.tokens)

    if (res.tokens.length < limit) break

    startAfter = res.tokens[res.tokens.length - 1]
  }

  const lockups: AllNftInfoWithOutstanding[] = []
  for (const tokenId of tokenIds) {
    try {
      const info = await hydroQueryClient.allNftInfo({ tokenId })
      const outstanding: OutstandingLockupClaimableCoinsResponse =
        await tributeQueryClient.outstandingLockupClaimableCoins({
          lockId: Number(tokenId),
        })

      const enrichedInfo: AllNftInfoWithOutstanding = {
        ...info,
        info: {
          ...info.info,
          extension: {
            ...info.info.extension,
            outstanding,
          },
        },
      }

      lockups.push(enrichedInfo)
    } catch (err) {
      console.error(
        `Failed to fetch info/outstanding for tokenId ${tokenId}:`,
        err,
      )
    }
  }

  return lockups
}
