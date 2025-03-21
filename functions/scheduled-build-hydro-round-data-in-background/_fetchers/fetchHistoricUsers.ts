import "@netlify/functions"
import { invariant } from "ts-invariant"

export async function fetchHistoricUsers(): Promise<{ users: string[] }> {
  const numiaUsersEndpoint =
    process.env.NUMIA_USERS_ENDPOINT ??
    Netlify?.env?.get("NUMIA_USERS_ENDPOINT")

  const numiaCosmosHydroAppApiKey =
    process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY ??
    Netlify?.env?.get("NUMIA_COSMOS_HYDRO_APP_API_KEY")

  invariant(numiaUsersEndpoint, "NUMIA_USERS_ENDPOINT is not set")

  invariant(
    numiaCosmosHydroAppApiKey,
    "NUMIA_COSMOS_HYDRO_APP_API_KEY is not set"
  )

  const response = await fetch(`${numiaUsersEndpoint}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${numiaCosmosHydroAppApiKey}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch numia users data: ${response.statusText}`)
  }

  // Clean up the response
  const responseJson = await response.json()
  const users = responseJson[0]
  return users
}
