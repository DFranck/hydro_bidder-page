import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react"
import { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function PointingInfoBox({
    className,
    title,
    description,
    pointDirection,
    ...props
}: Omit<ComponentProps<"div">, "children" | "title"> & {
    title?: ReactNode
    description?: ReactNode
    pointDirection: "left" | "right" | "up" | "down"
}) {
    return (
        <div
            className={twMerge(
                `
                    relative
                    rounded-md
                    border-2
                    border-palette-beige
                    py-1
                    text-palette-beige
                `,
                pointDirection === "left" && "pl-6 pr-3",
                pointDirection === "right" && "pl-3 pr-6",
                className
            )}
            {...props}
        >
            <div
                className={twMerge(
                    `
                        absolute
                        aspect-square
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        border-2
                        border-palette-text
                        bg-palette-beige
                        p-1
                        text-palette-text
                    `,
                    ["left", "right"].includes(pointDirection) && "top-1/2",
                    ["up", "down"].includes(pointDirection) && "left-1/2",
                    pointDirection === "left" && "left-0",
                    pointDirection === "right" && "left-full",
                    pointDirection === "up" && "top-0",
                    pointDirection === "down" && "top-full"
                )}
            >
                {pointDirection === "left" && <ArrowLeft />}
                {pointDirection === "right" && <ArrowRight />}
                {pointDirection === "up" && <ArrowUp />}
                {pointDirection === "down" && <ArrowDown />}
            </div>

            <div className="space-y-2">
                {title && <h3 className="text-xl font-semibold">{title}</h3>}
                {description && <p className="text-xs">{description}</p>}
            </div>
        </div>
    )
}
