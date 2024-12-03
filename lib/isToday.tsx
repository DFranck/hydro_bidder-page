"use client"

export function isToday(date: Date | string): boolean {
  if (typeof date === "string") {
    date = new Date(date)
  }

  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}
