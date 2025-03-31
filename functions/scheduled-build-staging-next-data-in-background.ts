import { Config } from "@netlify/functions"

export const config: Config = {
  schedule: "*/15 * * * *", // every 15 minutes
}

export default async function () {
  try {
    console.log("Fetching secret build-data endpoint on staging-next...")
    await fetch(
      "https://staging-next--hydro-staging.netlify.app/api/build-data"
    )
    console.log("Data for staging-next rebuilt successfully")
  } catch (error) {
    console.error("Error fetching data for staging-next:", error)
  }
}
