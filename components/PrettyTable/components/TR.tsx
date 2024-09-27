import { ComponentProps } from "react"
import { twJoin, twMerge } from "tailwind-merge"

export function TR({
    children,
    className,
    variant = "tbody",
    ...otherProps
}: ComponentProps<"tr"> & {
    variant?: "tbody" | "thead"
}) {
    const classNamesByVariant = {
        tbody: twJoin(
            `
                group/table-row
                relative
                max-sm:grid
                max-sm:grid-flow-row
                max-sm:grid-cols-2
                max-sm:gap-6
                max-sm:rounded-md
                max-sm:border
                max-sm:p-3
            `
        ),

        tfoot: twJoin(`
            w-full
            justify-stretch
            max-sm:flex
        `),

        thead: twJoin(`
            w-full
            justify-stretch
            max-sm:flex
        `),
    }

    return (
        <tr
            className={twMerge(classNamesByVariant[variant], className)}
            {...otherProps}
        >
            {children}
        </tr>
    )
}
