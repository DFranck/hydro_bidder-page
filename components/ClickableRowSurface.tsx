import Link from "next/link"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function ClickableRowSurface({
  children,
  href,
  className,
}: {
  children: ReactNode
  href: string
  className?: string
}) {
  return (
    <div className={twMerge("relative", className)}>
      {children}
      <Link href={href} className="absolute inset-0" />
    </div>
  )
}
