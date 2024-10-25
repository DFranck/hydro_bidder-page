"use client"

import { useAppContext } from "@/app/context"
import { Timestamp } from "@/app/ts_types/HydroBase.types"
import { TooltipIcon } from "@/components/TooltipIcon"
import { TopCard } from "@/components/TopCard"
import { ArrowUpRight } from "lucide-react"

export const getRoundEndText = (roundEnd: Timestamp) => {
    const now = new Date()
    const end = new Date(parseInt(roundEnd) / 1e6)
    const diff = end.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""}`
    } else {
        return `${hours} hour${hours > 1 ? "s" : ""}`
    }
}

export function ProposalListTopModules() {
    const {
        assetListWithPrices,
        globalState: { atomPrice, totalLockedTokens, currentRound },
        currentRoundEnd,
        currentProposalTributes,
    } = useAppContext()

    // Calculate total tribute value
    const totalTributeValue = Array.from(currentProposalTributes.values())
        .flat() // Flatten all tributes across all proposals
        .reduce((total, tribute) => {
            // Calculate the value of this tribute in USD
            // If the asset is not found in the price list or has no price, its value is considered 0
            const assetEntry = assetListWithPrices.get(tribute.funds.denom)
            const assetPrice = assetEntry?.priceUsd ?? 0
            const assetDecimals = assetEntry?.decimals ?? 0
            // Calculate the value of this tribute and add it to the total
            // Convert the amount to a float, divide by 10^decimals, and multiply by the price
            return (
                total +
                (parseFloat(tribute.funds.amount) / 10 ** assetDecimals) *
                    assetPrice
            )
        }, 0)

    return (
        <div
            className="
                relative
                grid
                grid-cols-1
                justify-between
                gap-6
                bg-transparent
                md:grid-cols-3
            "
        >
            <TopCard
                title={
                    <div className="flex items-center gap-1">
                        Average APR
                        <TooltipIcon classNamesForTooltip="flex flex-col gap-2">
                            <p>
                                This number is the average APR available to
                                Hydro voters during the current active round. It
                                includes the regular Cosmos Hub staking APR
                                which Hydro lockers continue to receive
                                automatically.
                            </p>

                            <a
                                href="/docs/users/calculating-staking-apr"
                                className="inline-flex gap-1 text-palette-green underline"
                                target="_blank"
                            >
                                Learn More
                                <ArrowUpRight className="size-4" />
                            </a>
                        </TooltipIcon>
                    </div>
                }
                label={`Pilot Round ${currentRound}`}
                value={(
                    (totalTributeValue /
                        (totalLockedTokens / 1e6) /
                        atomPrice) *
                    12
                ).toLocaleString("en-US", {
                    style: "percent",
                })}
            />
            <TopCard
                title={
                    <div className="flex items-center gap-1">
                        Historical APR
                        <TooltipIcon classNamesForTooltip="flex flex-col gap-2">
                            <p>Historical APRs based on</p>

                            <ul>
                                {[1, 3, 12].map((months) => (
                                    <li
                                        key={months}
                                        className="flex items-center justify-between"
                                    >
                                        <span>
                                            Last{" "}
                                            <strong>
                                                {months} month
                                                {months > 1 ? "s" : ""}:
                                            </strong>
                                        </span>{" "}
                                        <span>-%</span>
                                    </li>
                                ))}
                            </ul>

                            <p>
                                <a
                                    href="/docs/users/calculating-staking-apr"
                                    className="inline-flex gap-1 text-palette-green underline"
                                    target="_blank"
                                >
                                    Learn More
                                    <ArrowUpRight className="size-4" />
                                </a>
                            </p>
                        </TooltipIcon>
                    </div>
                }
                label="No historical data yet"
                value="–%"
            />
            <TopCard
                title={
                    <div className="flex items-center gap-1">
                        Remaining
                        <TooltipIcon>
                            Number of days until the round ends. Users must vote
                            before the end of the round to receive tributes.{" "}
                            <a
                                href="/docs/users/voting-for-projects"
                                className="inline-flex gap-1 text-palette-green underline"
                                target="_blank"
                            >
                                Learn More
                                <ArrowUpRight className="size-4" />
                            </a>
                        </TooltipIcon>
                    </div>
                }
                label={`Pilot Round ${currentRound}`}
                value={
                    currentRoundEnd ? getRoundEndText(currentRoundEnd) : "0:00"
                }
            />
        </div>
    )
}
