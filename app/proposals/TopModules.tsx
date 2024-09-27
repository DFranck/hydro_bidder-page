"use client"

import { useProposalsContext } from "@/app/proposals/context"
import { Timestamp } from "../ts_types/HydroBase.types"
import { TopCard } from "@/components/TopCard"

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
        totalTributeValue,
        atomPrice,
        globalState: { totalLockedTokens, currentRound },
        currentRoundEnd,
    } = useProposalsContext()

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
            <TopCard
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

            <TopCard
                title="Time Remaining"
                label={`In Round ${currentRound}`}
                value={
                    currentRoundEnd ? getRoundEndText(currentRoundEnd) : "0:00"
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
