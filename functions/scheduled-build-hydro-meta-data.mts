import "@netlify/functions"
import { Config } from "@netlify/functions"
import fs from "fs"
import path from "path"
import { RawStaticHydroMetaData } from "../contract-apis/types"
import { fetchHydroMetaData } from "./build-hydro-round-data-in-background/_fetchers/fetchHydroMetaData"

export default async function () {
  console.log("Building hydro meta data...")

  const hydroMetaData = await fetchHydroMetaData({
    hydroContractAddress: Netlify.env.get(
      "NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS"
    )!,
    numiaCosmosHydroAppApiKey: Netlify.env.get(
      "NUMIA_COSMOS_HYDRO_APP_API_KEY"
    )!,
  })

  const rawStaticHydroMetaData: RawStaticHydroMetaData = {
    timestamp: Date.now(),
    hydroMetaData,
  }

  const outputPath = path.join(
    process.cwd(),
    "public",
    "data",
    "raw-hydro-meta-data.json"
  )

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  console.log(`Writing data to: ${outputPath}`)

  fs.writeFileSync(outputPath, JSON.stringify(rawStaticHydroMetaData))

  console.log("Hydro meta data build completed successfully")
}

export const config: Config = {
  schedule: "* * * * *", // every minute
}
