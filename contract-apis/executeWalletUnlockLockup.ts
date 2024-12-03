import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { SanitizedLockup } from "@/contract-apis/fetchBackendDataWithWallet"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export async function executeWalletUnlockLockup({
  address,
  lockup,
  getSigningCosmWasmClient,
}: {
  address: string
  lockup: SanitizedLockup
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

  const response = await hydroClient.unlockTokens(undefined, undefined, [
    {
      denom: lockup.funds.denom,
      amount: (lockup.funds.amount * 1e6).toString(),
    },
  ])

  return response
}
