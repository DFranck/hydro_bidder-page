export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchWithRetry(
  url: string,
  init?: RequestInit & { next?: { revalidate?: number } },
  attempts = 5,
  initialDelay = 2000
): Promise<Response> {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url, init)
      if (response.ok) return response

      // Treat non-200 responses as retriable errors
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
    } catch (error) {
      if (i === attempts - 1) throw error

      const isThrottled =
        error instanceof Error &&
        (error.message.includes("Throttled") ||
          error.message.includes("rate limit"))
      const waitTime = initialDelay * Math.pow(2, i) * (isThrottled ? 3 : 1)
      const jitter = Math.random() * 1000
      await delay(waitTime + jitter)
    }
  }
  throw new Error("Failed to fetch after multiple attempts")
}
