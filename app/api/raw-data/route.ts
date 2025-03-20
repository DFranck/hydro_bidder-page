import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"
import { getStore } from "@netlify/blobs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")

  if (!key) {
    return new Response("Missing key", { status: 400 })
  }

  const store = getStore({
    name: "raw-data",
    consistency: "eventual",
    siteID: getEnvironmentVariable("NETLIFY_SITE_ID"),
    token: getEnvironmentVariable("NETLIFY_API_TOKEN"),
  })

  const data = await store.get(key, {
    type: "json",
    consistency: "eventual",
  })

  return new Response(JSON.stringify(data))
}
