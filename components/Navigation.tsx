"use client"

import { Wallet } from "@/components/wallet/Wallet"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

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
                    href="/proposals"
                    className={navigationMenuTriggerStyle("/proposals")}
                >
                    Proposals
                </Link>
                {/* <Link
                    href="/deployed-liquidity"
                    className={navigationMenuTriggerStyle(
                        "/deployed-liquidity"
                    )}
                >
                    Deployed Liquidity
                </Link> */}
                <Link
                    href="/dashboard"
                    className={cn(
                        navigationMenuTriggerStyle("/dashboard"),
                        !isConnected ? "pointer-events-none opacity-50" : ""
                    )}
                >
                    Dashboard
                </Link>
                <Wallet notifyConnectedCB={setIsConnected} />
            </div>
        </nav>
    )
}
