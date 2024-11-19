import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { fetchMyAllLockups } from "./fetchMyAllLockups"

export const executeVote = async (
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
  address: string,
  proposalId: number,
  trancheId: number
) => {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getSigningCosmWasmClient()
  const lockups = await fetchMyAllLockups(address)
  const hydroClient = new HydroBaseClient(
    client,
    address,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )
  const response = await hydroClient.vote(
    {
      proposalsVotes: [
        {
          lock_ids: lockups.map((lockup) => lockup.lock_entry.lock_id),
          proposal_id: proposalId,
        },
      ],
      trancheId,
    },
    "auto"
  )
  return response
}
