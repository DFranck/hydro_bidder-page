import { Timestamp } from "@/app/ts_types/HydroBase.types"

export function getFormatedDateFromNanos(
  nanos: Timestamp,
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const millis = Number(nanos) / 1_000_000
  return new Date(millis).toLocaleDateString(locale, options)
}
