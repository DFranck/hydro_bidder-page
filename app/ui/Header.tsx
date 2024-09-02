'use client'
import Image from "next/image"
import { Wallet } from "@/components/wallet/Wallet"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import Navigation from "./Navigation"

export const Header = () => {
    return (
        <div className="max-w-[1440px] mx-auto bg-black p-[60px] z-10 w-full items-center justify-between font-mono text-sm lg:flex">
            <Image src={'/images/logo.svg'} alt='twitter' width={220} height={45} />
            <div className="flex flex-row items-center justify-between gap-6">
                <Navigation />
                <Wallet />
            </div>
        </div>
    )
}
