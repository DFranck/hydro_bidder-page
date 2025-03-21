import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { AugmentedLockup } from "@/contract-apis/types"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { invariant } from "ts-invariant"

export async function executeWalletVote({
  getSigningCosmWasmClient,
  address,
  proposalId,
  trancheId,
  lockups,
}: {
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
  address: string
  proposalId: number
  trancheId: number
  lockups: AugmentedLockup[]
}) {
  const hydroContractAddress =
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS ??
    Netlify?.env?.get("NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS")

  invariant(
    hydroContractAddress,
    "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS is not set"
  )

  const client = await getSigningCosmWasmClient()

  const hydroClient = new HydroBaseClient(client, address, hydroContractAddress)

  const { round_id: currentRoundId } = await hydroClient.currentRound()

  const validLockups = lockups.filter(
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
