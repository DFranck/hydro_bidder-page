export function extractRelevantErrorMessage(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : JSON.stringify(error)

  if (raw === "[object Object]") return "An unknown error occurred."

  const rpcStart = raw.indexOf("rpc error:")
  if (rpcStart >= 0) {
    return raw.slice(rpcStart, rpcStart + 500)
  }

  return raw.length > 300 ? raw.slice(0, 300) + "…" : raw
}
