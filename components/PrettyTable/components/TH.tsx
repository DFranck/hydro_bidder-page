import { ChevronUp } from "lucide-react"
import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export function TH({
    children,
    className,
    isSortable,
    isSorted,
    sortDirection,
    textAlign,
    ...otherProps
}: ComponentProps<"th"> & {
    isSortable?: boolean
    isSorted?: boolean
    sortDirection?: "ASC" | "DESC"
    textAlign?: "center" | "left" | "right"
}) {
    return (
        <th
            className={twMerge(
                `
                    group/table-cell
                    flex-grow
                    px-5
                    py-1
                    text-sm
                    font-normal
                    text-neutral-200
                    max-sm:block
                `,

                isSortable &&
                    `
                        cursor-pointer
                        hover:bg-palette-beige/10
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
            <span
                className={twMerge(
                    `
                        inline-flex
                        flex-row
                        items-center
                        gap-3
                        whitespace-nowrap
                    `,

                    textAlign === "center"
                        ? "text-center"
                        : textAlign === "right"
                          ? "text-right"
                          : "text-left"
                )}
            >
                {children ?? <>&nbsp;</>}
                {isSortable && (
                    <div
                        className={twMerge(
                            `
                                relative
                                h-3
                                w-0
                            `,
                            textAlign === "right" && "-order-1"
                        )}
                    >
                        <ChevronUp
                            className={twMerge(
                                `
                                    absolute
                                    left-1/2
                                    top-1/2
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    transition-all
                                    group-hover/table-cell:opacity-50
                                `,
                                isSorted ? "!opacity-100" : "opacity-0",
                                sortDirection === "ASC"
                                    ? "rotate-0"
                                    : "rotate-180"
                            )}
                            size={18}
                        />
                    </div>
                )}
            </span>
        </th>
    )
}
