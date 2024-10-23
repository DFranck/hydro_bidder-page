"use client"

import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { TooltipIcon } from "@/components/TooltipIcon"
import { Wallet } from "@/components/wallet/Wallet"
import { cn } from "@/lib/utils"
import { ArrowUpRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { twMerge } from "tailwind-merge"

export default function Navigation() {
    const pathname = usePathname()
    const [isConnected, setIsConnected] = useState<boolean>(false)

    const navigationMenuTriggerStyle = (link: string) => {
        return cn(
            "text-white hover:text-[#FFE1B8] focus:text-[#FFE1B8] focus:bg-transparent text-sm font-medium leading-tight tracking-tight",
            pathname?.startsWith(link) ? "text-[#FFE1B8]" : ""
        )
    }

    function blurActiveElement() {
        ;(document.activeElement as HTMLDivElement)?.blur()
    }

    return (
        <nav
            className="
                group/navbar
                z-50
                max-md:fixed
                max-md:right-0
                max-md:top-0
                max-md:h-12
                max-md:w-12
                max-md:overflow-hidden
                max-md:transition-all
                max-md:duration-500
                max-md:focus-within:size-auto
                max-md:focus-within:h-full
                max-md:focus-within:w-1/2
                md:relative
                md:overflow-auto
                md:bg-transparent
            "
            tabIndex={0}
        >
            <button
                className="
                    fixed
                    right-0
                    top-0
                    z-50
                    flex
                    size-12
                    cursor-pointer
                    transition-all
                    duration-500
                    group-focus-within/navbar:rotate-180
                    md:hidden
                "
            >
                <span
                    className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        opacity-100
                        transition-all
                        duration-500
                        group-focus-within/navbar:opacity-0
                    "
                >
                    <Menu size={24} />
                </span>
                <span
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        opacity-0
                        transition-all
                        duration-500
                        group-focus-within/navbar:pointer-events-auto
                        group-focus-within/navbar:opacity-100
                    "
                    onClick={blurActiveElement}
                >
                    <X size={24} />
                </span>
            </button>

            <div
                className="
                    pointer-events-none
                    fixed
                    inset-0
                    z-10
                    bg-palette-text/20
                    opacity-0
                    backdrop-blur-md
                    transition-all
                    duration-500
                    group-focus-within/navbar:pointer-events-auto
                    group-focus-within/navbar:opacity-100
                    md:hidden
                "
                onClick={blurActiveElement}
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-20
                    bg-palette-blue/80
                    opacity-0
                    transition-all
                    duration-500
                    group-focus-within/navbar:opacity-100
                    md:hidden
                "
            />

            <div
                className="
                    relative
                    z-30
                    flex
                    flex-col
                    items-center
                    justify-between
                    gap-6
                    max-md:py-12
                    max-md:indent-96
                    max-md:transition-all
                    max-md:duration-500
                    max-md:group-focus-within/navbar:indent-0
                    md:flex-row
                "
                onClick={blurActiveElement}
            >
                <Link
                    href="/docs"
                    target="_blank"
                    className={twMerge(
                        navigationMenuTriggerStyle("/docs"),
                        `flex items-center gap-1`
                    )}
                >
                    Docs <ArrowUpRight size={16} />
                </Link>

                <Link
                    href="/voting"
                    className={navigationMenuTriggerStyle("/voting")}
                >
                    Voting
                </Link>

                <ConditionalWrapper
                    condition={!isConnected}
                    wrapper={(children) => (
                        <TooltipIcon icon={children}>
                            Hydro is currently in view-only mode.{" "}
                            <a
                                href="/docs"
                                target="_blank"
                                className="inline-flex items-center gap-1 font-bold text-palette-green underline"
                            >
                                Learn More <ArrowUpRight size={16} />
                            </a>
                        </TooltipIcon>
                    )}
                >
                    <Link
                        href="/lockups"
                        className={twMerge(
                            navigationMenuTriggerStyle("/lockups"),
                            !isConnected && "pointer-events-none opacity-60"
                        )}
                    >
                        Lockups
                    </Link>
                </ConditionalWrapper>

                <TooltipIcon
                    icon={
                        <Link
                            href="/rewards"
                            className={twMerge(
                                navigationMenuTriggerStyle("/rewards"),
                                `pointer-events-none opacity-60`
                            )}
                        >
                            Rewards
                        </Link>
                    }
                >
                    Rewards will show here at the end of the first pilot round
                </TooltipIcon>

                <TooltipIcon
                    icon={
                        <Link
                            href="/exports"
                            className={twMerge(
                                navigationMenuTriggerStyle("/rewards"),
                                `pointer-events-none opacity-60`
                            )}
                        >
                            Exports
                        </Link>
                    }
                >
                    Performance metrics of liquidity deployments will be shown
                    here.
                </TooltipIcon>

                <TooltipIcon
                    icon={
                        <div className="pointer-events-none opacity-60">
                            <Wallet notifyConnectedCB={setIsConnected} />
                        </div>
                    }
                    classNamesForTooltip="-ml-12"
                >
                    Hydro is currently in view-only mode.{" "}
                    <a
                        href="/docs"
                        target="_blank"
                        className="inline-flex items-center gap-1 font-bold text-palette-green underline"
                    >
                        Learn More <ArrowUpRight size={16} />
                    </a>
                </TooltipIcon>
            </div>
        </nav>
    )
}
