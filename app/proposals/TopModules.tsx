"use client"

import { useProposalsContext } from "@/app/proposals/context"
import { ReactNode } from "react"
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

function Card({
    title,
    value,
    label,
}: {
    title?: ReactNode
    value?: ReactNode
    label?: ReactNode
}) {
    return (
        <div
            className="
              flex
              flex-col
              rounded-xl
              bg-transparent
              bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]
              px-6
              py-3
            "
        >
            <h3
                className="
                    order-2
                    whitespace-pre-wrap
                    text-xl
                    text-white
                    lg:text-2xl
                "
            >
                {title}
            </h3>
            <var
                className="
                    order-1
                    text-5xl
                    font-bold
                    not-italic
                    slashed-zero
                    leading-[124.7%]
                    tracking-[-1.296px]
                    text-palette-beige
                "
            >
                {value}
            </var>
            <p
                className="
                    order-3
                    text-base
                    font-medium
                    uppercase
                    not-italic
                    slashed-zero
                    leading-[130%]
                    text-palette-beige
                "
            >
                {label}
            </p>
        </div>
    )
}

export function ProposalListTopModules() {
    const {
        globalState: { totalLockedTokens, currentRound },
        currentRoundEnd,
        currentProposalTributes,
        assetListWithPrices,
    } = useProposalsContext()

    // Calculate total tribute value
    const totalTributeValue = Array.from(currentProposalTributes.values())
        .flat() // Flatten all tributes across all proposals
        .reduce((total, tribute) => {
            // Calculate the value of this tribute in USD
            // If the asset is not found in the price list or has no price, its value is considered 0
            const assetEntry = assetListWithPrices.get(tribute.funds.denom);
            const assetPrice = assetEntry?.priceUsd ?? 0;
            const assetDecimals = assetEntry?.decimals ?? 0;
            // Calculate the value of this tribute and add it to the total
            // Convert the amount to a float, divide by 10^decimals, and multiply by the price
            return total + ((parseFloat(tribute.funds.amount) / 10 ** assetDecimals) * assetPrice);
        }, 0);

    const atomPrice = assetListWithPrices.get("ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9")?.priceUsd ?? 0;

    return (
        <div
            className="
                grid
                grid-cols-1
                justify-between
                gap-6
                bg-transparent
                lg:grid-cols-3
            "
        >
            <Card
                title={<>Current Round Tribute&nbsp;Value</>}
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

            <Card
                title="Time Remaining"
                label={`In Round ${currentRound}`}
                value={
                    currentRoundEnd ? getRoundEndText(currentRoundEnd) : "0:00"
                }
            />

            <Card
                title={<>Total Locked&nbsp;ATOM</>}
                label={
                    <>
                        {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                        }).format(atomPrice * (totalLockedTokens / 1e6))}{" "}
                        USDC Equivalent
                    </>
                }
                value={(totalLockedTokens / 1e6).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                })}
            />
        </div>
    )
}
