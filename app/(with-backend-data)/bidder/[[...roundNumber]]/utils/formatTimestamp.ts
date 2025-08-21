import { Timestamp } from "@/app/ts_types/HydroBase.types"

const pad2 = (n: number) => String(n).padStart(2, "0")

function anyTsToMillis(nanosLike: Timestamp): number {
  const s = String(nanosLike).trim()
  const neg = s.startsWith("-")
  const digits = neg ? s.slice(1).replace(/\D/g, "") : s.replace(/\D/g, "")
  let ms = 0

  if (digits.length >= 19) {
    // ns -> ms
    ms = Number(digits.slice(0, -6))
  } else if (digits.length >= 16) {
    // µs -> ms
    ms = Number(digits.slice(0, -3))
  } else if (digits.length >= 13) {
    // ms
    ms = Number(digits)
  } else if (digits.length >= 10) {
    // s -> ms
    ms = Number(digits + "000")
  } else {
    ms = 0
  }
  return neg ? -ms : ms
}

export function formatTimestamp(nanosLike: Timestamp): {
  display: string
  full: string
} {
  const date = new Date(anyTsToMillis(nanosLike))

  const y = date.getFullYear()
  const m = pad2(date.getMonth() + 1)
  const d = pad2(date.getDate())
  const hh = pad2(date.getHours())
  const mm = pad2(date.getMinutes())

  return {
    display: `${y}-${m}-${d} ${hh}:${mm}`,
    full: date.toISOString(),
  }
}
