import { Listing } from "@/app/ts_types/MarketplaceBase.types"
import { getMarketplaceQueryClient } from "@/contract-apis/getClient"

export const fetchHydroListings = async (): Promise<Listing[]> => {
  let allListings: any[] = []
  let startAfter: number | undefined = undefined

  const marketplaceClient = await getMarketplaceQueryClient()

  const PAGE_SIZE = 100
  const collection = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS

  if (!collection) {
    throw new Error("NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set")
  }

  while (true) {
    const response = await marketplaceClient.listingsByCollection({
      collection: collection,
      limit: PAGE_SIZE,
      startAfter,
    })

    const listings = response.listings ?? []
    allListings = allListings.concat(listings)

    if (listings.length < PAGE_SIZE) {
      break
    }

    startAfter = listings[listings.length - 1].listing_id
  }

  return allListings
}
