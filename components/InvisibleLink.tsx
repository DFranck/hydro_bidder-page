import Link from "next/link"
import { ComponentProps, ReactNode } from "react"

export function InvisibleLink({
  children,
  href,
  ...props
}: ComponentProps<"div"> & {
  children: ReactNode
  href: string
}) {
  return (
    <div {...props}>
      {children}
      <Link href={href} className="absolute inset-0" />
    </div>
  )
}
