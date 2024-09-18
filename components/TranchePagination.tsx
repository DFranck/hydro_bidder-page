import { Button } from "@/components/ui/button"
import { GlobalState } from "@/app/types"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export function TranchePagination({
    currentTranche,
    toggleTranche,
    globalState,
    title,
    description,
}: {
    currentTranche: number
    toggleTranche: () => void
    globalState: GlobalState
    title: string
    description: string
}) {
    return (
        <aside className="flex flex-col lg:flex-row gap-4 w-full justify-between items-center">
            <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-semibold">{title}</h3>
                <p className="text-lg">{description}</p>
            </div>
            <nav className="p-2.5 flex flex-row justify-between items-center gap-12 border rounded-full border-solid border-[#FFE1B8] lg:w-1/3">
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
            </nav>
        </aside>
    )
}
