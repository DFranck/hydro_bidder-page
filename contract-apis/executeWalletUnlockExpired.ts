import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export async function executeWalletUnlockExpired({
  address,
  getSigningCosmWasmClient,
  lockIds,
}: {
  address: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
  lockIds: number[]
}) {
  const client = await getSigningCosmWasmClient()

  const hydroClient = new HydroBaseClient(
    client,
    address,
    getEnvironmentVariable("NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS")
  )

  const response = await hydroClient.unlockTokens({ lockIds })

  return response
}
