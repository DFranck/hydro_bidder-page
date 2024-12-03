"use client"
import { DeliverTxResponse } from "@cosmjs/stargate"

export function extractLSMDenom(broadcastResult: DeliverTxResponse): {
  amount: string
  denom: string
} {
  const tokenizeSharesEvent = broadcastResult.events.find(
    (event) => event.type === "tokenize_shares"
  )
  if (!tokenizeSharesEvent) {
    throw new Error("Tokenize shares event not found in broadcast result")
  }

  const tokenizedSharesAttribute = tokenizeSharesEvent.attributes.find(
    (attr) => attr.key === "tokenized_shares"
  )

  if (!tokenizedSharesAttribute) {
    throw new Error("Tokenized shares attribute not found in event")
  }

  const match = tokenizedSharesAttribute.value.match(/(.*)(cosmosvaloper.*)/)

  if (!match || match.length !== 3) {
    throw new Error("Unable to parse tokenized shares value")
  }

  const [_, amount, denom] = match

  return { amount, denom }
}
