"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { DataTable, makeProposalColumnDef } from "../ui/proposalTable"
import { Proposal, Timestamp, Tranche } from "../ts_types/HydroBase.types"
import { useState } from "react"
import { GlobalState } from "../types"
import { Tribute } from "../ts_types/TributeBase.types"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const ActiveProposals = ({
    currentProposalTranches,
    currentProposalTributes,
    globalState,
}: {
    currentProposalTranches: Map<number, Proposal[]>
    currentProposalTributes: Map<number, Tribute[]>
    globalState: GlobalState
    roundEnd?: Timestamp
}) => {
    const [currentTranche, setCurrentTranche] = useState(1)

    const toggleTranche = () => {
        if (currentTranche === 1) {
            setCurrentTranche(2)
        } else {
            setCurrentTranche(1)
        }
    }

    return (
        <div className="mt-14 space-y-8 lg:space-y-14">
            <aside className="flex flex-col lg:flex-row gap-4 w-full justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h3 className="text-3xl font-semibold">
                        Proposals in Voting
                    </h3>
                    <p className="text-lg">
                        The winning proposal from each tranche will deployed in
                        the next round.
                    </p>
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

            {currentProposalTranches.get(currentTranche) && (
                <DataTable
                    columns={[
                        {
                            accessorKey: "title",
                            header: () => (
                                <div className="text-center capitalize">
                                    Proposal Name
                                </div>
                            ),
                            cell: ({ row }) => {
                                return (
                                    <div className="flex flex-col">
                                        <p className="text-xl not-italic font-bold leading-[150%] line-clamp-2">
                                            {row.original.proposal.title}
                                        </p>
                                    </div>
                                )
                            },
                        },
                        {
                            accessorKey: "tribute",
                            header: () => (
                                <div className="text-center capitalize">
                                    Tribute Amount
                                </div>
                            ),
                            cell: ({ row }) => (
                                <div className="text-center">
                                    {row.original.summedTributes.map(
                                        (tribute, index) => (
                                            <div
                                                key={index}
                                                className="text-center"
                                            >
                                                {`${(
                                                    tribute.amount / 1000000
                                                ).toFixed(2)} ${
                                                    tribute.denom.length > 20
                                                        ? tribute.denom.slice(
                                                              0,
                                                              17
                                                          ) + "..."
                                                        : tribute.denom
                                                }`}
                                            </div>
                                        )
                                    )}
                                </div>
                            ),
                        },
                        {
                            accessorKey: "votingPowerPercent",
                            header: () => (
                                <div className="text-center capitalize">
                                    Current vote share
                                </div>
                            ),
                            cell: ({ row }) => (
                                <div className="text-center">
                                    {row.original.proposal.percentage}
                                </div>
                            ),
                        },
                        {
                            accessorKey: "link",
                            header: "",
                            cell: ({ row }) => {
                                return (
                                    <Link
                                        href={`/voting-proposals/${row.original.proposal.proposal_id}`}
                                    >
                                        <Button className="bg-[#0061FF]">
                                            View Proposal
                                        </Button>
                                    </Link>
                                )
                            },
                        },
                    ]}
                    data={(
                        currentProposalTranches.get(currentTranche) || []
                    ).map((proposal) =>
                        makeProposalColumnDef(
                            proposal,
                            currentProposalTributes.get(proposal.proposal_id)!
                        )
                    )}
                />
            )}
        </div>
    )
}

export default ActiveProposals
