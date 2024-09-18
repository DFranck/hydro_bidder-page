"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DataTable, makeProposalColumnDef } from "../ui/proposalTable"
import { Proposal, Timestamp } from "../ts_types/HydroBase.types"
import { useState } from "react"
import { GlobalState } from "../types"
import { Tribute } from "../ts_types/TributeBase.types"
import { TranchePagination } from "@/components/TranchePagination"

const ActiveProposals = ({
    currentProposalTranches,
    currentProposalTributes,
    globalState,
}: {
    currentProposalTranches: Map<number, Proposal[]>
    currentProposalTributes: Map<number, Tribute[]>
    globalState: GlobalState
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
            <TranchePagination
                currentTranche={currentTranche}
                toggleTranche={toggleTranche}
                globalState={globalState}
                title="Proposals in Voting"
                description="The winning proposal from each tranche will deployed in the
                    next round."
            />

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
                                    <div className="flex justify-end w-full">
                                        <Button
                                            className="bg-white text-black lg:w-40 hover:bg-gray-200"
                                            asChild
                                        >
                                            <Link
                                                href={`/voting-proposals/${row.original.proposal.proposal_id}`}
                                            >
                                                View Proposal
                                            </Link>
                                        </Button>
                                    </div>
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
