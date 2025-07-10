interface PluralizeOptions {
  count?: number
  prefixCount?: boolean
  plural?: string
  singular: string
}

export function pluralize({
  count, prefixCount = false, plural, singular,
}: PluralizeOptions) {
  const label = count === 1 ? singular : plural || singular + 's'

  return `${(prefixCount ?? true) ? `${count} ` : ''}${label}`
}

export function plural(
  count: number,
  singular: string,
  plural: string = `${singular}s`,
) {
  return pluralize({ count, singular, plural })
}
