import { ReactNode } from "react"

export function BlurryBackdropBox({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        -mx-3
        overflow-hidden
        rounded-md
        bg-palette-text/60
        px-3
        backdrop-blur-md
      "
    >
      {children}
    </div>
  )
}
