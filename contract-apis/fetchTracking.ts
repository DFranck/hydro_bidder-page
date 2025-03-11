<<<<<<< HEAD
"use server"

import { TrackingItem } from "./types"

const TRACKING_HOLDINGS_ENDPOINT =
  "https://hydro-deployment-tracking-2fitd.ondigitalocean.app/holdings/"

export async function fetchTracking() {
  try {
    const response = await fetch(TRACKING_HOLDINGS_ENDPOINT).then((res) =>
      res.json()
    )
=======
export interface TrackingItem {
  bid_id: number
  initial_atom_allocation: number
  holdings: HoldingItem[]
}

export interface HoldingItem {
  info_missing: boolean
  protocol: string
  venue_total: {
    balances: BalanceItem[]
    total_usdc: number
    total_atom: number
  }
  address_holdings: {
    balances: BalanceItem[]
    total_usdc: number
    total_atom: number
  }
  address_rewards: {
    balances: BalanceItem[]
    total_usdc: number
    total_atom: number
  }
}

export interface BalanceItem {
  denom: string
  amount: number
  usd_value: number
  display_name: string
}

export async function fetchTracking() {
  try {
    const response = await fetch("api/holdings").then((res) => res.json())
>>>>>>> cbde222 (Implemented initial tracking page)
    return response as TrackingItem[]
  } catch (error) {
    console.error(error)
  }
}
