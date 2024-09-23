import Image from "next/image"
import { Button as MikaButton } from "@/components/Button"
import { HorizontalDivider } from "@/components/HorizontalDivider"
import { Newsletter } from "@/components/Newsletter"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const howHydroWorksTiles = [
    {
        title: "Connect Wallet",
        description: "Correct your compatible wallet to the Hydro platform.",
        icon: "/images/Wallet_Light.svg",
    },
    {
        title: "Lock stATOM",
        description: "Lock ATOM for your chosen duration to get Voting Power.",
        icon: "/images/Lock_Light.svg",
    },
    {
        title: "Vote",
        description:
            "Use your Voting Power to choose the best projects that need liquidity and are offering you rewards.",
        icon: "/images/Vote_Light.svg",
    },
    {
        title: "Earn Rewards",
        description:
            "Receive tribute each round from projects in exchange for providing them with liquidity.",
        icon: "/images/Rewards_Light.svg",
    },
    {
        title: "Renew and Top-up",
        description:
            "Sustain or increase your voting power by renewing or adding to your ATOM lockups.",
        icon: "/images/Renew_Light.svg",
    },
    {
        title: "Repeat",
        description:
            "Participate in new rounds and tranches to continue earning rewards from projects on the Hydro platform.",
        icon: "/images/Repeat_Light.svg",
    },
]

const benefitsCheckList = [
    "Participate in the growth of the Cosmos ecosystem",
    "Provide attractive rewards for your project supporters",
    "Access liquidity for your project",
    "Gain exposure and visibility within the Cosmos community",
]

const howItWorksForProjectsTiles = [
    {
        title: "Get Allowlisted",
        description:
            "Apply to get your project allowlisted on Hydro and start the process.",
        icon: "/images/Graphic_List.svg",
    },
    {
        title: "Offer Tribute",
        description:
            "Offer tribute to incentivize ATOM holders to support your project and provide liquidity.",
        icon: "/images/Graphic_Offer.svg",
    },
    {
        title: "Gain Voter Support",
        description:
            "Attract voter support and access liquidity to your project’s growth.",
        icon: "/images/Graphic_Vote.svg",
    },
]

type Tile = {
    title: string
    description: string
    icon: string
}

type TilesType = {
    tiles: Tile[]
    size: "small" | "large"
}

export default function Home() {
    const renderTiles = (data: TilesType) => {
        return (
            <div
                className={`grid grid-cols-3 gap-[60px] z-10 my-[60px] mx-[90px]`}
            >
                {data.tiles.map((tile, index) => {
                    return (
                        <div
                            key={index}
                            className={`flex w-[${
                                data.size === "small" ? "285px" : "330px"
                            }] flex-col items-start gap-4 shrink-0 ${
                                data.size === "small" ? "p-6" : ""
                            } rounded-[10px]`}
                        >
                            <Image
                                src={tile.icon}
                                alt={tile.title}
                                width={data.size === "small" ? 100 : 220}
                                height={data.size === "small" ? 100 : 220}
                            />
                            <h3>{tile.title}</h3>
                            <p className="text-xl font-normal leading-[30px]">
                                {tile.description}
                            </p>
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderBenefits = () => {
        return (
            <div className="">
                {benefitsCheckList.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="flex flex-row items-center gap-4 shrink-0 rounded-[10px]"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                            >
                                <g clipPath="url(#clip0_174_196)">
                                    <path
                                        d="M6.90602 16.948C6.67402 16.948 6.44002 16.86 6.26402 16.682L0.266023 10.694C-0.0899765 10.34 -0.0899765 9.76401 0.266023 9.40801C0.620023 9.05201 1.19602 9.05201 1.55202 9.40801L6.91002 14.758L18.452 3.31601C18.808 2.96201 19.384 2.96401 19.738 3.32201C20.092 3.67801 20.09 4.25401 19.732 4.60801L7.54802 16.688C7.37002 16.864 7.14002 16.952 6.90802 16.952L6.90602 16.948Z"
                                        fill="#FFE1B8"
                                    />
                                </g>
                            </svg>
                            <p className="text-lg font-normal">{item}</p>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <main className="w-full text-white flex min-h-screen flex-col bg-[#080815] overflow-hidden">
            <div className="relative h-screen">
                <div className="bg-cover absolute -top-[11%] bg-no-repeat bg-[url('/images/AdobeStock_633966567.png')] h-full w-screen"></div>
                <div className=" relative after:z-[0] after:content-[''] after:absolute after:shadow-[0_0px_120px_200px_#080815] after:pointer-events-none after:top-[760px] after:inset-x-0"></div>
                <div className="mx-auto max-w-7xl relative z-10">
                    <div className="max-w-6xl mx-auto h-[600px]">
                        <div className="mt-[155px]">
                            <h1 className="text-6xl font-bold leading-snug">
                                Unlock the Power of Hydro
                            </h1>
                        </div>
                        <p className="text-xl font-normal">
                            Hydro is a decentralized platform that allows you to
                            lock your ATOM tokens <br />
                            and earn rewards. Earn passive income, participate
                            in ICS projects, and more.
                        </p>
                        <Button
                            asChild
                            className="mt-12 capitalize w-36 h-14 rounded-xl text-lg font-normal"
                        >
                            <Link href="/lock-atom">Get started</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center">
                        <h2>How Hydro Works</h2>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-center text-white text-xl font-normal leading-[30px] z-[1] mt-[20px]">
                        Understand the step-by-step process of participating in
                        the Hydro ecosystem.
                    </div>
                    {renderTiles({
                        tiles: howHydroWorksTiles,
                        size: "small",
                    })}
                    <Button
                        asChild
                        className="mt-12 capitalize w-36 h-14 rounded-xl text-lg font-normal"
                    >
                        <Link href="/lock-atom">Get started</Link>
                    </Button>
                </div>
                <HorizontalDivider className="mt-[60px] mb-[150px]" />
                <div className="max-w-6xl mx-auto pb-44 flex lg:flex-row flex-col items-center">
                    <div>
                        <div className="max-w-3xl space-y-3">
                            <p className="text-[#FFE1B8] slashed-zero tracking-wide font-medium uppercase">
                                benefits
                            </p>
                            <h2>Unlock the Power of Liquidity</h2>
                            <div className="text-lg">
                                Hydro provides a unique opportunity to project
                                to access liquidity and gain exposure, while
                                rewarding ATOM holders for their participation.
                            </div>
                            {renderBenefits()}
                        </div>
                        <Button
                            asChild
                            className="mt-8 capitalize w-40 h-14 rounded-xl text-lg font-normal"
                        >
                            <Link href="/lock-atom">Get Allowlisted</Link>
                        </Button>
                    </div>
                    <div className="relative bg-[#080815]">
                        <div className="bg-white"></div>
                        <Image
                            className="mix-blend-screen"
                            src="/images/side-image-dots.png"
                            alt="Hydro"
                            width={800}
                            height={800}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-gradient-to-b from-[rgba(0,21,45,0.20)] to-[rgba(0,59,147,0.40)]">
                <div className="max-w-7xl mx-auto flex flex-col items-center ">
                    <p className="text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] tracking-[1.28px] uppercase mt-[210px]">
                        for projects
                    </p>
                    <h2 className="mt-[14px]">How it Works for Projects</h2>
                    <p className="w-[693px] text-center text-white text-xl font-normal leading-[30px] mt-5">
                        Hydro provides a unique opportunity for projects to
                        access liquidity and gain exposure, while rewarding ATOM
                        holders for their participation through a multi-step
                        process involving tribute auctions.
                    </p>
                    {renderTiles({
                        tiles: howItWorksForProjectsTiles,
                        size: "large",
                    })}
                    <div className="flex gap-5 mt-8 mb-44">
                        <Button
                            asChild
                            className="capitalize w-40 h-14 rounded-xl text-lg font-normal"
                        >
                            <Link href="/lock-atom">Get Allowlisted</Link>
                        </Button>
                        <Button
                            asChild
                            className="capitalize w-36 h-14 rounded-xl text-lg font-normal bg-transparent border text-white"
                        >
                            <Link href="/docs">Read Docs</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <Newsletter />
            <Footer />
        </main>
    )
}
