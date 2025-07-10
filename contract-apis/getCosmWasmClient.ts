// convenience func that allows doing contract queries on both server and client

import { sharedEndpoints } from "@/config"
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"

let clientInstance: CosmWasmClient | null = null
let connectionPromise: Promise<CosmWasmClient> | null = null

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function connectWithRetry({
  attempts = 3,
  initialDelay = 1000,
  maxDelay = 5000,
}: {
  attempts?: number
  initialDelay?: number
  maxDelay?: number
} = {}): Promise<CosmWasmClient> {
  for (let i = 0; i < attempts; i++) {
    try {
      const client = await CosmWasmClient.connect(sharedEndpoints.neutron.rpc[0])

      // Test the connection with a simple query
      await client.getHeight()
      return client
    } catch (error) {
      if (i === attempts - 1) throw error

      const isThrottled =
        error instanceof Error &&
        (error.message.toLowerCase().includes("throttled") ||
          error.message.toLowerCase().includes("rate limit") ||
          error.message.toLowerCase().includes("too many"))

      const waitTime = Math.min(
        initialDelay * Math.pow(2, i) * (isThrottled ? 2 : 1),
        maxDelay
      )

      const jitter = Math.random() * 500
      await delay(waitTime + jitter)
    }
  }
  throw new Error("Failed to connect after multiple attempts")
}

// without the need to wait for the client side to finish executing useChain()
export async function getCosmWasmClient(): Promise<CosmWasmClient> {
  if (clientInstance) {
    return clientInstance
  }

  if (connectionPromise) {
    return connectionPromise
  }

  connectionPromise = connectWithRetry()

  try {
    clientInstance = await connectionPromise
    return clientInstance
  } catch (error) {
    connectionPromise = null
    throw error
  }
}

export async function resetCosmWasmClient(): Promise<void> {
  if (clientInstance) {
    try {
      await clientInstance.disconnect()
    } catch (error) {
      console.warn("Error disconnecting client:", error)
    }
  }
  clientInstance = null
  connectionPromise = null
}
