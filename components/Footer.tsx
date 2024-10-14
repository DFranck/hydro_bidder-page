import { ContentContainer } from "@/components/ContentContainer"
import { ArrowUpRight, Globe, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const Footer = () => {
    return (
        <div className="bg-black">
            <ContentContainer
                className="
                    z-10
                    flex-row
                    items-center
                    justify-between
                    py-12
                    text-base
                    font-normal
                    italic
                    leading-[160%]
                    text-white/60
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

                <div className="flex items-center gap-1">
                    Built by{" "}
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
                    <span>Funded by the Cosmos Hub</span>
                    <a href="https://cosmos.network" target="_blank">
                        <Globe />
                    </a>
                    <a href="https://twitter.com/cosmoshub" target="_blank">
                        <Twitter />
                    </a>
                </div>
            </ContentContainer>
        </div>
    )
}
