// "use client"
import Image from "next/image"
import Navigation from "./Navigation"
// import { Suspense } from "react"
import Link from "next/link"

export const Header = () => {
    return (
        <>
            <div
                className="
                    max-w-7xl
                    mx-auto
                    bg-black
                    px-6
                    py-3
                    z-50
                    w-full
                    items-center
                    justify-between
                    font-mono
                    text-sm
                    border-b
                    border-[#FFE1B8]
                    lg:flex
                    lg:px-12
                "
            >
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
            <div
                className="
                    bg-palette-green
                    text-palette-text
                    text-center
                    text-sm
                    py-2
                    px-24
                    mb-12
                "
            >
                <strong>Lock ATOM to Vote</strong> • To partake in the voting,
                you’ll need to <strong>lock at least 0.001 ATOM</strong>. Don’t
                sweat it, you’ll still collect staking rewards!
            </div>
        </>
    )
}
