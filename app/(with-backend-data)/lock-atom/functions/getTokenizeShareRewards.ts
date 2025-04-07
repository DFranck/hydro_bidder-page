import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate"
import { Tendermint34Client } from "@cosmjs/tendermint-rpc"
import { QueryClientImpl as DistributionQueryClient } from "moonkittjs/dist/codegen/cosmos/distribution/v1beta1/query.rpc.Query"

import type {
  QueryTokenizeShareRecordRewardRequest,
  QueryTokenizeShareRecordRewardResponse,
} from "moonkittjs/dist/codegen/cosmos/distribution/v1beta1/query"

/**
 * Fetch staking rewards from tokenized share records for a given address.
 */
export async function getTokenizeShareRewardsWithClient(
  rpcEndpoint: string,
  address: string,
): Promise<QueryTokenizeShareRecordRewardResponse | undefined> {
  try {
    const tmClient = await Tendermint34Client.connect(rpcEndpoint)
    const baseQueryClient = new QueryClient(tmClient)
    const rpcClient = createProtobufRpcClient(baseQueryClient)

    const distQueryClient = new DistributionQueryClient(rpcClient)

    const request: QueryTokenizeShareRecordRewardRequest = {
      ownerAddress: address,
    }

    return await distQueryClient.tokenizeShareRecordReward(request)
  } catch (err) {
    console.error("Failed to fetch tokenize share rewards:", err)
    return undefined
  }
}
