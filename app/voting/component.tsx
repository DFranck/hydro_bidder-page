"use client"

import { useVotingContext } from "@/app/voting/context"
import { PrettyTable, TR } from "@/components/PrettyTable"
import { TooltipIcon } from "@/components/TooltipIcon"
import { useMyVotes, useUserVotingData } from "@/hooks/hooks"
import { estimatedRewardForPower, sumTributeAmounts } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { CircleCheckBig, Gem, ScrollText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
    } = useVotingContext()

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
                    rounded-md
                    bg-palette-text/20
                    px-3
                    backdrop-blur-md
                "
            >
                {/* {currentProposalTranches.size > 1 && (
                    <TranchePagination
                        currentTranche={currentTranche}
                        setCurrentTranche={handleTrancheChange}
                        myVotes={myVotes}
                        description={null}
                    />
                )} */}
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
                                label: (
                                    <div className="flex items-center gap-1">
                                        Project Bid
                                        <TooltipIcon>
                                            Bids are submitted by projects. You
                                            can only vote once (per bucket per
                                            tranche) but you can switch your
                                            vote as many times as you want
                                        </TooltipIcon>
                                    </div>
                                ),
                                isSortable: true,
                                propsForCells: {
                                    className: classNamesForCells,
                                },
                                customValueGetter: (row) => row._proposal.title,
                            },
                            {
                                key: "yourEstimatedReward",
                                label: (
                                    <div className="flex items-center gap-1">
                                        Your Est. Reward
                                        <TooltipIcon>
                                            This is the tribute value that will
                                            be paid out to you when the rounds
                                            ends if you vote for this project.
                                            It may increase (if the project adds
                                            to the tribute) or decrease (if more
                                            voters choose this project){" "}
                                            <span className="whitespace-nowrap">
                                                over time.
                                            </span>
                                        </TooltipIcon>
                                    </div>
                                ),
                                isSortable: true,
                                textAlign: "right",
                                propsForCells: {
                                    className: classNamesForCells,
                                },
                                customValueGetter: (row) =>
                                    estimatedRewardForPower(
                                        proposalTotalTribute(
                                            row._proposal.pricedAndNamedTributes
                                        ),
                                        myUserVotingData?.votingPower ?? 0,
                                        Number(row._proposal.power ?? 0)
                                    ),
                            },
                            {
                                key: "currentVoteShare",
                                label: (
                                    <div className="flex items-center gap-1">
                                        Vote %
                                        <TooltipIcon classNamesForTooltip="-ml-12">
                                            This is the percentage of votes that
                                            this project has received so far. It
                                            may increase or decrease if other
                                            users decide to switch their votes
                                            before the round ends
                                        </TooltipIcon>
                                    </div>
                                ),
                                isSortable: true,
                                initialSortDirection: "DESC",
                                textAlign: "right",
                                propsForCells: {
                                    className: classNamesForCells,
                                },
                                customValueGetter: (row) =>
                                    Number(row._proposal.percentage),
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
                                        {proposal.title.replace(
                                            /[ ]([^ ]+?)$/gm,
                                            `${String.fromCharCode(160)}$1`
                                        )}
                                    </p>
                                    <Link
                                        href={`/voting/${proposal.proposal_id}`}
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

                            yourEstimatedReward: !proposal.title
                                .toLowerCase()
                                .includes("[points]") ? (
                                <TooltipIcon
                                    icon={<Gem className="inline-block" />}
                                >
                                    Blah blah blah blah blah blah blah blah blah
                                    blah blah blah blah blah blah blah blah blah
                                    blah blah blah blah blah blah blah blah blah
                                    blah blah blah blah blah blah blah blah blah
                                    blah blah blah blah blah blah blah blah blah
                                    blah blah blah blah blah blah blah blah blah
                                    blah blah blah blah blah blah blah blah blah
                                    blah blah blah blah blah blah blah blah blah
                                </TooltipIcon>
                            ) : (
                                <>
                                    <div>
                                        {(!isWalletConnected
                                            ? 0
                                            : estimatedRewardForPower(
                                                  proposalTotalTribute(
                                                      proposal.pricedAndNamedTributes
                                                  ),
                                                  myUserVotingData?.votingPower ??
                                                      0,
                                                  Number(proposal.power ?? 0)
                                              )
                                        ).toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        })}
                                    </div>
                                    <div className="text-xs opacity-60">
                                        of{" "}
                                        {proposal.pricedAndNamedTributes
                                            .reduce((total, tribute) => {
                                                return (
                                                    total +
                                                    ((tribute.priceUsd ?? 0) *
                                                        tribute.amount) /
                                                        10 **
                                                            (tribute.decimals ??
                                                                0)
                                                )
                                            }, 0)
                                            .toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                    </div>
                                </>
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
