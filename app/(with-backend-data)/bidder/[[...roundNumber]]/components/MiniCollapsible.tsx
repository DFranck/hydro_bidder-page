import { ReactNode } from "react"

export function MiniCollapsible({
  title,
  children,
}: {
  title: ReactNode
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <div className="px-4 py-2 text-sm font-medium bg-white/5">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
