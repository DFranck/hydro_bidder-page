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
                    group-hover/table-row:bg-palette-beige/10
                    max-sm:block
                    sm:p-5
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
                        font-bold
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
