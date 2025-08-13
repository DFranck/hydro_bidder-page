import { AugmentedLockup } from "@/contract-apis/types"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { toUtf8 } from "@cosmjs/encoding"
import { Coin } from "moonkittjs"
import { toContractAmount } from "../utils/toContractAmount"

export default async function executeApproveList(
  address: string,
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
  lockup: AugmentedLockup,
  price: Coin,
): Promise<void> {
  try {
    const signingClient = await getSigningCosmWasmClient()
    const hydroAddress = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS!
    const marketplaceAddress =
      process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS!
    const tokenId = lockup.id.toString()
    const toContractPrice = {
      denom: price.denom,
      amount: toContractAmount(price.amount, price.denom),
    }
    const approveMsg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: address,
        contract: hydroAddress,
        msg: toUtf8(
          JSON.stringify({
            approve: {
              spender: marketplaceAddress,
              token_id: tokenId,
            },
          }),
        ),
        funds: [],
      },
    }

    const listMsg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: address,
        contract: marketplaceAddress,
        msg: toUtf8(
          JSON.stringify({
            list: {
              collection: hydroAddress,
              token_id: tokenId,
              price: toContractPrice,
            },
          }),
        ),
        funds: [],
      },
    }

    await signingClient.signAndBroadcast(address, [approveMsg, listMsg], "auto")
  } catch (error) {
    throw error
  }
}
