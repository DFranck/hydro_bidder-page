"use client"
import { TranchePagination } from "@/components/TranchePagination"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useMyVotes } from "@/hooks/hooks"
import { sumTributeAmounts } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { CircleCheckBig, ScrollText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Proposal } from "../ts_types/HydroBase.types"
import { Tribute } from "../ts_types/TributeBase.types"
import { GlobalState } from "../types"

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

    const { isWalletConnected, address, getSigningCosmWasmClient } =
        useChain("neutron")

    const { data: myVotes } = useMyVotes(
        address || "",
        globalState.currentRound,
        Array.from(currentProposalTranches.keys())
    )

    return (
        <div className="mt-10">
            <TranchePagination
                currentTranche={currentTranche}
                setCurrentTranche={setCurrentTranche}
                myVotes={myVotes}
                title="Proposals in Voting"
                description={
                    <>
                        Choose a proposal to vote on! The top 5 proposals in
                        each tranche get Hydro&rsquo;s ATOM liquidity, and their
                        voters split the reward based on voting&nbsp;power.
                    </>
                }
            />

            {currentProposalTranches.get(currentTranche) && (
                <Table
                    className="
                        border-separate
                        border-spacing-y-3
                        bg-palette-text/20
                        backdrop-blur-md
                        px-3
                        rounded-md
                        overflow-hidden
                    "
                >
                    <TableHeader>
                        <TableRow className="border-0">
                            <TableHead
                                className="
                                    py-0
                                    h-auto
                                    text-left
                                    pr-0
                                    text-neutral-200
                                    w-0
                                "
                            >
                                &nbsp;
                            </TableHead>
                            <TableHead
                                className="
                                    py-0
                                    h-auto
                                    text-left
                                    text-neutral-200
                                "
                            >
                                Proposal Name
                            </TableHead>
                            <TableHead
                                className="
                                    py-0
                                    h-auto
                                    text-center
                                    text-neutral-200
                                    w-0
                                    whitespace-nowrap
                                "
                            >
                                Tribute Amount
                            </TableHead>
                            <TableHead
                                className="
                                    py-0
                                    h-auto
                                    text-center
                                    text-neutral-200
                                    w-0
                                    whitespace-nowrap
                                "
                            >
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

                                const hasVotedOnProp =
                                    myVotes?.get(currentTranche) &&
                                    myVotes.get(currentTranche)?.prop_id ===
                                        proposal.proposal_id

                                return (
                                    <TableRow
                                        key={proposal.proposal_id}
                                        className="
                                            group/row
                                            relative
                                            text-white
                                            cursor-pointer
                                            border-0
                                            backdrop-blur
                                            !bg-transparent
                                        "
                                    >
                                        <TableCell
                                            className="
                                                px-5
                                                py-5
                                                rounded-tl-lg
                                                rounded-bl-lg
                                                bg-palette-beige/10
                                                group-hover/row:bg-palette-beige
                                                group-hover/row:delay-0
                                                group-hover/row:text-palette-text
                                                delay-75
                                                transition
                                            "
                                        >
                                            {hasVotedOnProp ? (
                                                <CircleCheckBig />
                                            ) : (
                                                <ScrollText />
                                            )}
                                        </TableCell>
                                        <TableCell
                                            className="
                                                p-0
                                                py-5
                                                mb-5
                                                bg-palette-beige/10
                                                group-hover/row:bg-palette-beige
                                                group-hover/row:delay-0
                                                group-hover/row:text-palette-text
                                                delay-75
                                                transition
                                            "
                                        >
                                            <p
                                                className="
                                                    text-xl
                                                    not-italic
                                                    font-bold
                                                    leading-[150%]
                                                    line-clamp-2
                                                "
                                            >
                                                {proposal.title}
                                            </p>
                                            <Link
                                                href={`/proposals/${proposal.proposal_id}`}
                                                className="
                                                    absolute
                                                    inset-0
                                                    w-full
                                                    h-full
                                                    z-10
                                                "
                                            ></Link>
                                        </TableCell>
                                        <TableCell
                                            className="
                                                p-0
                                                py-5
                                                text-center
                                                mb-5
                                                bg-palette-beige/10
                                                group-hover/row:bg-palette-beige
                                                group-hover/row:delay-0
                                                group-hover/row:text-palette-text
                                                delay-75
                                                transition
                                            "
                                        >
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
                                        <TableCell
                                            className="
                                                p-0
                                                py-5
                                                text-center
                                                rounded-tr-lg
                                                rounded-br-lg
                                                border-0
                                                mb-5
                                                bg-palette-beige/10
                                                group-hover/row:bg-palette-beige
                                                group-hover/row:delay-0
                                                group-hover/row:text-palette-text
                                                delay-75
                                                transition
                                            "
                                        >
                                            {proposal.percentage}%
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
