import { HydroBaseQueryClient } from "@/app/ts_types/HydroBase.client"
import { LockupWithPerTrancheInfo } from "@/app/ts_types/HydroBase.types"
import { SanitizedLockup } from "@/contract-apis/fetchBackendDataAfterWallet"
import { getCosmWasmClient } from "./getCosmWasmClient"

function sanitizeLockup(lockup: LockupWithPerTrancheInfo): SanitizedLockup {
  return {
    id: lockup.lock_with_power.lock_entry.lock_id,
    currentVotingPower: Number(lockup.lock_with_power.current_voting_power),
    dateEnd: new Date(Number(lockup.lock_with_power.lock_entry.lock_end) / 1e6),
    dateStart: new Date(
      Number(lockup.lock_with_power.lock_entry.lock_start) / 1e6
    ),
    funds: {
      amount: Number(lockup.lock_with_power.lock_entry.funds.amount) / 1e6,
      denom: lockup.lock_with_power.lock_entry.funds.denom,
    },
    multiplier: Number(
      (
        Number(lockup.lock_with_power.current_voting_power) /
        Number(lockup.lock_with_power.lock_entry.funds.amount)
      ).toFixed(2)
    ),
    metaDataByTrancheId: Object.fromEntries(
      lockup.per_tranche_info.map((trancheInfo) => [
        trancheInfo.tranche_id,
        {
          nextRoundEligibleToVote:
            trancheInfo.next_round_lockup_can_vote ?? null,
          votedOnBidId: trancheInfo.current_voted_on_proposal ?? null,
        },
      ])
    ),
  }
}

export async function fetchWalletLockups(address: string) {
  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const client = await getCosmWasmClient()

  const hydroQueryClient = new HydroBaseQueryClient(
    client,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  const lockupsWithPerTrancheInfo =
    await hydroQueryClient.allUserLockupsWithTrancheInfos({
      address,
      limit: 10_000,
      startFrom: 0,
    })

  return lockupsWithPerTrancheInfo.lockups_with_per_tranche_infos.map(
    sanitizeLockup
  )
}
