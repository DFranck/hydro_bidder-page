"use client"

import { Info } from "lucide-react"
import {
    FocusEvent,
    MouseEvent,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"

export function TooltipIcon({
    children,
    classNamesForTooltip,
    icon,
}: {
    children: ReactNode
    classNamesForTooltip?: string
    icon?: ReactNode
}) {
    const [isClient, setIsClient] = useState(false)
    const [coords, setCoords] = useState({ x: 0, y: 0 })
    const [isOpen, setIsOpen] = useState(false)
    const timer = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    function updateCoords(element: HTMLDivElement) {
        const targetCoords = element.getBoundingClientRect()
        setCoords({
            x: targetCoords.x + targetCoords.width / 2,
            y:
                targetCoords.y +
                targetCoords.height +
                document.documentElement.scrollTop,
        })
    }

    function handleMouseEnter(event: MouseEvent<HTMLDivElement>) {
        if (timer.current) clearTimeout(timer.current)
        updateCoords(event.currentTarget)
        setIsOpen(true)
    }

    function handleMouseLeave() {
        timer.current = setTimeout(() => {
            setIsOpen(false)
        }, 200)
    }

    function handleFocus(event: FocusEvent<HTMLDivElement>) {
        if (timer.current) clearTimeout(timer.current)
        updateCoords(event.currentTarget)
        setIsOpen(true)
    }

    function handleBlur() {
        timer.current = setTimeout(() => {
            setIsOpen(false)
        }, 200)
    }

    return (
        <div
            className="
                group/tooltip
                relative
                z-10
                inline-block
                w-min
            "
            tabIndex={0}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            {icon ?? <Info className="inline-block" size={14} />}
            {createPortal(
                <div
                    className={twMerge(
                        `
                            pointer-events-none
                            absolute
                            left-1/2
                            z-50
                            mt-1
                            w-56
                            -translate-x-1/2
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
                            transition-opacity
                        `,
                        isOpen &&
                            `
                                pointer-events-auto
                                translate-y-0
                                opacity-100
                            `,
                        classNamesForTooltip
                    )}
                    style={{
                        top: coords.y,
                        left: coords.x,
                    }}
                >
                    {children}
                </div>,
                document.body
            )}
        </div>
    )
}
