import Image from "next/image"
import Link from "next/link"

export const Footer = () => {
    return (
        <div className="font-mono z-10 w-full items-center justify-between bg-black px-[60px] py-[33px] text-sm lg:flex">
            <Link href={"/"}>
                <Image
                    src={"/images/logo.svg"}
                    alt="twitter"
                    width={220}
                    height={45}
                />
            </Link>
            <div className="flex flex-row items-center justify-between gap-5">
                <p className="text-right text-base font-normal italic leading-[160%] text-[rgba(255,255,255,0.60)]">
                    Built by Informal Systems
                </p>
                <div className="flex flex-row items-center justify-between gap-4">
                    <Image
                        src={"/images/logo-twitter.svg"}
                        alt="twitter"
                        width={24}
                        height={24}
                    />
                    <Image
                        src={"/images/discord.svg"}
                        alt="twitter"
                        width={24}
                        height={24}
                    />
                    <Image
                        src={"/images/logo-youtube.svg"}
                        alt="twitter"
                        width={24}
                        height={24}
                    />
                </div>
            </div>
        </div>
    )
}
