import { cn } from "@/lib/utils"
import { FC } from "react"

export function HorizontalDivider({ className }: { className: string }) {
    return (
        <div className={cn("flex py-5 items-center", className)}>
            <div className="flex-grow border-t border-[#FFE1B8]"></div>
        </div>
    )
}
