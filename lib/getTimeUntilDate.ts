import { calculateDurationAndUnit } from "@/lib/calculateDurationAndUnit"
import { pluralize } from "@/lib/pluralize"

export function getTimeUntilDate(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date)
  }

  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const { duration, unit } = calculateDurationAndUnit(diff)

  if (duration <= 0) {
    return "Time's Up"
  }

  return pluralize({
    count: Math.floor(duration),
    singular: unit,
    prefixCount: true,
  })
}
