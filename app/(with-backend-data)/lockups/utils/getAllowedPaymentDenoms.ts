import { CollectionConfig } from "@/app/ts_types/MarketplaceBase.types"

// TODO: Becare of this in the future there is no managmenent for more than one sell denom
export function getAllowedPaymentDenoms(collections: CollectionConfig[]) {
  const currentCollections = collections.filter(
    (collection) =>
      collection.contract_address ===
      process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS,
  )
  const allowedPaymentDenoms = currentCollections.map((c) => c.sell_denoms[0])
  return allowedPaymentDenoms
}
