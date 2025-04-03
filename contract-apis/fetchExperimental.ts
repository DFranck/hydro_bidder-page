"use server"

import { ExperimentalItem } from "./types"

const EXPERIMENTAL_DEPLOYMENT_ENDPOINT =
  "https://hydro-deployment-tracking-2fitd.ondigitalocean.app/experimental"

export async function fetchExperimentalDeployments() {
  try {
    const response = await fetch(EXPERIMENTAL_DEPLOYMENT_ENDPOINT).then((res) =>
      res.json()
    )
    return response as ExperimentalItem[]
  } catch (error) {
    console.error(error)
  }
}
