import { Button } from "@/components/ui/button"
import { GlobalState } from "@/app/types"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Proposal, VoteWithPower } from "@/app/ts_types/HydroBase.types"
import { Card, CardContent, CardHeader } from "./ui/card"

export function TranchePagination({
    currentTranche,
    currentProposalTranches,
    setCurrentTranche,
    myVotes,
    globalState,
    title,
    description,
}: {
    currentTranche: number
    currentProposalTranches: Map<number, Proposal[]>
    setCurrentTranche: (tranche: number) => void
    globalState: GlobalState
    myVotes: Map<number, VoteWithPower | null> | undefined
    title: string
    description: string
}) {
    const toggleTranche = () => {
        setCurrentTranche(currentTranche === 1 ? 2 : 1)
    }
    return (
        <div>
            <div className="flex flex-col lg:flex-row gap-12 w-full justify-between items-center">
                <div className="flex flex-col gap-2 max-w-2xl">
                    <h3 className="text-3xl font-semibold">{title}</h3>
                    <p className="text-lg">{description}</p>
                </div>
                <Card className="mt-10 ml-auto">
                    <CardHeader>
                        <Button className="flex-shrink-0 text-lg py-3 px-6 w-full">
                            Lock ATOM to vote
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text">
                            You must lock staked ATOM to get voting power.
                            Locked ATOM continues earning staking rewards on the
                            Cosmos Hub as well!
                        </p>
                    </CardContent>
                </Card>
                {/* <nav className="bg-black/80 backdrop-blur p-2.5 flex flex-row justify-between items-center gap-12 border rounded-full border-solid border-[#FFE1B8] lg:w-1/3">
                    <Button
                        variant="ghost"
                        className="hover:bg-transparent"
                        size="icon"
                        onClick={toggleTranche}
                        aria-label="Previous Tranche"
                    >
                        <ChevronLeftIcon className="w-16 h-32 text-[#E4B472] hover:text-[#FFE1B8]" />
                    </Button>
                    <div className="flex flex-col items-center gap-1">
                        <p className="uppercase text-xs font-normal text-[#E4B472]">
                            Viewing tranche {currentTranche} of{" "}
                            {globalState.tranches.length}
                        </p>
                        <p className="text-2xl font-semibold text-[#E4B472]">
                            {globalState.tranches[currentTranche - 1].name}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        className="hover:bg-transparent  text-[#E4B472]"
                        size="icon"
                        aria-label="Next Tranche"
                        onClick={toggleTranche}
                    >
                        <ChevronRightIcon className="w-16 h-32 text-[#E4B472] hover:text-[#FFE1B8]" />
                    </Button>
                </nav> */}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
                {globalState.tranches.map((tranche, index) => {
                    const trancheNumber = index + 1
                    const isSelected = trancheNumber === currentTranche
                    const hasVoted = myVotes?.has(trancheNumber)

                    return (
                        <Button
                            key={trancheNumber}
                            onClick={() => setCurrentTranche(trancheNumber)}
                            variant={isSelected ? "default" : "outline"}
                            className={`h-10 text-left flex flex-col ${
                                isSelected
                                    ? "bg-[#0061FF] text-white"
                                    : "text-[#E4B472]"
                            }`}
                        >
                            <span>{tranche.name}</span>
                            {(hasVoted && (
                                <span className="text-xs mt-1">Voted</span>
                            )) || <span className="text-xs mt-1"></span>}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
