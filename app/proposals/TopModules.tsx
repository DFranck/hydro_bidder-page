import { Timestamp } from "../ts_types/HydroBase.types"

const getRoundEndText = (roundEnd: Timestamp) => {
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

export const ProposalListTopModules = ({
    lockedAtom,
    roundEnd,
    atomPrice,
    roundNumber,
}: {
    lockedAtom: number
    roundEnd?: Timestamp
    atomPrice: number
    roundNumber: number
}) => {
    const bgColor =
        "bg-transparent bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]"

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 justify-between bg-transparent">
            {/* <div className={`flex flex-col p-6 rounded-xl ${bgColor}`}>
                <h3
                    className={`pb-4 text-white whitespace-pre-wrap text-2xl lg:text-4xl`}
                >
                    Current Round <br />
                    Tribute Value
                </h3>
                <p
                    className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}
                >
                    {(12345.67).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "USD",
                    })}
                </p>
                <p
                    className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}
                >
                    USDC EQUIVALENT
                </p>
            </div> */}
            <div className={`flex flex-col p-6 rounded-xl ${bgColor}`}>
                <h3
                    className={`pb-4 text-white whitespace-pre-wrap text-2xl lg:text-4xl`}
                >
                    Time Remaining in Round {roundNumber}
                </h3>
                <p
                    className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}
                >
                    {roundEnd ? getRoundEndText(roundEnd) : "0:00"}
                </p>
                <p
                    className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}
                >
                    time remaining
                </p>
            </div>
            <div className={`flex flex-col p-6 rounded-xl ${bgColor}`}>
                <h3
                    className={`pb-4 text-white whitespace-pre-wrap text-2xl lg:text-4xl`}
                >
                    Total Locked
                    <br />
                    ATOM
                </h3>
                <p
                    className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}
                >
                    {(lockedAtom / 1e6).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                    })}
                </p>
                <p
                    className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}
                >
                    {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(atomPrice * (lockedAtom / 1e6))}{" "}
                    USDC Equivalent
                </p>
            </div>
        </div>
    )
}
