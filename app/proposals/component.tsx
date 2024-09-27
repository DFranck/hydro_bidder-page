"use client"

import { useProposalsContext } from "@/app/proposals/context"
import { PrettyTable, TR } from "@/components/PrettyTable"
import { TranchePagination } from "@/components/TranchePagination"
import { useMyVotes } from "@/hooks/hooks"
import { sumTributeAmounts } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { CircleCheckBig, ScrollText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

function proposalTotalTribute(
    pricedAndNamedTributes: {
        priceUsd: number | undefined
        symbol: string | undefined
        decimals: number | undefined
        denom: string
        amount: number
    }[]
) {
    return pricedAndNamedTributes.reduce((total, tribute) => {
        return (
            total +
            ((tribute.priceUsd ?? 0) * tribute.amount) /
                10 ** (tribute.decimals ?? 0)
        )
    }, 0)
}

const ActiveProposals = () => {
    const { currentProposalTranches, currentProposalTributes, globalState } =
        useProposalsContext()

    const [currentTranche, setCurrentTranche] = useState(1)

    const { isWalletConnected, address, getSigningCosmWasmClient } =
        useChain("neutron")

    const { data: myVotes } = useMyVotes(
        address || "",
        globalState.currentRound,
        Array.from(currentProposalTranches.keys())
    )

    const proposals = currentProposalTranches.get(currentTranche)

    const decoratedProposals = proposals?.map((proposal, index) => {
        const tributes = currentProposalTributes.get(proposal.proposal_id)!

        const summedTributes = sumTributeAmounts(tributes)

        const hasVotedOnProp =
            myVotes?.get(currentTranche) &&
            myVotes.get(currentTranche)?.prop_id === proposal.proposal_id

        return {
            ...proposal,
            summedTributes,
            hasVotedOnProp,
        }
    })

    const hasVoted = decoratedProposals?.some(
        (proposal) => proposal.hasVotedOnProp
    )

    const hasVotedInAll = decoratedProposals?.every(
        (proposal) => proposal.hasVotedOnProp
    )

    const classNamesForCells = `
        group-[&.has-voted]/table-row:bg-palette-green
        group-[&.has-voted]/table-row:text-palette-text
        group-[&.has-voted:hover]/table-row:text-palette-text/60
    `

    return (
        <div
            className="
                -mx-3
                mt-10
                space-y-6
                overflow-hidden
                rounded-md
                bg-palette-text/20
                px-3
                backdrop-blur-md
            "
        >
            <TranchePagination
                currentTranche={currentTranche}
                setCurrentTranche={setCurrentTranche}
                myVotes={myVotes}
                description={
                    hasVotedInAll ? (
                        <>
                            You can still change your vote until the end of the
                            round
                        </>
                    ) : hasVoted ? (
                        <>
                            You can vote on{" "}
                            <span className="font-bold italic">one</span>{" "}
                            proposal from{" "}
                            <span className="font-bold italic">each</span>{" "}
                            tranche!
                        </>
                    ) : (
                        <>
                            <a className="font-bold underline" href="#">
                                Lock some ATOM
                            </a>{" "}
                            to vote on{" "}
                            <span className="font-bold italic">one</span>{" "}
                            proposal from{" "}
                            <span className="font-bold italic">each</span>{" "}
                            tranche!
                        </>
                    )
                }
            />
            {decoratedProposals?.length && (
                <PrettyTable
                    columns={[
                        {
                            key: "hasVoted",
                            label: "",
                            isSortable: false,
                            propsForHeaderCell: {
                                className: `
                                    !pr-0
                                    w-0
                                `,
                            },
                            propsForCells: {
                                className: `
                                    ${classNamesForCells}
                                    rounded-l-lg
                                    !pr-0
                                    w-0
                                `,
                            },
                        },
                        {
                            key: "name",
                            label: "Proposal Name",
                            isSortable: true,
                            propsForCells: {
                                className: classNamesForCells,
                            },
                        },
                        {
                            key: "status",
                            label: "",
                            propsForCells: {
                                className: classNamesForCells,
                            },
                        },
                        {
                            key: "tributeAmount",
                            label: "Tribute Amount",
                            isSortable: true,
                            textAlign: "right",
                            propsForCells: {
                                className: classNamesForCells,
                            },
                        },
                        {
                            key: "currentVoteShare",
                            label: "Current Vote Share",
                            isSortable: true,
                            initialSortDirection: "DESC",
                            textAlign: "right",
                            propsForCells: {
                                className: `
                                    rounded-r-lg
                                    ${classNamesForCells}
                                `,
                            },
                        },
                    ]}
                    initialSortedColumnKey="currentVoteShare"
                    rows={decoratedProposals.map((proposal) => ({
                        _proposal: proposal,

                        hasVoted:
                            hasVoted && proposal.hasVotedOnProp ? (
                                <CircleCheckBig />
                            ) : (
                                <ScrollText />
                            ),

                        name: (
                            <>
                                <p
                                    className="
                                        line-clamp-2
                                        text-lg
                                        font-semibold
                                    "
                                >
                                    {proposal.title}
                                </p>
                                <Link
                                    href={`/proposals/${proposal.proposal_id}`}
                                    className="
                                        absolute
                                        inset-0
                                        z-10
                                        h-full
                                        w-full
                                    "
                                />
                            </>
                        ),

                        status: proposal.hasVotedOnProp && (
                            <div
                                className="
                                    flex
                                    w-min
                                    items-center
                                    gap-2
                                    whitespace-nowrap
                                    rounded-full
                                    bg-white
                                    p-1
                                    px-2
                                    text-xs
                                "
                            >
                                Your Pick
                            </div>
                        ),

                        tributeAmount: proposal.summedTributes.length
                            ? proposal.summedTributes.map((tribute, index) => (
                                  <div key={index}>
                                      {(tribute.amount / 1000000).toFixed(2)}{" "}
                                      {tribute.denom.length > 20
                                          ? tribute.denom.slice(0, 17) + "..."
                                          : tribute.denom}
                                  </div>
                              ))
                            : "0.00",

                        currentVoteShare: `${proposal.percentage}%`,
                    }))}
                    renderRow={({ children, row, rowProps }) => (
                        <TR
                            className={
                                row._proposal.hasVotedOnProp
                                    ? "has-voted"
                                    : undefined
                            }
                            {...rowProps}
                        >
                            {children}
                        </TR>
                    )}
                />
            )}
        </div>
    )
}

export default ActiveProposals
