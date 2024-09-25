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
              px-6
              py-3
              rounded-xl
              bg-transparent
              bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]
            "
        >
            <h3
                className="
                    text-white
                    whitespace-pre-wrap
                    text-xl
                    lg:text-2xl
                    order-2
                "
            >
                {title}
            </h3>
            <var
                className="
                    text-palette-beige
                    text-5xl
                    not-italic
                    font-bold
                    leading-[124.7%]
                    tracking-[-1.296px]
                    order-1
                    slashed-zero
                "
            >
                {value}
            </var>
            <p
                className="
                    text-palette-beige
                    slashed-zero
                    text-base
                    not-italic
                    font-medium
                    leading-[130%]
                    uppercase
                    order-3
                "
            >
                {label}
            </p>
        </div>
    )
}

export function ProposalListTopModules({
    lockedAtom,
    trancheValue,
    roundEnd,
    atomPrice,
    roundNumber,
}: {
    lockedAtom: number
    trancheValue: number
    roundEnd?: Timestamp
    atomPrice: number
    roundNumber: number
}) {
    return (
        <div
            className="
                grid
                grid-cols-1
                lg:grid-cols-3
                gap-6
                justify-between
                bg-transparent
            "
        >
            <Card
                title={<>Current Round Tribute&nbsp;Value</>}
                label="USDC Equivalent"
                value={
                    trancheValue > 1000
                        ? trancheValue.toLocaleString("en-US", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "USD",
                          })
                        : trancheValue.toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                              style: "currency",
                              currency: "USD",
                          })
                }
            />

            <Card
                title="Time Remaining"
                label={`In Round ${roundNumber}`}
                value={roundEnd ? getRoundEndText(roundEnd) : "0:00"}
            />

            <Card
                title={<>Total Locked&nbsp;ATOM</>}
                label={
                    <>
                        {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                        }).format(atomPrice * (lockedAtom / 1e6))}{" "}
                        USDC Equivalent
                    </>
                }
                value={(lockedAtom / 1e6).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                })}
            />
        </div>
    )
}
