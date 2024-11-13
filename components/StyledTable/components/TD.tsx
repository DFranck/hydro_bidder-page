import { ComponentPropsWithRef, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function TD({
  children,
  className,
  label,
  textAlign,
  ...otherProps
}: ComponentPropsWithRef<"td"> & {
  label?: ReactNode
  textAlign?: "center" | "left" | "right"
}) {
  return (
    <td
      className={twMerge(
        `
          group/table-cell
          cursor-default
          bg-clip-padding
          align-middle
          first:rounded-l-md
          last:rounded-r-md
          max-sm:block
          sm:p-5
          sm:group-hover/table-row:bg-palette-beige/10
        `,

        textAlign === "center"
          ? "sm:text-center"
          : textAlign === "right"
            ? "sm:text-right"
            : "sm:text-left",

        className
      )}
      {...otherProps}
    >
      {label && (
        <span
          className="
            block
            text-xs
            font-bold
            uppercase
            opacity-70
            sm:hidden
          "
        >
          {label}
        </span>
      )}

      {children}
    </td>
  )
}
