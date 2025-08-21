// app/api/refresh-hydro-rounds-data/route.ts
export const runtime = "nodejs"

import { fetchHydroRoundsData } from "@/functions/scheduled-build-hydro-round-data-in-background/_fetchers/fetchHydroRoundsData"
import { getSupabaseNamespacedFilename } from "@/lib/getSupabaseNamespacedFilename"
import { revalidateTag } from "@/lib/revalidateTag"
import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"
import crypto from "node:crypto"

const STORAGE_BUCKET = "raw-backend-data"
const ROUNDS_FILE = "raw-hydro-round-data.json"

function sha256(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex")
}

async function downloadText(bucket: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).download(path)
  if (error) throw error
  return await data.text()
}

type PatchBody = {
  roundIds?: number[] // si absent → full rebuild (fallback)
}

export async function POST(req: NextRequest) {
  const t0 = Date.now()
  const ns = process.env.NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE

  try {
    const body = (await req.json().catch(() => ({}))) as PatchBody
    const filename = getSupabaseNamespacedFilename(ROUNDS_FILE)

    // 0) Charger l’état actuel depuis Supabase (si existe), sinon [].
    let current: any[] = []
    try {
      const txt = await downloadText(STORAGE_BUCKET, filename)
      current = JSON.parse(txt)
      if (!Array.isArray(current)) current = []
    } catch {
      console.warn("[refresh-rounds] no existing file, starting from empty []")
      current = []
    }

    const toUpdate = await fetchHydroRoundsData(body.roundIds)

    const byId = new Map<number, any>(current.map((r: any) => [r.round_id, r]))
    for (const r of toUpdate) {
      byId.set(r.round_id, r)
    }
    const merged = Array.from(byId.values()).sort((a, b) => a.round_id - b.round_id)

    const json = JSON.stringify(merged)
    const sentHash = sha256(json)
    const sizeKB = Math.round(json.length / 1024)
    const countBids = merged.reduce((n, r) => n + (Array.isArray(r?.round_bids) ? r.round_bids.length : 0), 0)

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, json, {
        upsert: true,
        contentType: "application/json",
        cacheControl: "0",
      })
    if (uploadError) {
      console.error("[refresh-rounds] upload error:", uploadError)
      return NextResponse.json({ ok: false, error: "Failed to write round data to Supabase" }, { status: 500 })
    }

    let verified = false
    let receivedHash = ""
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const back = await downloadText(STORAGE_BUCKET, filename)
        receivedHash = sha256(back)
        if (receivedHash === sentHash) { verified = true; break }
      } catch {}
      await new Promise((r) => setTimeout(r, 200))
    }
    if (!verified) console.warn("[refresh-rounds] verification mismatch", { sentHash, receivedHash })

    // 5) Invalidate cache
    await revalidateTag("backendData")

    const dt = Date.now() - t0
    console.log(`[refresh-rounds] ok in ${dt}ms → ${filename} verified=${verified}`)

    return NextResponse.json({
      ok: true,
      path: filename,
      sizeKB,
      countBids,
      ns,
      verified,
      updatedRoundIds: body.roundIds ?? "ALL",
      sentHash,
      receivedHash,
      ms: dt,
    })
  } catch (e: any) {
    console.error("[refresh-rounds] ERROR:", e)
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 })
  }
}
