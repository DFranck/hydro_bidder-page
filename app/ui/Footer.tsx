import Image from "next/image"
import Link from "next/link"

export const Footer = () => {
    return (
        <div className="px-[60px] py-[33px] bg-[#303132] z-10 w-full items-center justify-between font-mono text-sm lg:flex">
            <Link href={'/'}>
                <Image src={'/images/logo.svg'} alt='twitter' width={220} height={45} />
            </Link>
            <div className="flex flex-row items-center justify-between gap-5">
                <p className="text-[rgba(255,255,255,0.60)] text-right text-base italic font-normal leading-[160%]">
                    Built by Informal Systems
                </p>
                <div className="flex flex-row items-center justify-between gap-4">
                    <Image src={'/images/logo-twitter.svg'} alt='twitter' width={24} height={24} />
                    <Image src={'/images/discord.svg'} alt='twitter' width={24} height={24} />
                    <Image src={'/images/logo-youtube.svg'} alt='twitter' width={24} height={24} />
                </div>
            </div>
        </div>
    )
}