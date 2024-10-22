import { ContentContainer } from "@/components/ContentContainer"
import { ArrowUpRight, Globe, Send, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const Footer = () => {
    return (
        <div className="bg-black">
            <ContentContainer
                className="
                    z-10
                    flex-col
                    items-center
                    justify-between
                    gap-1
                    py-6
                    text-base
                    font-normal
                    italic
                    leading-[160%]
                    text-white/60
                    md:flex-row
                "
            >
                <Link href={"/"}>
                    <Image
                        className="object-contain"
                        src={"/images/logo.svg"}
                        alt="Hydro Logo"
                        width={160}
                        height={35}
                    />
                </Link>

                <div className="flex items-center gap-1">
                    Built for the Cosmos Hub by{" "}
                    <a
                        className="
                            inline-flex
                            items-center
                            gap-1
                            underline
                            hover:text-white
                        "
                        href="https://informal.systems"
                        target="_blank"
                    >
                        <span>Informal Systems</span>
                        <ArrowUpRight />
                    </a>
                </div>

                <div
                    className="
                        flex
                        flex-row
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <a
                        href="https://cosmos.network"
                        target="_blank"
                        title="Cosmos Hub"
                    >
                        <Globe />
                    </a>
                    <a
                        href="https://twitter.com/cosmoshub"
                        target="_blank"
                        title="Twitter"
                    >
                        <Twitter />
                    </a>
                    <a
                        href="https://t.me/+xUzNOTZjUNw5Mzhk"
                        target="_blank"
                        title="Telegram"
                    >
                        <Send />
                    </a>
                </div>
            </ContentContainer>
        </div>
    )
}
