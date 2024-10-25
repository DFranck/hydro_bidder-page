import { ContentContainer } from "@/components/ContentContainer"
import { HorizontalDivider } from "@/components/HorizontalDivider"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import Image from "next/image"
import Link from "next/link"
import { twMerge } from "tailwind-merge"

const howHydroWorksTiles = [
    {
        title: "1. Connect Wallet",
        description:
            "Connect your Keplr wallet to Hydro to get started. You will need ATOM to pay for gas.",
        icon: "/images/Wallet_Light.svg",
    },
    {
        title: "2. Get Voting Power",
        description:
            "Use your staked ATOM to obtain Voting Power. You need at least 0.001 ATOM staked.",
        icon: "/images/Lock_Light.svg",
    },
    {
        title: "3. Vote for Projects",
        description:
            "Review the bids for liquidity and pick the project with the tribute you want to receive.",
        icon: "/images/Vote_Light.svg",
    },
    {
        title: "4. Earn Tributes",
        description:
            "Receive tributes once per round from projects in exchange for your voting power.",
        icon: "/images/Rewards_Light.svg",
    },
    {
        title: "5. Rinse and Repeat",
        description:
            "Continue to vote in new rounds to  earn more tributes from projects on Hydro.",
        icon: "/images/Renew_Light.svg",
    },
    {
        title: "6. Renew  Lockups",
        description:
            "Optionally increase your voting power by extending or creating new ATOM lockups.",
        icon: "/images/Repeat_Light.svg",
    },
]

const benefitsCheckList = [
    "Stake ATOM",
    "Lock your staked ATOM",
    "Vote for projects",
    "Receive tributes",
]

const howItWorksForProjectsTiles = [
    {
        title: "Submit Your Bid",
        description:
            "Get your project approved to participate in the auction process",
        icon: "/images/Graphic_List.svg",
    },
    {
        title: "Add a Tribute",
        description:
            "Your tribute will incentivize ATOM holders to vote on your bid",
        icon: "/images/Graphic_Offer.svg",
    },
    {
        title: "Receive Liquidity",
        description:
            "Hydro deploys liquidity to your protocol for the duration of bid",
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
                className={`
                    z-10
                    my-12
                    grid
                    gap-16
                    md:grid-cols-3
                `}
            >
                {data.tiles.map((tile, index) => {
                    return (
                        <div
                            key={index}
                            className={twMerge(
                                `
                                    flex
                                    shrink-0
                                    flex-col
                                    items-center
                                    gap-4
                                    rounded-[10px]
                                    text-center
                                `
                            )}
                        >
                            <Image
                                className={
                                    data.size === "small" ? "-mr-6" : "-mr-10"
                                }
                                src={tile.icon}
                                alt={tile.title}
                                width={data.size === "small" ? 100 : 220}
                                height={data.size === "small" ? 100 : 220}
                            />
                            <StyledText as="h3" variant="h3">
                                {tile.title}
                            </StyledText>
                            <p
                                className="
                                    text-balance
                                    text-base
                                    font-normal
                                    leading-[30px]
                                "
                            >
                                {tile.description.replace(
                                    /[ ]([^ ]+?)$/gm,
                                    `${String.fromCharCode(160)}$1`
                                )}
                            </p>
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderBenefits = () => {
        return (
            <div
                className="
                "
            >
                {benefitsCheckList.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="
                                flex
                                shrink-0
                                flex-row
                                items-center
                                gap-4
                                rounded-[10px]
                            "
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
                            <p
                                className="
                                    text-lg
                                    font-normal
                                "
                            >
                                {item}
                            </p>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <main
            className="
                flex
                min-h-screen
                w-full
                flex-col
                overflow-hidden
            "
        >
            <div
                className="
                    bg-gradient-to-t
                    from-palette-text
                    via-transparent
                    to-transparent
                "
            >
                <ContentContainer
                    className="
                        relative
                        z-10
                        min-h-[70vh]
                        justify-center
                        gap-6
                    "
                >
                    <div
                        className="
                            max-w-[64ch]
                            space-y-6
                        "
                    >
                        <StyledText as="h1" variant="h1">
                            Get More From{" "}
                            <span className="sm:whitespace-nowrap">
                                Your ATOM
                            </span>
                        </StyledText>
                        <p
                            className="
                                text-balance
                                text-xl
                                font-normal
                            "
                        >
                            An opportunity for Cosmos Hub stakers to earn yield
                            on top of their staking rewards. Lock your staked
                            ATOM, vote, and allocate liquidity across{" "}
                            <span className="whitespace-nowrap">
                                the Interchain.
                            </span>
                        </p>
                    </div>

                    <StyledText
                        as={Link}
                        href="/lock-atom"
                        variant="button.primary.large"
                    >
                        Get started
                    </StyledText>
                </ContentContainer>
            </div>

            <div className="bg-palette-text">
                <HorizontalDivider />

                <ContentContainer
                    className="
                        z-10
                        items-center
                        gap-12
                        py-20
                        text-center
                        lg:py-40
                    "
                >
                    <StyledText as="h2" variant="h2">
                        How Hydro Works
                    </StyledText>
                    {renderTiles({
                        tiles: howHydroWorksTiles,
                        size: "small",
                    })}
                    <StyledText
                        as="a"
                        variant="button.primary.large"
                        href="/lock-atom"
                    >
                        Get Started
                    </StyledText>
                </ContentContainer>

                <HorizontalDivider />

                <ContentContainer>
                    <div
                        className="
                            grid
                            items-center
                            gap-6
                            py-20
                            text-left
                            lg:grid-cols-2
                            lg:py-40
                        "
                    >
                        <div
                            className="
                                space-y-6
                            "
                        >
                            <div className="space-y-2">
                                <StyledText as="div" variant="superHeading">
                                    For Voters
                                </StyledText>
                                <StyledText as="h2" variant="h2">
                                    Earn Yield On Top of the{" "}
                                    <span className="sm:whitespace-nowrap">
                                        Staking APR
                                    </span>
                                </StyledText>
                            </div>
                            <div
                                className="
                                    text-balance
                                    text-lg
                                "
                            >
                                Hydro gives ATOM stakers the opportunity to
                                allocate the Hub&rsquo;s liquidity by voting on
                                bids submitted by projects, and receive tributes
                                for{" "}
                                <span className="whitespace-nowrap">
                                    their support.
                                </span>
                            </div>
                            {renderBenefits()}
                            <div className="flex gap-6">
                                <StyledText
                                    as="a"
                                    variant="button.primary.large"
                                    href="/lock-atom"
                                >
                                    Get Started
                                </StyledText>
                                <StyledText
                                    as="a"
                                    variant="button.secondary.large"
                                    href="/docs/users/calculating-staking-apr"
                                    target="_blank"
                                >
                                    Learn More
                                    <Icon name="solid:arrow-up-right" />
                                </StyledText>
                            </div>
                        </div>
                        <Image
                            className="mix-blend-screen"
                            src="/images/side-image-dots.png"
                            alt="Hydro"
                            width={800}
                            height={800}
                        />
                    </div>
                </ContentContainer>

                <HorizontalDivider />
            </div>

            <div
                className="
                    bg-gradient-to-b
                    from-palette-text
                    to-[#0B1C45]
                "
            >
                <ContentContainer
                    className="
                        items-center
                        space-y-6
                        py-20
                        lg:py-40
                    "
                >
                    <div className="space-y-2 text-center">
                        <StyledText as="div" variant="superHeading">
                            for projects
                        </StyledText>
                        <StyledText as="h2" variant="h2">
                            Get Liquidity from the Hub
                        </StyledText>
                    </div>
                    <p
                        className="
                            max-w-[64ch]
                            text-balance
                            text-center
                            text-xl
                            font-normal
                            leading-[30px]
                            text-white
                        "
                    >
                        Hydro allocates liquidity through sequential rounds in
                        which projects attract user votes through the
                        distribution of tributes.{" "}
                        <StyledText
                            as="a"
                            className="flex items-center gap-1"
                            variant="link"
                            href="/docs"
                            target="_blank"
                        >
                            Learn more
                            <Icon name="solid:arrow-up-right" />
                        </StyledText>
                    </p>

                    <div>
                        {renderTiles({
                            tiles: howItWorksForProjectsTiles,
                            size: "large",
                        })}
                    </div>

                    <div
                        className="
                            flex
                            gap-6
                        "
                    >
                        <StyledText
                            as="a"
                            variant="button.primary.large"
                            href="https://calendly.com/milos-informal/30-minute-meeting-hydro"
                            target="_blank"
                        >
                            Get in Touch <Icon name="solid:arrow-up-right" />
                        </StyledText>
                        <StyledText
                            as="a"
                            variant="button.secondary.large"
                            href="/docs/projects/whitelisting"
                            target="_blank"
                        >
                            Learn More <Icon name="solid:arrow-up-right" />
                        </StyledText>
                    </div>
                </ContentContainer>
            </div>
        </main>
    )
}
