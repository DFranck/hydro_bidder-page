import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { invariant } from "ts-invariant"

export async function executeWalletExtendLockup({
  address,
  getSigningCosmWasmClient,
  lockId,
  lockDurationInNanos,
  type = "single",
}: {
  address: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
  lockId: number | number[]
  lockDurationInNanos: number
  type: "single" | "multiple"
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
      lockIds: type === "single" ? [lockId as number] : (lockId as number[]),
    },
    "auto"
  )

  return response
}
