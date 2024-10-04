"use client"

import { useProposalsContext } from "@/app/proposals/context"
import { PrettyTable, TR } from "@/components/PrettyTable"
import { TranchePagination } from "@/components/TranchePagination"
import { useMyVotes, useUserVotingData } from "@/hooks/hooks"
import {
    estimatedRewardForPower,
    formatAmount,
    formatDenom,
    sumTributeAmounts,
} from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { CircleCheckBig, ScrollText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { WelcomePopup } from "./welcomePopup"

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

const ActiveProposals = ({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
    const router = useRouter()
    const {
        currentProposalTranches,
        currentProposalTributes,
        globalState,
        assetListWithPrices,
    } = useProposalsContext()

    const [currentTranche, setCurrentTranche] = useState(
        searchParams.tranche ? parseInt(searchParams.tranche as string, 10) : 1
    )

    const {
        isWalletConnected,
        isWalletConnecting,
        address,
        getSigningCosmWasmClient,
    } = useChain("neutron")

    const { data: myUserVotingData, isPending: myUserVotingDataIsPending } =
        useUserVotingData(address ?? "")

    const { data: myVotes } = useMyVotes(
        address || "",
        globalState.currentRound,
        Array.from(currentProposalTranches.keys())
    )

    const proposals = currentProposalTranches.get(currentTranche)

    const decoratedProposals = proposals?.map((proposal, index) => {
        const tributes = currentProposalTributes.get(proposal.proposal_id)!

        const summedTributes = sumTributeAmounts(tributes)

        const pricedAndNamedTributes = summedTributes.map((tribute) => {
            const assetInfo = assetListWithPrices.get(tribute.denom)
            return {
                ...tribute,
                priceUsd: assetInfo?.priceUsd,
                symbol: assetInfo?.symbol,
                decimals: assetInfo?.decimals,
            }
        })

        const hasVotedOnProp =
            myVotes?.get(currentTranche) &&
            myVotes.get(currentTranche)?.prop_id === proposal.proposal_id

        return {
            ...proposal,
            pricedAndNamedTributes,
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
        newSearchParams.set("tranche", tranche.toString())
        router.push(
            `${window.location.pathname}?${newSearchParams.toString()}`,
            { scroll: false }
        )
    }

    const handleTrancheChange = (newTranche: number) => {
        setCurrentTranche(newTranche)
        updateTrancheInURL(newTranche)
    }

    const showWelcomeModal =
        !myUserVotingDataIsPending &&
        myUserVotingData &&
        myUserVotingData.votingPower <= 0

    const classNamesForCells = `
        group-hover/table-row:text-palette-green
        sm:group-[&.has-voted]/table-row:border-palette-green
        sm:group-[&.has-voted]/table-row:border-y-2
        sm:group-[&.has-voted]/table-row:first:border-l-2
        sm:group-[&.has-voted]/table-row:last:border-r-2
        sm:group-[&.has-voted:hover]/table-row:text-palette-green
    `

    return (
        <>
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
                {currentProposalTranches.size > 1 && (
                    <TranchePagination
                        currentTranche={currentTranche}
                        setCurrentTranche={handleTrancheChange}
                        myVotes={myVotes}
                        description={
                            hasVotedInAll ? (
                                <>
                                    You can still change your vote until the end
                                    of the round
                                </>
                            ) : hasVoted ? (
                                <>
                                    You can vote on{" "}
                                    <span className="font-bold italic">
                                        one
                                    </span>{" "}
                                    proposal from{" "}
                                    <span className="font-bold italic">
                                        each
                                    </span>{" "}
                                    tranche!
                                </>
                            ) : (
                                <>
                                    <a className="font-bold underline" href="#">
                                        Lock some ATOM
                                    </a>{" "}
                                    to vote on{" "}
                                    <span className="font-bold italic">
                                        one
                                    </span>{" "}
                                    proposal from{" "}
                                    <span className="font-bold italic">
                                        each
                                    </span>{" "}
                                    tranche!
                                </>
                            )
                        }
                    />
                )}
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
                                key: "rewards",
                                label: "Rewards",
                                isSortable: true,
                                textAlign: "right",
                                propsForCells: {
                                    className: classNamesForCells,
                                },
                            },
                            {
                                key: "rewardValue",
                                label: "Reward Value",
                                isSortable: true,
                                textAlign: "right",
                                propsForCells: {
                                    className: classNamesForCells,
                                },
                            },
                            {
                                key: "yourEstimatedReward",
                                label: "Your Est. Reward",
                                isSortable: true,
                                textAlign: "right",
                                propsForCells: {
                                    className: classNamesForCells,
                                },
                            },
                            {
                                key: "currentVoteShare",
                                label: "Vote %",
                                isSortable: true,
                                initialSortDirection: "DESC",
                                textAlign: "right",
                                propsForCells: {
                                    className: classNamesForCells,
                                },
                            },
                        ]}
                        initialSortedColumnKey="currentVoteShare"
                        rows={decoratedProposals.map((proposal) => ({
                            _proposal: proposal,

                            hasVoted:
                                hasVoted && proposal.hasVotedOnProp ? (
                                    <div
                                        className="
                                       relative
                                       -translate-y-1/4
                                       text-palette-green
                                    "
                                    >
                                        <CircleCheckBig />

                                        <div
                                            className="
                                            absolute
                                            left-1/2
                                            top-full
                                            flex
                                            w-min
                                            -translate-x-1/2
                                            -translate-y-1/4
                                            items-center
                                            gap-2
                                            whitespace-nowrap
                                            rounded-full
                                            bg-palette-green
                                            p-0.5
                                            px-1
                                            text-[8px]
                                            text-palette-text
                                        "
                                        >
                                            Your Pick
                                        </div>
                                    </div>
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

                            rewards: proposal.pricedAndNamedTributes.map(
                                (tribute, index) => (
                                    <div
                                        className="whitespace-nowrap"
                                        key={index}
                                    >
                                        {formatAmount(
                                            tribute.amount,
                                            tribute.decimals
                                        )}
                                        <span
                                            className="
                                            ml-1
                                            text-xs
                                            uppercase
                                            opacity-60
                                        "
                                        >
                                            {formatDenom(
                                                tribute.denom,
                                                tribute.symbol
                                            )}
                                        </span>
                                    </div>
                                )
                            ),

                            rewardValue: proposal.pricedAndNamedTributes
                                .reduce((total, tribute) => {
                                    return (
                                        total +
                                        ((tribute.priceUsd ?? 0) *
                                            tribute.amount) /
                                            10 ** (tribute.decimals ?? 0)
                                    )
                                }, 0)
                                .toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                    trailingZeroDisplay: "stripIfInteger",
                                }),

                            yourEstimatedReward: !isWalletConnected ? (
                                <div
                                    className="
                                            ml-1
                                            text-xs
                                            opacity-60
                                        "
                                >
                                    <div>Lock ATOM to</div>
                                    <div>see rewards</div>
                                </div>
                            ) : (
                                estimatedRewardForPower(
                                    proposalTotalTribute(
                                        proposal.pricedAndNamedTributes
                                    ),
                                    myUserVotingData?.votingPower ?? 0,
                                    Number(proposal.power ?? 0)
                                ).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })
                            ),

                            currentVoteShare: `${proposal.percentage}%`,
                        }))}
                        renderRow={({ children, row, rowProps }) => (
                            <TR
                                className={
                                    row._proposal.hasVotedOnProp
                                        ? `
                                        has-voted
                                        max-sm:bg-palette-green
                                        max-sm:text-palette-text
                                        max-sm:hover:bg-palette-green/80
                                    `
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
            <WelcomePopup showModal={showWelcomeModal} />
        </>
    )
}

export default ActiveProposals
