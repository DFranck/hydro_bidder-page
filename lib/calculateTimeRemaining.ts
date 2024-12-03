import { pluralize } from "@/lib/pluralize"

export function calculateTimeRemaining(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date)
  }

  const now = new Date().getTime()
  const end = date.getTime()
  const diff = Math.max(0, end - now) // Ensure non-negative difference
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) {
    return "< 1 hour"
  } else if (days < 1) {
    return pluralize({
      count: hours,
      prefixCount: true,
      singular: "hour",
    })
  } else {
    return pluralize({
      count: days,
      prefixCount: true,
      singular: "day",
    })
  }
}
