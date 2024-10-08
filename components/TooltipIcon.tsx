import { Info } from "lucide-react"
import { ReactNode } from "react"

export function TooltipIcon({ children }: { children: ReactNode }) {
    return (
        <div className="group relative">
            <Info className="inline-block" size={14} />
            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-full
                    z-50
                    w-56
                    -translate-x-1/2
                    translate-y-full
                    rounded-sm
                    border
                    border-palette-beige
                    bg-palette-text
                    px-3
                    py-1
                    text-sm
                    font-normal
                    text-white
                    opacity-0
                    transition-all
                    group-hover:pointer-events-auto
                    group-hover:translate-y-0
                    group-hover:opacity-100
                "
            >
                {children}
            </div>
        </div>
    )
}
