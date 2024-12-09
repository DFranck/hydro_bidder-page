import { clearNetlifyCache } from "@/lib/clearNetlifyCache"

export async function GET() {
  await clearNetlifyCache()
  return new Response("Cache cleared successfully!", { status: 200 })
}
