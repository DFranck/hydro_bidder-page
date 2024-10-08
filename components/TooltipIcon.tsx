import { Info } from "lucide-react"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function TooltipIcon({
    children,
    classNamesForTooltip,
}: {
    children: ReactNode
    classNamesForTooltip?: string
}) {
    return (
        <div className="group relative" tabIndex={0}>
            <Info className="inline-block" size={14} />
            <div
                className={twMerge(
                    `
                        pointer-events-none
                        absolute
                        left-1/2
                        top-full
                        z-50
                        w-56
                        -translate-x-1/2
                        translate-y-full
                        whitespace-normal
                        rounded-sm
                        border
                        border-palette-beige
                        bg-palette-text
                        px-4
                        py-2
                        text-left
                        text-sm
                        font-normal
                        text-white
                        opacity-0
                        transition-all
                        group-hover:pointer-events-auto
                        group-hover:translate-y-0
                        group-hover:opacity-100
                        group-focus:pointer-events-auto
                        group-focus:translate-y-0
                        group-focus:opacity-100
                    `,
                    classNamesForTooltip
                )}
            >
                {children}
            </div>
        </div>
    )
}
