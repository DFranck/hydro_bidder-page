"use client"

import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { TooltipIcon } from "@/components/TooltipIcon"
import { Wallet } from "@/components/wallet/Wallet"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
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

    return (
        <nav>
            <div className="flex flex-row items-center justify-between gap-6">
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
                            Connect your wallet to access this feature
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
                <Wallet notifyConnectedCB={setIsConnected} />
            </div>
        </nav>
    )
}
