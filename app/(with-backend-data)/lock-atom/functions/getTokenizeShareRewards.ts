// src/app/(with-backend-data)/lock-atom/functions/getClaimableStakingRewards.ts

import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate"
import { Tendermint34Client } from "@cosmjs/tendermint-rpc"
import type { QueryTokenizeShareRecordRewardRequest } from "moonkittjs/dist/codegen/cosmos/distribution/v1beta1/query"
import { QueryClientImpl as DistributionQueryClient } from "moonkittjs/dist/codegen/cosmos/distribution/v1beta1/query.rpc.Query"
import type { QueryTokenizeShareRecordsOwnedRequest } from "moonkittjs/dist/codegen/cosmos/staking/v1beta1/query"
import { QueryClientImpl as StakingQueryClient } from "moonkittjs/dist/codegen/cosmos/staking/v1beta1/query.rpc.Query"
import { ClaimableRewardItem, ClaimableRewardsSummary } from "../types"

const getAtomToUsdRate = async (): Promise<number> => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=cosmos&vs_currencies=usd",
    )
    const data = await response.json()
    return data?.cosmos?.usd || 0
  } catch {
    return 0
  }
}

export async function getClaimableStakingRewardsSummary(
  rpcEndpoint: string,
  address: string,
): Promise<ClaimableRewardsSummary | undefined> {
  try {
    const tmClient = await Tendermint34Client.connect(rpcEndpoint)
    const baseQueryClient = new QueryClient(tmClient)
    const rpcClient = createProtobufRpcClient(baseQueryClient)

    const stakingClient = new StakingQueryClient(rpcClient)
    const distClient = new DistributionQueryClient(rpcClient)

    const ownedReq: QueryTokenizeShareRecordsOwnedRequest = { owner: address }
    const recordsOwned = await stakingClient.tokenizeShareRecordsOwned(ownedReq)
    const recordIds = recordsOwned.records?.map((r) => r.id.toString()) ?? []

    const rewardsReq: QueryTokenizeShareRecordRewardRequest = {
      ownerAddress: address,
    }
    const rewards = await distClient.tokenizeShareRecordReward(rewardsReq)
    const atomToUsd = await getAtomToUsdRate()

    const claimable: ClaimableRewardItem[] = recordIds.map((id) => {
      const recordReward = rewards.rewards.find(
        (r) => r.recordId.toString() === id,
      )
      const atomCoin = recordReward?.reward.find((c) => c.denom === "uatom")
      const atom = atomCoin ? parseInt(atomCoin.amount) / 1_000_000 : 0
      const usd = atom * atomToUsd
      return { recordId: id, atomAmount: atom, usdAmount: usd }
    })

    const totalAtom = claimable.reduce((acc, r) => acc + r.atomAmount, 0)
    const totalUsd = claimable.reduce((acc, r) => acc + r.usdAmount, 0)

    return {
      totalAtom: Number(totalAtom.toFixed(6)),
      totalUsd: Number(totalUsd.toFixed(2)),
      rewards: claimable,
    }
  } catch (err) {
    console.error("Failed to fetch claimable staking rewards:", err)
    return undefined
  }
}
