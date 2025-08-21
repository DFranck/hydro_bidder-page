import { Timestamp } from "@/app/ts_types/HydroBase.types";

export function formatTimestamp(nanos: Timestamp): { display: string; full: string } {
  const millis = Number(nanos) / 1_000_000
  const date = new Date(millis)

  return {
    // YYYY-MM-DD HH:mm
    display: date.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    full: date.toISOString(),
  }
}
