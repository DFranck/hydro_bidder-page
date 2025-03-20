import { createClient } from "@supabase/supabase-js"
import { getEnvironmentVariable } from "../contract-apis/getEnvironmentVariable"

const supabaseUrl = "https://qqhhwjgeottahfasjzht.supabase.co"
const supabaseKey = getEnvironmentVariable("SUPABASE_ANON_PUBLIC_KEY")

export const supabase = createClient(supabaseUrl, supabaseKey)
