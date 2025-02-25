import { SkipClient, SkipClientOptions } from "@skip-go/client"

export async function getAddress(chainID: string): Promise<string> {
  const key = await window.keplr?.getKey(chainID)
  if (!key) throw new Error(`No key for chainID: ${chainID}`)
  return key.bech32Address
}

export async function createSkipClient() {
  const skipClientOptions: SkipClientOptions = {
    getCosmosSigner: async function (chainID: string) {
      const key = await window.keplr?.getKey(chainID)
      if (!key) throw new Error("Keplr not installed or chain not added")

      return key.isNanoLedger
        ? window.keplr?.getOfflineSignerOnlyAmino(chainID)
        : window.keplr?.getOfflineSigner(chainID)
    },
  }

  if (process.env.NEXT_PUBLIC_SKIP_API_RPC_ENDPOINT) {
    skipClientOptions.endpointOptions = {
      getRpcEndpointForChain: async function (chainID: string) {
        return Promise.resolve(process.env.NEXT_PUBLIC_SKIP_API_RPC_ENDPOINT!)
      },
    }
  }

  const skipClient = new SkipClient(skipClientOptions)
  return skipClient
}
