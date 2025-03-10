import "@netlify/functions"
import { Config } from "@netlify/functions"

export default async function () {
  const URL = Netlify.env.get("URL")

  console.log("Triggering background hydro round data build...")

  const response = await fetch(
    `${URL}/.netlify/functions/build-hydro-round-data-in-background`,
    {
      method: "POST",
    }
  )

  console.log(
    `Background hydro round data build triggered with response: ${response.status}`
  )
}

export const config: Config = {
  schedule: "*/10 * * * *", // every 10 minutes
}
