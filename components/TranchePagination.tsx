import { useProposalsContext } from "@/app/proposals/context"
import { VoteWithPower } from "@/app/ts_types/HydroBase.types"
import { ArrowLeft, CircleCheckBig, Clock } from "lucide-react"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function TranchePagination({
    currentTranche,
    setCurrentTranche,
    myVotes,
    title,
    description,
}: {
    currentTranche: number
    setCurrentTranche: (tranche: number) => void
    myVotes?: Map<number, VoteWithPower | null>
    title: ReactNode
    description: ReactNode
}) {
    const {
        currentRoundEnd,
        globalState: { tranches },
    } = useProposalsContext()

    const hasVotedOnAny = true
    // const hasVotedOnAny = tranches.some((tranche) => myVotes?.has(tranche.id))

    return (
        <div className="space-y-12">
            <div className="flex gap-6 items-center">
                <div
                    className="
                        flex
                        bg-white/20
                        backdrop-blur-md
                        rounded-md
                    "
                >
                    {tranches.map((tranche, index) => {
                        const trancheNumber = index + 1
                        const isSelected = trancheNumber === currentTranche
                        const hasVoted = trancheNumber === 1
                        // const hasVoted = myVotes?.has(trancheNumber)
                        return (
                            <button
                                key={trancheNumber}
                                onClick={() => setCurrentTranche(trancheNumber)}
                                className={twMerge(
                                    `
                                        px-12
                                        py-4
                                        relative
                                        w-full
                                        whitespace-nowrap
                                        rounded-md
                                    `,
                                    isSelected
                                        ? `
                                              text-palette-text
                                              font-semibold
                                              bg-palette-beige
                                          `
                                        : `
                                              text-white
                                          `
                                )}
                            >
                                {tranche.name}
                                {hasVotedOnAny && (
                                    <span
                                        className={twMerge(
                                            `
                                                absolute
                                                top-full
                                                right-0
                                                mt-1
                                                text-xs
                                                flex
                                                gap-1
                                                items-center
                                                px-2
                                                text-white
                                                py-1
                                                font-normal
                                            `,
                                            hasVoted
                                                ? `
                                                      text-palette-green/70
                                                  `
                                                : `
                                                  `,
                                            isSelected
                                                ? `
                                                  `
                                                : `
                                                  `
                                        )}
                                    >
                                        {hasVoted ? (
                                            <>
                                                <CircleCheckBig size={14} />
                                                You Voted
                                            </>
                                        ) : (
                                            <>
                                                <Clock size={14} />
                                                Vote Soon!
                                            </>
                                        )}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                <ArrowLeft size={72} />

                <div
                    className="
                        space-y-2
                        py-3
                    "
                >
                    <h3 className="text-3xl font-semibold">{title}</h3>
                    <p className="text-base">{description}</p>
                </div>
            </div>
        </div>
    )
}
