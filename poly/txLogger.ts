// /app/(utils)/cosmos/txLogger.ts
// File: /app/(utils)/cosmos/txLogger.ts

import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate"
import type { DeliverTxResponse } from "@cosmjs/stargate"

export type TxKind = "addTribute" | "refundTribute"

export interface TxMeta {
  kind: TxKind
  contract: string
  signer: string
  chainId: string
  payload: Record<string, unknown>
  funds?: Array<{ amount: string; denom: string }>
  memo?: string
}

export interface TxTimings {
  start: number
  end: number
  ms: number
}

export interface ParsedEvent {
  type: string
  attributes: Array<{ key: string; value: string }>
}

export interface ParsedRawLog {
  events: ParsedEvent[]
}

// Accept either CosmJS stargate or cosmwasm result
export type TxResponseLike = DeliverTxResponse | ExecuteResult

function isDeliverTxResponse(r: TxResponseLike): r is DeliverTxResponse {
  // `code` and `msgResponses` are only on DeliverTxResponse
  return typeof (r as DeliverTxResponse).code === "number"
}

function isExecuteResult(r: TxResponseLike): r is ExecuteResult {
  // `events` is specific to ExecuteResult (not on DeliverTxResponse)
  return Array.isArray((r as ExecuteResult).events)
}

function tryParseRawLog(raw?: string): ParsedRawLog | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Array<{ events?: ParsedEvent[] }>
    const events = parsed.flatMap((e) => e.events ?? [])
    return { events }
  } catch {
    return null
  }
}

function shortAddr(addr: string): string {
  return addr.length > 16 ? `${addr.slice(0, 10)}…${addr.slice(-6)}` : addr
}

export function logTxStart(meta: TxMeta): TxTimings {
  const start = performance.now()
  // eslint-disable-next-line no-console
  console.info(
    `[TX ▶️  START] ${meta.kind} | signer=${shortAddr(meta.signer)} | chain=${meta.chainId}`,
    { contract: meta.contract, payload: meta.payload, funds: meta.funds, memo: meta.memo }
  )
  return { start, end: start, ms: 0 }
}

export function logTxSuccess(
  meta: TxMeta,
  timings: TxTimings,
  res: TxResponseLike
): void {
  const end = performance.now()
  timings.end = end
  timings.ms = Math.round(end - timings.start)

  // Normalize common fields
  const base = {
    height: res.height,
    hash: res.transactionHash,
    gasUsed: res.gasUsed,
    gasWanted: res.gasWanted,
  }

  let events: ParsedEvent[] | undefined
  let rawLog: string | undefined
  let code: number | undefined

  if (isDeliverTxResponse(res)) {
    rawLog = res.rawLog
    code = res.code
    events = tryParseRawLog(res.rawLog || "")?.events ?? undefined
  } else if (isExecuteResult(res)) {
    // ExecuteResult has structured events already
    events = (res.events as unknown as ParsedEvent[]) ?? undefined
    // Some chains/clients also fill rawLog; log if present
    rawLog = (res as unknown as { rawLog?: string }).rawLog
  }

  // eslint-disable-next-line no-console
  console.info(`[TX ✅  OK] ${meta.kind} | hash=${base.hash} | height=${base.height}`, {
    code,
    gasUsed: base.gasUsed,
    gasWanted: base.gasWanted,
    ms: timings.ms,
    rawLog,
    events,
  })
}

export function logTxError(meta: TxMeta, timings: TxTimings, error: unknown): void {
  const end = performance.now()
  timings.end = end
  timings.ms = Math.round(end - timings.start)
  // eslint-disable-next-line no-console
  console.error(`[TX ❌ ERR] ${meta.kind} | signer=${shortAddr(meta.signer)} | ${timings.ms}ms`, {
    contract: meta.contract,
    payload: meta.payload,
    funds: meta.funds,
    memo: meta.memo,
    error,
  })
}
