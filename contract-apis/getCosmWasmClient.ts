// convenience func that allows doing contract queries on both server and client

import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { ExtendedHttpEndpoint } from "@cosmos-kit/core"

let clientInstance: CosmWasmClient | null = null

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function connectWithRetry(
  endpoint: ExtendedHttpEndpoint,
  attempts = 5,
  initialDelay = 2000
): Promise<CosmWasmClient> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await CosmWasmClient.connect(endpoint)
    } catch (error) {
      if (i === attempts - 1) throw error // Last attempt, throw the error

      // If the error contains "Throttled", wait longer
      const isThrottled =
        error instanceof Error &&
        (error.message.includes("Throttled") ||
          error.message.includes("rate limit"))
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
  endpoint,
}: {
  endpoint: ExtendedHttpEndpoint
}): Promise<CosmWasmClient> {
  if (!clientInstance) {
    clientInstance = await connectWithRetry(endpoint)
  }
  return clientInstance
}
