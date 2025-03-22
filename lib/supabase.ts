import { createClient } from "@supabase/supabase-js"
import { invariant } from "ts-invariant"

const supabaseUrl = "https://qqhhwjgeottahfasjzht.supabase.co"

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY

invariant(supabaseKey, "NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY is not set")

export const supabase = createClient(supabaseUrl, supabaseKey)
