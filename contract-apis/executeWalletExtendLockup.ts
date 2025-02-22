import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export async function executeWalletExtendLockup({
  address,
  getSigningCosmWasmClient,
  lockId,
  lockDurationInNanos,
}: {
  address: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
  lockId: number
  lockDurationInNanos: number
}) {
  const client = await getSigningCosmWasmClient()

  const hydroClient = new HydroBaseClient(
    client,
    address,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS!
  )
  const response = await hydroClient.refreshLockDuration(
    {
      lockDuration: lockDurationInNanos,
      lockIds: [lockId],
    },
    "auto"
  )
  return response
}
