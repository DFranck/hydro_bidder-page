import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { invariant } from "ts-invariant"

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
  const hydroContractAddress = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS

  invariant(
    hydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set"
  )

  const client = await getSigningCosmWasmClient()

  const hydroClient = new HydroBaseClient(client, address, hydroContractAddress)

  const response = await hydroClient.refreshLockDuration(
    {
      lockDuration: lockDurationInNanos,
      lockIds: [lockId],
    },
    "auto"
  )

  return response
}
