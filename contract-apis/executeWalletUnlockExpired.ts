import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export async function executeWalletUnlockExpired({
  address,
  getSigningCosmWasmClient,
}: {
  address: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
}) {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getSigningCosmWasmClient()

  const hydroClient = new HydroBaseClient(
    client,
    address,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const response = await hydroClient.unlockTokens()

  return response
}
