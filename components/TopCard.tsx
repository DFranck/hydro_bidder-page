import { Skeleton } from "@/components/Skeleton"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function TopCard({
    icon,
    isLoading,
    title,
    value,
    label,
}: {
    icon?: ReactNode
    isLoading?: boolean
    title?: ReactNode
    value?: ReactNode
    label?: ReactNode
}) {
    return (
        <div
            className={twMerge(
                `
                    w-full
                    rounded-xl
                    bg-gradient-to-t
                    from-palette-blue/80
                    to-palette-blue/20
                    px-6
                    py-3
                    backdrop-blur-sm
                `,
                icon &&
                    `
                        flex
                        items-center
                        gap-6
                    `
            )}
        >
            {icon && (
                <div
                    className="
                        relative
                        size-32
                    "
                >
                    {icon}
                </div>
            )}

            <div
                className="
                    flex
                    w-full
                    flex-col
                "
            >
                {(isLoading || title) && (
                    <h3
                        className="
                            relative
                            order-2
                            whitespace-pre-wrap
                            text-xl
                            text-white
                            lg:text-2xl
                        "
                    >
                        {isLoading ? <Skeleton /> : title}
                    </h3>
                )}
                {(isLoading || value) && (
                    <div
                        className="
                            relative
                            order-1
                            text-5xl
                            font-bold
                            not-italic
                            slashed-zero
                            leading-[124.7%]
                            tracking-[-1.296px]
                            text-palette-beige
                        "
                    >
                        {isLoading ? <Skeleton /> : value}
                    </div>
                )}
                {(isLoading || label) && (
                    <div
                        className="
                            relative
                            order-3
                            text-base
                            font-medium
                            uppercase
                            not-italic
                            slashed-zero
                            leading-[130%]
                            text-palette-beige
                        "
                    >
                        {isLoading ? <Skeleton /> : label}
                    </div>
                )}
            </div>
        </div>
    )
}
