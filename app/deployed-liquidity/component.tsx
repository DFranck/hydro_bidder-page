"use client"
import { useState } from "react"
import {
    DataTable,
    makeProposalColumnDef,
} from "../../components/proposalTable"
import { Proposal } from "../ts_types/HydroBase.types"
import { Tribute } from "../ts_types/TributeBase.types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GlobalState } from "../types"
import { TranchePagination } from "@/components/TranchePagination"

const DeployedLiquidity = ({
    lastProposalTranches,
    lastProposalTributes,
    globalState,
}: {
    lastProposalTranches?: Map<number, Proposal[]>
    lastProposalTributes?: Map<number, Tribute[]>
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
        <div className="mt-14 relative">
            <TranchePagination
                currentTranche={currentTranche}
                toggleTranche={toggleTranche}
                globalState={globalState}
                title="Proposals in Voting"
                description="The winning proposal from each tranche will deployed in the
                    next round."
            />
            {lastProposalTranches &&
            lastProposalTributes &&
            lastProposalTranches.get(currentTranche) ? (
                <DataTable
                    columns={[
                        {
                            accessorKey: "title",
                            header: "",
                            cell: ({ row }) => {
                                return (
                                    <div className="flex flex-col">
                                        <p className="text-xl not-italic font-bold leading-[150%]">
                                            {row.original.proposal.title}
                                        </p>
                                    </div>
                                )
                            },
                        },
                        {
                            accessorKey: "tribute",
                            header: () => (
                                <div className="text-center">
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
                                <div className="text-center">
                                    Voting Power %
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
                                                href={`/deployed-liquidity/${row.original.proposal.proposal_id}`}
                                            >
                                                View Proposal
                                            </Link>
                                        </Button>
                                    </div>
                                )
                            },
                        },
                    ]}
                    data={(lastProposalTranches.get(currentTranche) || []).map(
                        (proposal) =>
                            makeProposalColumnDef(
                                proposal,
                                lastProposalTributes.get(proposal.proposal_id)!
                            )
                    )}
                />
            ) : (
                <div className="text-center py-8 text-xl">
                    There is no deployed liquidity yet.
                </div>
            )}
        </div>
    )
}

export default DeployedLiquidity
