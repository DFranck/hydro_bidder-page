import { ComponentProps, ReactNode } from "react"

export function InvisibleButton({
  children,
  onClick,
  ...props
}: ComponentProps<"div"> & {
  children: ReactNode
  onClick: () => void
}) {
  return (
    <div {...props}>
      {children}
      <button onClick={onClick} className="absolute inset-0 cursor-pointer" />
    </div>
  )
}
