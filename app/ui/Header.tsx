'use client'
import Image from "next/image"
import { Wallet } from "@/components/wallet/Wallet"
import Link from "next/link"
import { usePathname } from 'next/navigation'

export const Header = () => {
    return (
        <div className="max-w-[1440px] mx-auto bg-black p-[60px] z-10 w-full items-center justify-between font-mono text-sm lg:flex">
            <Image src={'/images/logo.svg'} alt='twitter' width={220} height={45} />
            <div className="flex flex-row items-center justify-between gap-6">
                <HeaderLinks />
                <Wallet />
            </div>
        </div>
    )
}

function HeaderLinks() {
    const pathname = usePathname();
    const config = [
        {
            title: 'Vote: Active Proposals',
            link: '/active-proposals'
        },
        {
            title: 'Deployed Liquidity',
            link: '/deployed-liquidity'
        },
        {
            title: 'Dashboard',
            link: '/dashboard'
        }
    ];

    return (
        <div className="flex flex-row items-center justify-between gap-6">
            {config.map((item) => (
                <Link
                    href={item.link}
                    key={item.title}
                    className={`text-[#FFE1B8] text-sm not-italic font-medium leading-5 tracking-[0.07px] ${pathname === item.link ? 'underline' : ''}`}
                >
                    {item.title}
                </Link>
            ))}
        </div>
    )
}