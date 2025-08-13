import { ListingMutationAPIResponse } from "../../marketplace/types"

export const SupabaseHydroListingUpdate = async (
  tokenId: string,
  action: ListingMutationAPIResponse["operation"],
) => {
  const collection = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  const newListing = await fetch("/api/tweak-nft-store", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collection, tokenId, action }),
  })
  const resJson = await newListing.json()
  return resJson
}
