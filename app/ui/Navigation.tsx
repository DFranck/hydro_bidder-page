"use client"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useChain } from "@cosmos-kit/react"
import { usePathname } from "next/navigation"

export default function Navigation() {
    const pathname = usePathname()
    const { isWalletConnected } = useChain("cosmoshubtestnet")
    console.log(pathname)

    const navigationMenuTriggerStyle = (link: string) =>
        `text-white hover:text-[#FFE1B8] focus:text-[#FFE1B8] focus:bg-transparent text-sm font-medium leading-tight tracking-tight ${
            pathname.startsWith(link) ? "text-[#FFE1B8]" : ""
        } bg-transparent hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent`

    console.log("MYPATH", pathname)
    return (
        <NavigationMenu>
            <NavigationMenuList className="flex flex-row items-center justify-between gap-6">
                <NavigationMenuItem>
                    <NavigationMenuLink
                        className={navigationMenuTriggerStyle(
                            "/voting-proposals"
                        )}
                    >
                        Voting Proposals
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        className={navigationMenuTriggerStyle(
                            "/deployed-proposals"
                        )}
                    >
                        Deployed Proposals
                    </NavigationMenuLink>
                </NavigationMenuItem>
                {isWalletConnected && (
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle("/dashboard")}
                        >
                            Dashboard
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    )
}
