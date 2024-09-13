import { cn } from "@/lib/utils"
import { FC } from "react"

type Props = {
    style?: string
}

export const HorizontalDivider: FC<Props> = ({ style }) => {
    return (
        <div className={cn("flex py-5 items-center", style)}>
            <div className="flex-grow border-t border-color-[#FFE1B8]"></div>
        </div>
    )
}
