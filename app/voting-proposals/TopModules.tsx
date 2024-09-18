import { Timestamp } from "../ts_types/HydroBase.types"

export const ProposalListTopModules = ({
    lockedAtom,
    roundEnd,
    atomPrice,
}: {
    lockedAtom: number
    roundEnd?: Timestamp
    atomPrice: number
}) => {
    const bgColor =
        "bg-transparent bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]"
    return (
        <div className="flex flex-row justify-between bg-transparent">
            <div
                className={`flex w-[380px] h-[206px] flex-col shrink-0 p-6 rounded-[10px] ${bgColor}`}
            >
                <h3 className={`pb-4 text-white whitespace-pre-wrap`}>
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
            </div>
            <div
                className={`flex w-[380px] h-[206px] flex-col shrink-0 p-6 rounded-[10px] ${bgColor}`}
            >
                <h3 className={`pb-4 text-white whitespace-pre-wrap`}>
                    Current Round <br />
                    Time Remaining
                </h3>
                <p
                    className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}
                >
                    {roundEnd
                        ? (() => {
                              const now = new Date()
                              const end = new Date(parseInt(roundEnd) / 1e6)
                              const diff = end.getTime() - now.getTime()
                              const days = Math.floor(
                                  diff / (1000 * 60 * 60 * 24)
                              )
                              const hours = Math.floor(
                                  (diff % (1000 * 60 * 60 * 24)) /
                                      (1000 * 60 * 60)
                              )
                              return `${days}:${hours
                                  .toString()
                                  .padStart(2, "0")}`
                          })()
                        : "0:00"}
                </p>
                <p
                    className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}
                >
                    DAYS: HOURS
                </p>
            </div>
            <div
                className={`flex w-[380px] h-[206px] flex-col shrink-0 p-6 rounded-[10px] ${bgColor}`}
            >
                <h3 className={`pb-4 text-white whitespace-pre-wrap`}>
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
                    ${atomPrice * (lockedAtom / 1e6)} USDC Equivalent
                </p>
            </div>
        </div>
    )
}
