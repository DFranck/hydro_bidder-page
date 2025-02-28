import { OfflineSigner } from "@cosmjs/proto-signing"
import { ExtendedHttpEndpoint } from "@cosmos-kit/core"
import { SkipClient } from "@skip-go/client"
import { useMemo } from "react"

export async function getAddress(chainId: string) {
  const key = await window.keplr?.getKey(chainId)
  if (!key) throw new Error(`No key for chainID: ${chainId}`)
  return key.bech32Address
}

export function useCreateSkipClientMemo(
  getOfflineSigner: () => OfflineSigner,
  getRpcEndpoint: () => Promise<string | ExtendedHttpEndpoint>,
  initiatorChainId: string
) {
  return useMemo(() => {
    const skipClient = new SkipClient({
      getCosmosSigner: async function (chainID: string) {
        if (initiatorChainId !== chainID) {
          throw new Error("Chain is not supported")
        }
        return Promise.resolve(getOfflineSigner())
      },
      endpointOptions: {
        getRpcEndpointForChain: async function (chainID: string) {
          if (initiatorChainId !== chainID) {
            throw new Error("Chain is not supported")
          }
          const rpcEndpoint = await getRpcEndpoint()
          if (typeof rpcEndpoint === "string") {
            return rpcEndpoint
          }
          return rpcEndpoint.url
        },
      },
    })
    return skipClient
  }, [getOfflineSigner, getRpcEndpoint, initiatorChainId])
}
