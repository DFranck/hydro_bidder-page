"use server"

import { ProofResponse } from "./types"

const GENERATE_PROOF_ENDPOINT =
  "https://hydro-deployment-tracking-2fitd.ondigitalocean.app/generateProof"

export async function generateProof(address: string) {
  try {
    // const response = await fetch(
    //   `${GENERATE_PROOF_ENDPOINT}?address=${address}`
    // ).then((res) => res.json())
    // return response as ProofResponse[]
    return Promise.resolve({ proof: ["81a9e465d2ed6b04a205fd8c873c6b63851b5933f2668c10f7d6e257334a7424"] } as ProofResponse)
  } catch (error) {
    console.error(error)
  }
}
