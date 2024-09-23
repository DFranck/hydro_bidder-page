"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useChain } from "@cosmos-kit/react"
import { Proposal } from "../ts_types/HydroBase.types"
import { useState } from "react"
import { GlobalState } from "../types"
import { Tribute } from "../ts_types/TributeBase.types"
import { TranchePagination } from "@/components/TranchePagination"
import { sumTributeAmounts } from "@/lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CircleCheckBig, Circle } from "lucide-react"
import { useMyVotes } from "@/hooks/hooks"

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
        setCurrentTranche(currentTranche === 1 ? 2 : 1)
    }

    const { isWalletConnected, address, getSigningCosmWasmClient } =
        useChain("neutron")

    const { data: myVotes } = useMyVotes(
        address || "",
        globalState.currentRound,
        Array.from(currentProposalTranches.keys())
    )

    return (
        <div className="mt-14 space-y-8 lg:space-y-14">
            <TranchePagination
                currentTranche={currentTranche}
                toggleTranche={toggleTranche}
                globalState={globalState}
                title="Proposals in Voting"
                description="The winning proposal from each tranche will deployed in the next round."
            />

            {currentProposalTranches.get(currentTranche) && (
                <Table className="border-separate border-spacing-y-2">
                    <TableHeader>
                        <TableRow className="border-0">
                            <TableHead className="text-left pr-0 text-neutral-200">
                                Vote
                            </TableHead>
                            <TableHead className="text-left text-neutral-200">
                                Proposal Name
                            </TableHead>
                            <TableHead className="text-center text-neutral-200">
                                Tribute Amount
                            </TableHead>
                            <TableHead className="text-center text-neutral-200">
                                Current vote share
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentProposalTranches
                            .get(currentTranche)!
                            .map((proposal) => {
                                const tributes = currentProposalTributes.get(
                                    proposal.proposal_id
                                )!
                                const summedTributes =
                                    sumTributeAmounts(tributes)

                                return (
                                    <TableRow
                                        key={proposal.proposal_id}
                                        className="bg-[#303132]/75 text-white hover:bg-[#0061FF] cursor-pointer border-0 backdrop-blur"
                                        onClick={() =>
                                            (window.location.href = `/proposals/${proposal.proposal_id}`)
                                        }
                                    >
                                        <TableCell className="p-5 rounded-[10px_0_0_10px] mb-5 text-center">
                                            {myVotes?.get(currentTranche) &&
                                            myVotes.get(currentTranche)
                                                ?.prop_id ===
                                                proposal.proposal_id ? (
                                                <CircleCheckBig />
                                            ) : (
                                                <Circle />
                                            )}
                                        </TableCell>
                                        <TableCell className="p-5 mb-5">
                                            <p className="text-xl not-italic font-bold leading-[150%] line-clamp-2 drop-shadow">
                                                {proposal.title}
                                            </p>
                                        </TableCell>
                                        <TableCell className="p-5 text-center mb-5">
                                            {summedTributes.map(
                                                (tribute, index) => (
                                                    <div key={index}>
                                                        {`${(
                                                            tribute.amount /
                                                            1000000
                                                        ).toFixed(2)} ${
                                                            tribute.denom
                                                                .length > 20
                                                                ? tribute.denom.slice(
                                                                      0,
                                                                      17
                                                                  ) + "..."
                                                                : tribute.denom
                                                        }`}
                                                    </div>
                                                )
                                            )}
                                        </TableCell>
                                        <TableCell className="p-5 text-center rounded-[0_10px_10px_0] border-0 mb-5">
                                            {proposal.percentage}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

export default ActiveProposals
