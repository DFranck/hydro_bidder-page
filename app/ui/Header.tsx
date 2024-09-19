// "use client"
import Image from "next/image"
import Navigation from "./Navigation"
// import { Suspense } from "react"
import Link from "next/link"

export const Header = () => {
    return (
        <div className="max-w-7xl mx-auto bg-black pt-6 pb-3 mb-12 z-50 w-full items-center justify-between font-mono text-sm lg:flex border-b border-[#FFE1B8]">
            <Link href={"/"}>
                <Image
                    src={"/images/logo.svg"}
                    alt="twitter"
                    width={220}
                    height={45}
                />
            </Link>
            <div className="flex flex-row items-center justify-between gap-6">
                {/* <Suspense fallback={<div>Loading...</div>}> */}
                <Navigation />
                {/* </Suspense> */}
            </div>
        </div>
    )
}
