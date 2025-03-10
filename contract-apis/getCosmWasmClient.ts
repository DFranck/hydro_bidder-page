// convenience func that allows doing contract queries on both server and client

import { getEndpoints } from "@/config"
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"

let clientInstance: CosmWasmClient | null = null

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function connectWithRetry({
  attempts = 5,
  initialDelay = 2000,
  numiaCosmosHydroAppApiKey,
}: {
  attempts?: number
  initialDelay?: number
  numiaCosmosHydroAppApiKey: string
}): Promise<CosmWasmClient> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await CosmWasmClient.connect(
        getEndpoints({ numiaCosmosHydroAppApiKey }).neutron.rpc[0]
      )
    } catch (error) {
      if (i === attempts - 1) throw error // Last attempt, throw the error

      // If the error contains "Throttled", wait longer
      const isThrottled =
        error instanceof Error &&
        (error.message.toLowerCase().includes("throttled") ||
          error.message.toLowerCase().includes("rate limit") ||
          error.message.toLowerCase().includes("too many"))

      const waitTime = initialDelay * Math.pow(2, i) * (isThrottled ? 3 : 1)

      // Add some jitter to prevent thundering herd
      const jitter = Math.random() * 1000
      await delay(waitTime + jitter)
    }
  }
  throw new Error("Failed to connect after multiple attempts")
}

// without the need to wait for the client side to finish executing useChain()
export async function getCosmWasmClient({
  numiaCosmosHydroAppApiKey,
}: {
  numiaCosmosHydroAppApiKey: string
}): Promise<CosmWasmClient> {
  if (!clientInstance) {
    clientInstance = await connectWithRetry({
      numiaCosmosHydroAppApiKey,
    })
  }
  return clientInstance
}
