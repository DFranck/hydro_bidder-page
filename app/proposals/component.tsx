"use client"

import { useRouter } from 'next/navigation'
import { useProposalsContext } from "@/app/proposals/context"
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
import { CircleCheckBig, ScrollText, X } from "lucide-react"
import Link from "next/link"
import { ComponentProps, useState } from "react"
import { twMerge } from "tailwind-merge"

const ActiveProposals = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const router = useRouter()
    const { currentProposalTranches, currentProposalTributes, globalState } =
        useProposalsContext()

    const [currentTranche, setCurrentTranche] = useState(searchParams.tranche ? parseInt(searchParams.tranche as string, 10) : 1)

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

    const updateTrancheInURL = (tranche: number) => {
        const newSearchParams = new URLSearchParams(window.location.search)
        newSearchParams.set('tranche', tranche.toString())
        router.push(`${window.location.pathname}?${newSearchParams.toString()}`, { scroll: false })
    }

    const handleTrancheChange = (newTranche: number) => {
        setCurrentTranche(newTranche)
        updateTrancheInURL(newTranche)
    }

    return (
        <div
            className="
                mt-10
                -mx-3
                space-y-6
                bg-palette-text/20
                backdrop-blur-md
                px-3
                rounded-md
                overflow-hidden
            "
        >
            <TranchePagination
                currentTranche={currentTranche}
                setCurrentTranche={handleTrancheChange}
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
                            <span className="italic font-bold">one</span>{" "}
                            proposal from{" "}
                            <span className="italic font-bold">each</span>{" "}
                            tranche!
                        </>
                    ) : (
                        <>
                            <a className="font-bold underline" href="#">
                                Lock some ATOM
                            </a>{" "}
                            to vote on{" "}
                            <span className="italic font-bold">one</span>{" "}
                            proposal from{" "}
                            <span className="italic font-bold">each</span>{" "}
                            tranche!
                        </>
                    )
                }
            />

            {decoratedProposals?.length && (
                <Table
                    className="
                        border-separate
                        border-spacing-y-3
                    "
                >
                    <TableHeader>
                        <TableRow className="border-0">
                            <TableHead
                                className="
                                    p-0
                                    h-auto
                                    text-left
                                    px-0
                                    text-neutral-200
                                    w-0
                                "
                            >
                                &nbsp;
                            </TableHead>
                            <TableHead
                                className="
                                    p-0
                                    h-auto
                                    text-left
                                    text-neutral-200
                                "
                            >
                                Proposal Name
                            </TableHead>
                            <TableHead
                                className="
                                    p-0
                                    px-12
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
                                    p-0
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
                        {decoratedProposals.map((proposal) => (
                            <TableRow
                                key={proposal.proposal_id}
                                className={twMerge(
                                    `
                                        group/row
                                        relative
                                        text-white
                                        cursor-pointer
                                        border-0
                                        backdrop-blur
                                        bg-transparent
                                        hover:bg-transparent
                                    `,
                                    hasVoted &&
                                        proposal.hasVotedOnProp &&
                                        `
                                            text-palette-text
                                        `
                                )}
                            >
                                <ProposalTableCell
                                    className="
                                        px-5
                                        rounded-tl-lg
                                        rounded-bl-lg
                                    "
                                    hasVoted={!!hasVoted}
                                    hasVotedOnProp={!!proposal.hasVotedOnProp}
                                >
                                    {hasVoted && proposal.hasVotedOnProp ? (
                                        <CircleCheckBig />
                                    ) : hasVoted ? (
                                        <X />
                                    ) : (
                                        <ScrollText />
                                    )}
                                </ProposalTableCell>
                                <ProposalTableCell
                                    hasVoted={!!hasVoted}
                                    hasVotedOnProp={!!proposal.hasVotedOnProp}
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
                                    />
                                </ProposalTableCell>
                                <ProposalTableCell
                                    className="
                                        text-center
                                    "
                                    hasVoted={!!hasVoted}
                                    hasVotedOnProp={!!proposal.hasVotedOnProp}
                                >
                                    {proposal.summedTributes.map(
                                        (tribute, index) => (
                                            <div key={index}>
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
                                </ProposalTableCell>
                                <ProposalTableCell
                                    className="
                                        text-center
                                        rounded-tr-lg
                                        rounded-br-lg
                                        border-0
                                    "
                                    hasVoted={!!hasVoted}
                                    hasVotedOnProp={!!proposal.hasVotedOnProp}
                                >
                                    {proposal.percentage}%
                                </ProposalTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

function ProposalTableCell({
    children,
    className,
    hasVoted,
    hasVotedOnProp,
    ...otherProps
}: ComponentProps<"div"> & { hasVoted: boolean; hasVotedOnProp: boolean }) {
    return (
        <TableCell
            className={twMerge(
                `
                    p-0
                    py-5
                    group-hover/row:delay-0
                    bg-palette-beige/10
                    delay-75
                    transition
                    group-hover/row:bg-palette-beige
                    group-hover/row:text-palette-text
                `,
                hasVoted &&
                    hasVotedOnProp &&
                    `
                        bg-palette-green
                        text-palette-text
                        group-hover/row:bg-palette-green
                        group-hover/row:text-palette-text/60
                    `,
                hasVoted &&
                    !hasVotedOnProp &&
                    `
                        opacity-90
                        group-hover/row:opacity-100
                    `,
                className
            )}
        >
            {children}
        </TableCell>
    )
}

export default ActiveProposals
