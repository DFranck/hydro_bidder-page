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
    title?: ReactNode
    description?: ReactNode
}) {
    const {
        globalState: { tranches },
    } = useProposalsContext()

    const hasVotedOnAnyTranch = tranches.some((tranche) =>
        myVotes?.has(tranche.id)
    )

    return (
        <div className="space-y-12">
            <div className="flex gap-12 items-center">
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
                        const hasVotedInTranch = myVotes?.has(trancheNumber)

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
                                {hasVotedOnAnyTranch && (
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
                                            hasVotedInTranch
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
                                        {hasVotedInTranch ? (
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

                <div
                    className="
                        relative
                        pl-6
                        pr-3
                        py-1
                        bg-palette-beige/10
                        rounded-md
                        text-palette-green
                        border-2
                        border-palette-green
                    "
                >
                    <div
                        className="
                            absolute
                            aspect-square
                            p-1
                            top-1/2
                            left-0
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-palette-green
                            text-palette-text
                            border-palette-text
                            border-2
                        "
                    >
                        <ArrowLeft />
                    </div>

                    <div className="space-y-2">
                        {title && (
                            <h3 className="text-xl font-semibold">{title}</h3>
                        )}
                        {description && (
                            <p className="text-sm">{description}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
