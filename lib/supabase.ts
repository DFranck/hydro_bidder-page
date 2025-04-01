import { createClient } from "@supabase/supabase-js"
import { invariant } from "ts-invariant"

const supabaseUrl = "https://qqhhwjgeottahfasjzht.supabase.co"

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

invariant(supabaseKey, "SUPABASE_SERVICE_ROLE_KEY is not set")

export const supabase = createClient(supabaseUrl, supabaseKey)
