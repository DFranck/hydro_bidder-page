export function getSupabaseNamespacedFilename(filename: string) {
  const supabaseDataNamespace =
    process.env.NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE ?? process.env.URL

  const safeSupabaseDataNamespace = supabaseDataNamespace
    ?.trim()
    .toLowerCase()
    .replace(/[:\s]/g, "-")
    .replace(/[^a-z0-9_-]/g, "")

  if (!safeSupabaseDataNamespace) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE and URL are not set, or are not safe to use"
    )
  }

  return `${safeSupabaseDataNamespace}--${filename}`
}
