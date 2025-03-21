import "@netlify/functions"
import { createClient } from "@supabase/supabase-js"
import { invariant } from "ts-invariant"

const supabaseUrl = "https://qqhhwjgeottahfasjzht.supabase.co"

const supabaseKey =
  process.env.SUPABASE_ANON_PUBLIC_KEY ??
  Netlify?.env?.get("SUPABASE_ANON_PUBLIC_KEY")

invariant(supabaseKey, "SUPABASE_ANON_PUBLIC_KEY is not set")

export const supabase = createClient(supabaseUrl, supabaseKey)
