"use client"

import { Wallet } from "@/components/wallet/Wallet"
import { cn } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { usePathname } from "next/navigation"

export default function Navigation() {
    const pathname = usePathname()
    const { isWalletConnected } = useChain("neutron")

    const navigationMenuTriggerStyle = (link: string) => {
        return cn(
            "text-white hover:text-[#FFE1B8] focus:text-[#FFE1B8] focus:bg-transparent text-sm font-medium leading-tight tracking-tight",

            pathname.startsWith(link) ? "text-[#FFE1B8]" : ""
        )
    }

    return (
        <nav>
            <div className="flex flex-row items-center justify-between gap-6">
                <a
                    href="/voting-proposals"
                    className={navigationMenuTriggerStyle("/voting-proposals")}
                >
                    Voting Proposals
                </a>
                <a
                    href="/deployed-proposals"
                    className={navigationMenuTriggerStyle(
                        "/deployed-proposals"
                    )}
                >
                    Deployed Proposals
                </a>
                <a
                    href="/dashboard"
                    className={cn(navigationMenuTriggerStyle("/dashboard"), !isWalletConnected ? "pointer-events-none opacity-50" : "")}
                >
                    Dashboard
                </a>
                <Wallet />
            </div>
        </nav>
    )
}
