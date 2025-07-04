import { getHydroSigningClient } from "@/contract-apis/getClient"
import { AugmentedLockup } from "@/contract-apis/types"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export default async function executeTransferNft(
  address: string,
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
  lockup: AugmentedLockup,
  receiverAddress: string,
): Promise<void> {
  try {
    const hydroSigningClient = await getHydroSigningClient({
      address,
      getSigningCosmWasmClient,
    })

    await hydroSigningClient.transferNft(
      {
        recipient: receiverAddress,
        tokenId: lockup.id.toString(),
      },
      "auto",
      undefined,
      [],
    )
  } catch (error) {
    throw error
  }
}
