import { getMarketplaceSigningClient } from "@/contract-apis/getClient"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { Coin } from "moonkittjs"
import { MarketplaceLockup } from "../../marketplace/types"

export default async function executeBuy(
  address: string,
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
  lockup: MarketplaceLockup,
  price: Coin,
): Promise<void> {
  const client = await getMarketplaceSigningClient({
    address,
    getSigningCosmWasmClient,
  })

  try {
    const res = await client.buy(
      {
        collection: lockup.listing.collection,
        tokenId: lockup.listing.token_id,
      },
      "auto",
      undefined,
      [price],
    )

    const allEvents = res.events || []

    const wasmEvent = allEvents.find(
      (event) =>
        event.type === "wasm" &&
        event.attributes?.some(
          (attr) => attr.key === "action" && attr.value === "buy_nft",
        ),
    )

    const successAttr = wasmEvent?.attributes.find(
      (attr) => attr.key === "success",
    )

    if (successAttr?.value === "false") {
      console.log("🚫 Detected failure in event: throwing error")
      throw new Error("This NFT is no longer available for sale.")
    }
  } catch (error: any) {
    console.error("❌ TX failed or buy unsuccessful:", error)
    throw error
  }
}
