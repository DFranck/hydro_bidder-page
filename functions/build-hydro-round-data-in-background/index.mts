import { getStore } from "@netlify/blobs"
import { Context } from "@netlify/functions"
import { getEnvironmentVariable } from "../../contract-apis/getEnvironmentVariable"
import { fetchHydroRoundsData } from "./_fetchers/fetchHydroRoundsData"

export default async (req: Request, context: Context) => {
  context.log("Background function started")
  try {
    context.log("Starting data fetch...")

    const hydroRoundData = await fetchHydroRoundsData()

    context.log("Writing data to Netlify Blob storage")

    const store = getStore({
      name: "raw-data",
      consistency: "eventual",
      siteID: getEnvironmentVariable("NETLIFY_SITE_ID"),
      token: getEnvironmentVariable("NETLIFY_API_TOKEN"),
    })

    await store.setJSON("raw-hydro-round-data", hydroRoundData, {
      metadata: {
        buildTime: Date.now(),
      },
    })

    context.log("Background function completed successfully")
  } catch (error) {
    context.log(`Error: ${error.message}`)
    context.log(`Stack trace: ${error.stack}`)
    console.error("Error building hydro round data:", error)
  }
}
