import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { fetchWalletLockups } from "./fetchWalletLockups"

export async function executeWalletVote(
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
  address: string,
  proposalId: number,
  trancheId: number
) {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getSigningCosmWasmClient()

  const sanitizedLockups = await fetchWalletLockups({ address })

  const hydroClient = new HydroBaseClient(
    client,
    address,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const { round_id: currentRoundId } = await hydroClient.currentRound()

  const validLockups = sanitizedLockups.filter(
    (lockup) =>
      (lockup.metaDataByTrancheId[trancheId]?.nextRoundEligibleToVote ??
        Infinity) <= currentRoundId
  )

  const response = await hydroClient.vote(
    {
      proposalsVotes: [
        {
          lock_ids: validLockups.map((lockup) => lockup.id),
          proposal_id: proposalId,
        },
      ],
      trancheId,
    },
    "auto"
  )
  return response
}
