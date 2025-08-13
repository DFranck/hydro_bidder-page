// Path: app/api/tweak-nft-store/route.ts

import { ListingMutationAPIResponse } from "@/app/(with-backend-data)/lockups/marketplace/types"
import { Listing } from "@/app/ts_types/MarketplaceBase.types"
import { getMarketplaceQueryClient } from "@/contract-apis/getClient"
import { revalidateTag } from "@/lib/revalidateTag"
import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

const STORAGE_BUCKET = "raw-backend-data"
const LISTINGS_FILE = "raw-hydro-listings.json"

export async function POST(req: NextRequest) {
  try {
    const { collection, tokenId, action } = await req.json()
    if (!collection || !tokenId || !action) {
      return NextResponse.json(
        { error: "Missing collection or tokenId or action" },
        { status: 400 },
      )
    }

    const marketplaceClient = await getMarketplaceQueryClient()
    let latestListing: Listing | null = null
    try {
      const res = await marketplaceClient.listing({ collection, tokenId })
      latestListing = res?.listing ?? null
    } catch (e) {
      latestListing = null
    }

    let listings: Listing[] = []
// TODO : Replace with the correct filename beor PR
    // const filename = getSupabaseNamespacedFilename(LISTINGS_FILE)
    const filename = "moonkitt-dev--" + LISTINGS_FILE
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(filename)
      if (error) throw error
      listings = JSON.parse(await data.text())
    } catch {
      listings = []
      console.warn("[API] Listings file not found, starting with empty array")
    }

    let operation: ListingMutationAPIResponse["operation"]
    let listingToReturn: Listing | null = latestListing
    const findIdx = listings.findIndex(
      (l) => l.collection === collection && l.token_id === tokenId,
    )

    // State mutation
    switch (action) {
      case "list":
      case "update":
        if (!latestListing) {
          return NextResponse.json(
            { success: false, error: "Missing listing for upsert" },
            { status: 400 },
          )
        }
        if (findIdx >= 0) {
          // Replace
          listings[findIdx] = latestListing
          operation = "update"
        } else {
          // Create
          listings.push(latestListing)
          operation = "list"
        }
        break
      case "unlist":
      case "buy":
        if (latestListing) {
          console.error("[API] Listing should not exist anymore after removal")
          return NextResponse.json(
            {
              success: false,
              error: "Listing should not exist anymore after removal",
            },
            { status: 400 },
          )
        }
        if (findIdx < 0) {
          console.warn(
            "[API] Listing not found for removal — treating as noop OK",
          )
          return NextResponse.json({
            success: true,
            operation: "noop",
            listing: null,
          })
        }

        const removedListing = listings[findIdx]
        listings.splice(findIdx, 1)
        operation = action
        listingToReturn = removedListing
        break

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 },
        )
    }

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, JSON.stringify(listings, null, 2), {
        upsert: true,
        contentType: "application/json",
      })

    if (uploadError) {
      console.error("[API] Failed to upload to Supabase:", uploadError)
      return NextResponse.json(
        { error: "Critical error: failed to write listing to Supabase" },
        { status: 500 },
      )
    }

    await revalidateTag("backendData")
    return NextResponse.json({
      success: true,
      operation,
      listing: listingToReturn,
    })
  } catch (e: any) {
    console.error("[API] ERROR:", e)
    return NextResponse.json(
      { error: e.message || e.toString() },
      { status: 500 },
    )
  }
}
