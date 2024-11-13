interface PluralizeOptions {
  count?: number
  prefixCount?: boolean
  plural?: string
  singular: string
}

const pluralize = ({
  count,
  prefixCount = false,
  plural,
  singular,
}: PluralizeOptions) => {
  const label = count === 1 ? singular : plural || singular + 's'

  return `${(prefixCount ?? true) ? `${count} ` : ''}${label}`
}

export { pluralize }
