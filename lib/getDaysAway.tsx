"use client"

export function getDaysAway(date: Date) {
  return Math.floor(
    (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
}
