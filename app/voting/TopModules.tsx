"use client"

import { useVotingContext } from "@/app/voting/context"
import { TooltipIcon } from "@/components/TooltipIcon"
import { TopCard } from "@/components/TopCard"
import { ArrowUpRight } from "lucide-react"
import { Timestamp } from "../ts_types/HydroBase.types"
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
        globalState: { totalLockedTokens, currentRound },
        currentRoundEnd,
        currentProposalTributes,
        currentProposalTranches,
    } = useVotingContext()

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

    const atomPrice =
        assetListWithPrices.get(
            "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
        )?.priceUsd ?? 0

    // TODO: Commenting this out until we can get to the bottom of APR
    // Calculate APR inputs for each proposal in each tranche
    // const APRinputs = Array.from(currentProposalTranches).reduce(
    //     (acc, [trancheId, proposals]) => {
    //         // For each tranche, map its proposals to their APR input data
    //         acc.set(
    //             trancheId,
    //             proposals.map((proposal) => {
    //                 // Get the tributes for this proposal
    //                 const proposalTributes = currentProposalTributes.get(
    //                     proposal.proposal_id
    //                 )!

    //                 // Calculate the total tribute value in USD for this proposal
    //                 const proposalTotalTribute = proposalTributes.reduce(
    //                     (acc, tribute) => {
    //                         const assetInfo = assetListWithPrices.get(
    //                             tribute.funds.denom
    //                         )
    //                         if (assetInfo) {
    //                             // Convert tribute amount to USD
    //                             acc +=
    //                                 (parseInt(tribute.funds.amount) /
    //                                     10 ** assetInfo.decimals) *
    //                                 (assetInfo.priceUsd ?? 0)
    //                         }
    //                         return acc
    //                     },
    //                     0
    //                 )

    //                 // Return the APR input data for this proposal
    //                 return {
    //                     proposalTotalTribute,
    //                     proposalPower: Number(proposal.power),
    //                 }
    //             })
    //         )

    //         return acc
    //     },
    //     // Initialize the accumulator as a Map
    //     new Map<
    //         number,
    //         { proposalTotalTribute: number; proposalPower: number }[]
    //     >()
    // )

    // const lowTopLineAPR = topLineAPR(
    //     APRinputs,
    //     LockupPeriod.ONE_EPOCH,
    //     atomPrice,
    //     0
    // )

    // const highTopLineAPR = topLineAPR(
    //     APRinputs,
    //     LockupPeriod.THREE_EPOCHS,
    //     atomPrice,
    //     0
    // )

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
                                Hydro voters during the current active round.
                            </p>

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
            {/* <TopCard
                title="Total Rewards"
                label="USD Equivalent *"
                value={
                    totalTributeValue > 1000
                        ? totalTributeValue.toLocaleString("en-US", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "USD",
                          })
                        : totalTributeValue.toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                              style: "currency",
                              currency: "USD",
                          })
                }
            /> */}
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
            {/* <TopCard
                title={<>Your Locked&nbsp;ATOM</>}
                label={
                    <>
                        {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                        }).format(atomPrice * (totalLockedTokens / 1e6))}{" "}
                        USD Equivalent *
                    </>
                }
                value={(totalLockedTokens / 1e6).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                })}
            /> */}

            {/* <TopCard
                title="APR"
                label="Incl. Staking APR"
                value={lowTopLineAPR.toLocaleString("en-US", {
                    style: "percent",
                })}
            /> */}
        </div>
    )
}
