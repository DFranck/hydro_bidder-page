"use server"

const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN
const SITE_ID = process.env.NETLIFY_SITE_ID

export async function clearNetlifyCache() {
  const response = await fetch(
    `https://api.netlify.com/api/v1/sites/${SITE_ID}/deploys`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Error clearing cache: ${response.statusText}`)
  }

  console.log("Cache cleared successfully!")
}
