import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { DtokenAmountResponse } from "@/app/ts_types/HydroBase.types"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { invariant } from "ts-invariant"

export async function executeWalletSimulateLockup({
  address,
  getSigningCosmWasmClient,
  lockIds,
}: {
  address: string
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
  lockIds: number[]
}) {
  const hydroContractAddress = process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS

  invariant(
    hydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set"
  )

  const client = await getSigningCosmWasmClient()

  const hydroClient = new HydroBaseClient(client, address, hydroContractAddress)

  const dtokens_response: DtokenAmountResponse[] = []

  const simulateError = []

  for (const lockId of lockIds) {
    try {
      const res = await hydroClient.simulateDtokenAmounts({
        address,
        lockIds: [lockId],
      })

      if (res?.dtokens_response?.[0]) {
        dtokens_response.push(res.dtokens_response[0])
      }
    } catch (err) {
      simulateError.push(err)
    }
  }

  const hasSimulatedError = simulateError.length > 0 ? true : false

  return { dtokens_response, hasSimulatedError }
}
