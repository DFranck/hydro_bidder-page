import "@netlify/functions"
import { Config } from "@netlify/functions"
import fs from "fs"
import path from "path"
import { fetchAssetListWithPrices } from "../contract-apis/fetchAssetListWithPrices"
import { fetchBidMetaDataById } from "../contract-apis/fetchBidMetaDataById"
import { fetchNumiaBidData } from "../contract-apis/fetchNumiaBidData"
import { fetchNumiaMetricsData } from "../contract-apis/fetchNumiaMetricsData"
import { RawStaticExternalData } from "../contract-apis/types"

export default async function () {
  console.log("Building external data...")

  const [assetListWithPrices, bidMetaDataById, numiaBids, numiaMetrics] =
    await Promise.all([
      fetchAssetListWithPrices(),
      fetchBidMetaDataById(),
      fetchNumiaBidData(),
      fetchNumiaMetricsData(),
    ])

  const rawStaticExternalData: RawStaticExternalData = {
    timestamp: Date.now(),
    externalData: {
      assetListWithPrices,
      bidMetaDataById,
      numiaBids,
      numiaMetrics,
    },
  }

  const outputPath = path.join(
    process.cwd(),
    "public",
    "data",
    "raw-external-data.json"
  )

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  console.log(`Writing data to: ${outputPath}`)

  fs.writeFileSync(outputPath, JSON.stringify(rawStaticExternalData))

  console.log("External data build completed successfully")
}

export const config: Config = {
  schedule: "0 * * * *", // every hour
}
