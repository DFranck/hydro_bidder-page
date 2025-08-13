export function logMintDebugData(...args: unknown[]) {
  if (process.env.NEXT_PUBLIC_USE_FIXTURE_DATA !== "true") return

  console.log("[MintDebug]:", ...args.map((arg) =>
    typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg
  ))
}
