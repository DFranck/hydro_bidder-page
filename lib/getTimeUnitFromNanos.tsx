export function getTimeUnitFromNanos(nanos: number) {
  const hours = nanos / 3600000000000
  const days = hours / 24
  const months = days / 30
  const years = months / 12

  const units = [
    { threshold: years, unit: "year" },
    { threshold: months, unit: "month" },
    { threshold: days, unit: "day" },
    { threshold: hours, unit: "hour" },
  ]

  const { threshold, unit } =
    units.find(({ threshold }) => threshold >= 1) || units[3]

  return { value: Math.floor(threshold), unit }
}
