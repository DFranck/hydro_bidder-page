import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import { SanitizedLockup } from "@/contract-apis/types"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

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
  lockups: SanitizedLockup[]
}) {
  const client = await getSigningCosmWasmClient()

  const hydroClient = new HydroBaseClient(
    client,
    address,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS!
  )

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
