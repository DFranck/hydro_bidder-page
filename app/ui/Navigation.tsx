import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useChain } from "@cosmos-kit/react";
import Image from "next/image";
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation";

export default function Navigation() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');
    const { isWalletConnected } = useChain("cosmoshubtestnet");


    const getHrefIfConnected = (link: string) => {

        if (isWalletConnected) {
            return link
        }
        return "javascript:;";
    }

    const navigationMenuTriggerStyle = (link: string) => `text-[#FFE1B8] hover:text-[#FFE1B8] focus:text-[#FFE1B8] focus:bg-transparent text-sm not-italic font-medium leading-10 tracking-[0.07px] ${pathname === link ? 'underline' : ''} bg-transparent hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent`;
    const navigationSubMenuTriggerStyle = (param: string) => `text-[${isWalletConnected ? '#FFE1B8' : '#646464'}] hover:text-[${isWalletConnected ? '#FFE1B8' : '#646464'}] focus:text-[${isWalletConnected ? '#FFE1B8' : '#646464'}] focus:bg-transparent text-sm not-italic font-medium leading-10 tracking-[0.07px] ${tab === param ? 'underline' : ''} bg-transparent hover:bg-transparent`;
    return (
        <NavigationMenu style={{ fontFamily: 'Inter' }}>
            <NavigationMenuList className="flex flex-row items-center justify-between gap-6">
                <NavigationMenuItem>
                    <Link href="/active-proposals" legacyBehavior passHref aria-disabled={true}>
                        <NavigationMenuLink className={navigationMenuTriggerStyle("/active-proposals")}>
                            Vote: Active Proposals
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/deployed-liquidity" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle("/deployed-liquidity")}>
                            Deployed Liquidity
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/dashboard" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle("/dashboard")}>
                            <div className="flex items-center">
                                <Image src={'/images/user.svg'} alt='user' width={16} height={16} className="mr-2" />
                                <span>Dashboard</span>
                            </div>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
