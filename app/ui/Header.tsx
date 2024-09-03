'use client'
import Image from "next/image"
import { Wallet } from "@/components/wallet/Wallet"
import Navigation from "./Navigation"
import { Suspense } from "react"

export const Header = () => {
    return (
        <div className="max-w-[1440px] mx-auto bg-black p-[60px] z-10 w-full items-center justify-between font-mono text-sm lg:flex">
            <Image src={'/images/logo.svg'} alt='twitter' width={220} height={45} />
            <div className="flex flex-row items-center justify-between gap-6">
                <Suspense fallback={<div>Loading...</div>}>
                    <Navigation />
                </Suspense>
                <Wallet />
            </div>
        </div>
    )
}
