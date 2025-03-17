import { OfflineSigner } from "@cosmjs/proto-signing"
import { SkipClient, SkipClientOptions } from "@skip-go/client"
import { useMemo } from "react"

export async function getAddress(chainId: string) {
  const key = await window.keplr?.getKey(chainId)
  if (!key) throw new Error(`No key for chainID: ${chainId}`)
  return key.bech32Address
}

export function useCreateSkipClientMemo(
  getOfflineSigner: () => OfflineSigner,
  initiatorChainId: string
) {
  return useMemo(() => {
    const skipClientOptions: SkipClientOptions = {
      getCosmosSigner: async function (chainID: string) {
        if (initiatorChainId !== chainID) {
          throw new Error("Chain is not supported")
        }
        return Promise.resolve(getOfflineSigner())
      },
    }

    if (process.env.NEXT_PUBLIC_SKIP_API_RPC_ENDPOINT) {
      skipClientOptions.endpointOptions = {
        getRpcEndpointForChain: async function (chainID: string) {
          if (initiatorChainId !== chainID) {
            throw new Error("Chain is not supported")
          }
          return Promise.resolve(process.env.NEXT_PUBLIC_SKIP_API_RPC_ENDPOINT!)
        },
      }
    }

    const skipClient = new SkipClient(skipClientOptions)
    return skipClient
  }, [getOfflineSigner, initiatorChainId])
}
