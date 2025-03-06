"use server"

import "server-only"

export async function fetchHistoricUsers(): Promise<{ users: string[] }> {
  if (!process.env.NUMIA_USERS_ENDPOINT) {
    throw new Error("NUMIA_USERS_ENDPOINT not set")
  }

  const response = await fetch(`${process.env.NUMIA_USERS_ENDPOINT}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY}`,
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
