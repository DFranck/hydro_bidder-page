export function getSupabaseNamespacedFilename(filename: string) {
  const supabaseDataNamespace =
    process.env.NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE ??
    process.env.DEPLOY_PRIME_URL ??
    process.env.DEPLOY_URL ??
    process.env.URL

  const safeSupabaseDataNamespace = supabaseDataNamespace
    ?.trim()
    .toLowerCase()
    .replace(" ", "-")
    .replace(/[^a-z0-9_-]/g, "")

  if (!safeSupabaseDataNamespace) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_DATA_NAMESPACE is not set, or is not safe to use"
    )
  }

  return `${safeSupabaseDataNamespace}--${filename}`
}
