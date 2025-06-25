export function truncateString({
  string,
  minLength = 20,
  afterDotsStringLength = 4,
}: {
  string: string
  minLength?: number
  afterDotsStringLength?: number
}) {
  if (!string) return ""
  return string.length <= minLength
    ? string
    : `${string.slice(0, 7)}...${string.slice(-afterDotsStringLength)}`
}
