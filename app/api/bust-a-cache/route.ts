import { clearNetlifyCache } from "@/lib/clearNetlifyCache"
import { revalidateTag } from "next/cache"

export async function GET() {
  // Clear the Netlify cache
  await clearNetlifyCache()

  // Clear the NextJS cache
  revalidateTag("backendData")

  return new Response("Cache cleared successfully!", { status: 200 })
}
