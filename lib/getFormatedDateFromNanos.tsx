import { Timestamp } from "@/app/ts_types/HydroBase.types"

export function getFormatedDateFromNanos(nanos: Timestamp): string {
  const millis = Number(nanos) / 1_000_000;
  return new Date(millis).toLocaleDateString();
}
