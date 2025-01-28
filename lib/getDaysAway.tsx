"use client"

export function getDaysAway(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date)
  }

  return Math.round(
    (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
}
