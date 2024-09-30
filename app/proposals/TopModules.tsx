"use client"

import { useProposalsContext } from "@/app/proposals/context"
import { TopCard } from "@/components/TopCard"
import { Timestamp } from "../ts_types/HydroBase.types"
import { LockupPeriod, topLineAPR } from "@/lib/utils"
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
    } = useProposalsContext()

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
                grid
                grid-cols-1
                justify-between
                gap-6
                bg-transparent
                lg:grid-cols-4
            "
        >
            <TopCard
                title="Total Rewards"
                label="USD Equivalent"
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
            />

            <TopCard
                title={<>Total Locked&nbsp;ATOM</>}
                label={
                    <>
                        {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                        }).format(atomPrice * (totalLockedTokens / 1e6))}{" "}
                        USD Equivalent
                    </>
                }
                value={(totalLockedTokens / 1e6).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                })}
            />

            <TopCard
                title="Reward per ATOM"
                label="USD Equivalent"
                value={(
                    totalTributeValue /
                    (totalLockedTokens / 1e6)
                ).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                })}
            />

            {/* <TopCard
                title="APR"
                label="Incl. Staking APR"
                value={lowTopLineAPR.toLocaleString("en-US", {
                    style: "percent",
                })}
            /> */}

            <TopCard
                title="Time Remaining"
                label={`In Round ${currentRound}`}
                value={
                    currentRoundEnd ? getRoundEndText(currentRoundEnd) : "0:00"
                }
            />
        </div>
    )
}
