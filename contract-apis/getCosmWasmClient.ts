// convenience func that allows doing contract queries on both server and client

import { NEUTRON_DEFAULT_RPC } from "@/config"
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"

let clientInstance: CosmWasmClient | null = null

// without the need to wait for the client side to finish executing useChain()
export const getCosmWasmClient = async (): Promise<CosmWasmClient> => {
  if (!clientInstance) {
    clientInstance = await CosmWasmClient.connect(NEUTRON_DEFAULT_RPC)
  }
  return clientInstance
}
