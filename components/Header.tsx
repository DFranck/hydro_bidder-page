"use client"

import { useIsDocumentScrolled } from "@/lib/useIsDocumentScrolled"
import Image from "next/image"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import Navigation from "./Navigation"

export const Header = () => {
    const isScrolled = useIsDocumentScrolled()

    return (
        <div
            className="
                sticky
                left-0
                right-0
                top-0
                z-50
            "
        >
            <div
                className={twMerge(
                    `
                        font-mono
                        mx-auto
                        w-full
                        max-w-7xl
                        items-center
                        justify-between
                        border-b
                        border-palette-beige
                        bg-black
                        px-6
                        text-sm
                        transition-all
                        duration-1000
                        lg:flex
                        lg:px-12
                    `,
                    isScrolled
                        ? `
                            py-1
                        `
                        : `
                            py-3
                        `
                )}
            >
                <div
                    className={twMerge(
                        `
                            relative
                            transition-all
                            duration-1000
                        `,
                        isScrolled
                            ? `
                                h-8
                                w-40
                            `
                            : `
                                h-12
                                w-56
                            `
                    )}
                >
                    <Link href={"/"}>
                        <Image
                            src={"/images/logo.svg"}
                            alt="twitter"
                            fill={true}
                        />
                    </Link>
                </div>
                <div className="flex flex-row items-center justify-between gap-6">
                    {/* <Suspense fallback={<div>Loading...</div>}> */}
                    <Navigation />
                    {/* </Suspense> */}
                </div>
            </div>
            <div
                className={twMerge(
                    `
                        mb-12
                        bg-palette-green
                        px-24
                        text-center
                        text-palette-text
                        transition-all
                        duration-1000
                    `,
                    isScrolled
                        ? `
                            py-1.5
                            text-xs
                        `
                        : `
                            py-2
                            text-sm
                        `
                )}
            >
                <strong>Lock ATOM to Vote</strong> • To partake in the voting,
                you’ll need to <strong>lock at least 0.001 ATOM</strong>. Don’t
                sweat it, you’ll still collect staking rewards!
            </div>
        </div>
    )
}
