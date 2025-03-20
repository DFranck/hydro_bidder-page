import { calculateDurationAndUnit } from "@/lib/calculateDurationAndUnit"
import { pluralize } from "@/lib/pluralize"

export function getTimeBetweenDates(
  startDate: Date | string,
  endDate: Date | string
) {
  if (typeof startDate === "string") {
    startDate = new Date(startDate)
  }
  if (typeof endDate === "string") {
    endDate = new Date(endDate)
  }

  const diff = endDate.getTime() - startDate.getTime()
  const { duration, unit } = calculateDurationAndUnit(diff)

  return pluralize({
    count: Math.floor(Math.abs(duration)),
    singular: unit,
    prefixCount: true,
  })
}
