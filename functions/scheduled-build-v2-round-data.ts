import { Config } from "@netlify/functions"

export const config: Config = {
  schedule: "*/10 * * * *", // every 10 minutes
}

export default async function () {
  try {
    console.log("Starting v2 data building...")

    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://hydro.cosmos.network"

    const urlPrefix = "/api/v2/production/atom"

    const currentRoundIdResponse = await fetch(
      new URL(`${urlPrefix}/current-round`, baseUrl)
    )
    const { round_id: currentRoundId } = await currentRoundIdResponse.json()

    const allRoundIds = Array.from(
      { length: currentRoundId + 1 },
      (_, index) => index
    )

    await Promise.all(
      allRoundIds.map(async (round_id) => {
        return await fetch(
          new URL(`${urlPrefix}/build_round_data/${round_id}`, baseUrl)
        ).then((res) => res.json())
      })
    )

    console.log("Background v2 data building function completed successfully")
  } catch (error) {
    console.log(`Error: ${error}`)
    console.error("Error building v2 data:", error)
  }
}
