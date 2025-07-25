import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { toUtf8 } from "@cosmjs/encoding"
import { MarketplaceLockup } from "../../marketplace/types"

export default async function executeTransferNftUnlist(
  address: string,
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
  lockup: MarketplaceLockup,
  receiverAddress: string,
): Promise<void> {
  try {
    const signingClient = await getSigningCosmWasmClient()
    const hydroAddress = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS!
    const marketplaceAddress =
      process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS!
    const tokenId = lockup.listing?.token_id

    if (!tokenId) throw new Error("Missing tokenId")

    const transferNFTMsg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: address,
        contract: hydroAddress,
        msg: toUtf8(
          JSON.stringify({
            transfer_nft: {
              recipient: receiverAddress,
              token_id: tokenId,
            },
          }),
        ),
        funds: [],
      },
    }

    const cancelMsg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: address,
        contract: marketplaceAddress,
        msg: toUtf8(
          JSON.stringify({
            unlist: {
              collection: lockup.listing.collection,
              token_id: tokenId,
            },
          }),
        ),
        funds: [],
      },
    }

    await signingClient.signAndBroadcast(
      address,
      [transferNFTMsg, cancelMsg],
      "auto",
    )
  } catch (error) {
    throw error
  }
}
