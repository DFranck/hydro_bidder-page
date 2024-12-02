import { pluralize } from "@/lib/pluralize"

export function getTimeUntilDate(endDate: Date | string) {
  if (typeof endDate === "string") {
    endDate = new Date(endDate)
  }

  const now = new Date()
  const diff = endDate.getTime() - now.getTime()
  const seconds = diff / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const months = days / 30

  let duration = 0,
    unit = ""

  if (Math.abs(months) >= 1) {
    duration = months
    unit = "month"
  } else if (Math.abs(days) >= 1) {
    duration = days
    unit = "day"
  } else if (Math.abs(hours) >= 1) {
    duration = hours
    unit = "hour"
  } else if (Math.abs(minutes) >= 1) {
    duration = minutes
    unit = "min"
  } else {
    duration = seconds
    unit = "sec"
  }

  return pluralize({
    count: Math.floor(duration),
    singular: unit,
    prefixCount: true,
  })
}
