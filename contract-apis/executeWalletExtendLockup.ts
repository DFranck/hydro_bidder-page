import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { DEFAULT_EPOCH_LENGTH } from "@/config"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export async function executeWalletExtendLockup({
  address,
  getSigningCosmWasmClient,
  lockId,
  lockDuration,
}: {
  address: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
  lockId: number
  lockDuration: number
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
  const response = await hydroClient.refreshLockDuration(
    { lockDuration: DEFAULT_EPOCH_LENGTH * lockDuration, lockIds: [lockId] },
    "auto"
  )
  return response
}
