"use client"

import { CollapsibleBox } from "@/components/CollapsibleBox"
import { Icon } from "@/components/Icon"
import {
    ComponentProps,
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"
import { useIsClient } from "usehooks-ts"

interface ToastsProps extends ComponentProps<"div"> {}

const ToastContext = createContext(false)

const classNamesByVariant = {
    error: {
        container: "bg-palette-red",
        icon: <Icon name="regular:circle-exclamation" />,
    },
    success: {
        container: "bg-palette-green",
        icon: <Icon name="regular:circle-check" />,
    },
    info: {
        container: "bg-palette-blue",
        icon: <Icon name="regular:circle-info" />,
    },
    working: {
        container: "bg-palette-beige",
        icon: (
            <div className="inline-flex animate-spin">
                <Icon name="regular:loader" />
            </div>
        ),
    },
} satisfies Record<string, { container: string; icon: ReactNode }>

export function Toasts({ children, className, ...otherProps }: ToastsProps) {
    const isClient = useIsClient()

    if (!isClient) return null

    return createPortal(
        <ToastContext.Provider value={true}>
            <div
                className={twMerge(
                    `
                        group
                        fixed
                        inset-0
                        z-50
                        flex
                        w-96
                        flex-col-reverse
                        items-end
                        p-6
                        transition-opacity
                        [&:not(:has(.js-toast))]:pointer-events-none
                        [&:not(:has(.js-toast))]:opacity-0
                    `,
                    className
                )}
                {...otherProps}
            >
                <div
                    className="
                        from-accent-brand-500
                        pointer-events-none
                        absolute
                        bottom-0
                        left-0
                        right-0
                        -z-10
                        h-1/3
                        bg-gradient-to-tl
                        via-transparent
                        to-transparent
                    "
                />

                {children}
            </div>
        </ToastContext.Provider>,
        document.body
    )
}

Toasts.Toast = function Toast({
    children,
    className,
    variant = "info",
    ...otherProps
}: ComponentProps<"div"> & {
    variant?: "error" | "success" | "info" | "working"
}) {
    const isToastContext = useContext(ToastContext)
    const [isDismissed, setIsDismissed] = useState(false)

    function handleDismiss() {
        setIsDismissed(true)
    }

    return (
        <CollapsibleBox isCollapsed={isDismissed} {...otherProps}>
            <div
                className={twMerge(
                    `
                        mt-3
                        grid
                        grid-cols-[min-content,auto,min-content]
                        grid-rows-2
                        items-center
                        rounded-md
                        border-2
                        border-white/20
                        text-white
                    `,
                    !isDismissed && "js-toast",
                    classNamesByVariant[variant].container,
                    className
                )}
            >
                <div
                    className="
                        row-span-2
                        flex
                        h-full
                        flex-col
                        p-3
                        pr-0
                        text-2xl
                    "
                >
                    {classNamesByVariant[variant].icon}
                </div>

                <div
                    className="
                        row-span-2
                        p-3
                    "
                >
                    {children}
                </div>

                {isToastContext && (
                    <div
                        className="
                            row-span-2
                            grid
                            grid-rows-subgrid
                            overflow-hidden
                            rounded-r-md
                            border-l-2
                            border-white/20
                        "
                    >
                        <button
                            className="
                                row-span-2
                                px-3
                                bg-blend-overlay
                                hover:bg-black/10
                            "
                            onClick={handleDismiss}
                        >
                            Dismiss
                        </button>
                    </div>
                )}
            </div>
        </CollapsibleBox>
    )
}
