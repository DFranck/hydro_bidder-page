"use client"

import { useAppContext } from "@/app/context"
import { VoteWithPower } from "@/app/ts_types/HydroBase.types"
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
    } = useAppContext()

    const hasVotedOnAnyTranch = tranches.some((tranche) =>
        myVotes?.has(tranche.id)
    )

    return (
        <div className="space-y-12">
            <div className="flex items-center gap-12">
                <div
                    className="
                        flex
                        rounded-md
                        bg-white/20
                        backdrop-blur-md
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
                                        relative
                                        w-full
                                        whitespace-nowrap
                                        rounded-md
                                        px-12
                                        py-4
                                    `,
                                    isSelected
                                        ? `
                                              bg-palette-beige
                                              font-semibold
                                              text-palette-text
                                          `
                                        : `
                                              text-white
                                          `
                                )}
                            >
                                {tranche.name}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
