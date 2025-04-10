import type { QueryTokenizeShareRecordRewardRequest } from "moonkittjs/dist/codegen/cosmos/distribution/v1beta1/query"
import { LSMStakingRewards } from "../app/(with-backend-data)/rewards/types"

const ATOM_EXPONENT = 6

export async function fetchLSMStakingRewards(
  rpcEndpoint: string,
  address: string,
  atomPrice: number,
): Promise<LSMStakingRewards | undefined> {
  if (!process.env.NEXT_PUBLIC_ATOM_DENOM) {
    return
  }

  try {
    // if we import from `stridejs`, it creates values with 10**18 exponent
    const cosmos = (await import("moonkittjs")).cosmos
    const client = await cosmos.ClientFactory.createRPCQueryClient({
      rpcEndpoint,
    })

    const rewardsReq: QueryTokenizeShareRecordRewardRequest = {
      ownerAddress: address,
    }
    const stakingRewards =
      await client.cosmos.distribution.v1beta1.tokenizeShareRecordReward(
        rewardsReq,
      )
    const atomRewards = stakingRewards.total.find(
      (entry) => entry.denom === process.env.NEXT_PUBLIC_ATOM_DENOM,
    )

    let totalAtom = 0
    if (atomRewards !== undefined) {
      totalAtom = parseFloat(atomRewards.amount) / 10 ** ATOM_EXPONENT
    }
    const totalUsd = totalAtom * atomPrice

    return {
      // Total ATOM and USD across all tokenized staking reward records
      totalAtom: totalAtom,
      totalUsd: totalUsd,
    }
  } catch (err) {
    console.error("Failed to fetch claimable staking rewards:", err)
    return undefined
  }
}
