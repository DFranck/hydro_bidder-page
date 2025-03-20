import { getStore } from "@netlify/blobs"
import "@netlify/functions"
import { Config } from "@netlify/functions"
import { getEnvironmentVariable } from "../contract-apis/getEnvironmentVariable"
import { fetchHydroMetaData } from "./build-hydro-round-data-in-background/_fetchers/fetchHydroMetaData"

export default async function () {
  console.log("Building hydro meta data...")

  const hydroMetaData = await fetchHydroMetaData()

  console.log(`Writing data to Netlify Blob storage`)

  const store = getStore({
    name: "raw-data",
    consistency: "eventual",
    siteID: getEnvironmentVariable("NETLIFY_SITE_ID"),
    token: getEnvironmentVariable("NETLIFY_API_TOKEN"),
  })

  await store.setJSON("raw-hydro-meta-data", hydroMetaData, {
    metadata: {
      buildTime: Date.now(),
    },
  })

  console.log("Hydro meta data build completed successfully")
}

export const config: Config = {
  schedule: "* * * * *", // every minute
}
