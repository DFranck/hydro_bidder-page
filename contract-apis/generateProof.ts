"use server"

import { ProofResponse } from "./types"

const GENERATE_PROOF_ENDPOINT = "http://64.227.20.77:3000/generate_proof"

export async function generateProof(address: string) {
  if (!address) {
    return
  }
  try {
    const response = await fetch(`${GENERATE_PROOF_ENDPOINT}/${address}`).then(
      (res) => res.json()
    )
    return response as ProofResponse
  } catch (error) {
    console.error(error)
  }
}
