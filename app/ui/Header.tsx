'use client'
import Image from "next/image"
import { NaviBurger } from "./NaviBurger"
import { Wallet } from "@/components/wallet/Wallet"

export const Header = () => {
    return (
        <div className="bg-black p-[60px] z-10 w-full items-center justify-between font-mono text-sm lg:flex">
            <Image src={'/images/logo.svg'} alt='twitter' width={220} height={45} />
            <div className="flex flex-row items-center justify-between gap-6">
                <Wallet />
                <NaviBurger />
            </div>
        </div>
    )
}