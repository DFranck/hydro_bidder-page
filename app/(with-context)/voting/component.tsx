"use client"

import { useAppContext } from "@/app/context"
import { Icon } from "@/components/Icon"
import { PrettyTable, TR } from "@/components/PrettyTable"
import { Tooltip } from "@/components/Tooltip"
import { useMyVotes, useUserVotingData } from "@/hooks/hooks"
import { estimatedRewardForPower, sumTributeAmounts } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { sum } from "lodash"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { twJoin } from "tailwind-merge"
import { WelcomePopup } from "../../../components/WelcomePopup"

const commonClassNames = {
    container: twJoin(`
        -mx-3
        space-y-6
        rounded-md
        bg-palette-text/20
        px-3
        backdrop-blur-md
    `),
    percentageOfNonVoters: twJoin(`
        flex
        items-center
        justify-center
        gap-2
        whitespace-nowrap
        rounded-md
        bg-palette-blue/20
        p-3
        text-sm
        text-white
    `),
    classNamesForCells: twJoin(`
        group-hover/table-row:text-palette-green
        sm:group-[&.has-voted]/table-row:border-y-2
        sm:group-[&.has-voted]/table-row:border-palette-green
        sm:group-[&.has-voted:hover]/table-row:text-palette-green
        sm:group-[&.has-voted]/table-row:first:border-l-2
        sm:group-[&.has-voted]/table-row:last:border-r-2
    `),
    hasVotedIcon: twJoin(`
        relative
        -translate-y-1
        text-3xl
        text-palette-green
    `),
    hasVotedLabel: twJoin(`
        absolute
        left-1/2
        top-full
        flex
        w-min
        -translate-x-1/2
        -translate-y-1/2
        items-center
        gap-2
        whitespace-nowrap
        rounded-full
        bg-palette-green
        p-1
        text-[8px]
        leading-none
        text-palette-text
    `),
    projectLogo: twJoin(`
        relative
        size-12
    `),
    projectTitle: twJoin(`
        line-clamp-2
        text-lg
        font-semibold
    `),
    projectLink: twJoin(`
        absolute
        inset-0
        z-10
        h-full
        w-full
    `),
    noBids: twJoin(`
        !mb-6
        rounded-md
        border
        border-dashed
        border-palette-beige/20
        py-12
        text-center
        text-white/60
    `),
    hasVotedRow: twJoin(`
        has-voted
        max-sm:bg-palette-green
        max-sm:text-palette-text
        max-sm:hover:bg-palette-green/80
    `),
}

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
    } = useAppContext()

    const [currentTranche, setCurrentTranche] = useState(
        searchParams.tranche ? parseInt(searchParams.tranche as string, 10) : 1
    )

    const { isWalletConnected, address } = useChain("neutron")

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
            ...(globalState.bidDescriptions[proposal.proposal_id] ?? {}),
            pricedAndNamedTributes,
            hasVotedOnProp,
        }
    })

    const hasVoted = decoratedProposals?.some(
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

    const percentageOfNonVoters =
        100 -
        sum(decoratedProposals?.map((proposal) => Number(proposal.percentage)))

    return (
        <>
            <div className={commonClassNames.container}>
                {decoratedProposals?.length ? (
                    <PrettyTable
                        initialSortedColumnKey="currentVoteShare"
                        contentForFirstRow={
                            percentageOfNonVoters && (
                                <tr>
                                    <td colSpan={99}>
                                        <div
                                            className={
                                                commonClassNames.percentageOfNonVoters
                                            }
                                        >
                                            <Icon name="solid:ghost" />
                                            <Tooltip
                                                tipContents={
                                                    <span>
                                                        <strong>
                                                            {
                                                                percentageOfNonVoters
                                                            }
                                                            %
                                                        </strong>{" "}
                                                        of total voting power
                                                        has not been allocated
                                                        to project bids yet.{" "}
                                                        <a
                                                            href="/docs/users/voting-for-projects"
                                                            target="_blank"
                                                            className="inline-flex items-center gap-1 text-palette-green underline"
                                                        >
                                                            Learn more
                                                            <Icon name="solid:arrow-up-right" />
                                                        </a>
                                                    </span>
                                                }
                                            >
                                                <span>
                                                    <strong>
                                                        {percentageOfNonVoters}%
                                                    </strong>{" "}
                                                    have not voted yet
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                        columns={[
                            {
                                key: "hasVoted",
                                label: "",
                                isSortable: false,
                                propsForHeaderCell: {
                                    className: twJoin(`
                                    w-0
                                    !pr-0
                                `),
                                },
                                propsForCells: {
                                    className: twJoin(`
                                        ${commonClassNames.classNamesForCells}
                                        w-0
                                        !pr-0
                                    `),
                                },
                            },
                            {
                                key: "name",
                                label: (
                                    <div className="flex items-center gap-1">
                                        Project Bid
                                        <Tooltip
                                            tipContents={
                                                <>
                                                    Bids are submitted by
                                                    projects. You can only vote
                                                    once (per bucket per
                                                    tranche) but you can switch
                                                    your vote as many times as
                                                    you want
                                                </>
                                            }
                                        />
                                    </div>
                                ),
                                isSortable: true,
                                propsForCells: {
                                    className:
                                        commonClassNames.classNamesForCells,
                                },
                                customValueGetter: (row) => row._proposal.title,
                            },
                            {
                                key: "yourEstimatedReward",
                                label: (
                                    <div className="flex items-center gap-1">
                                        Your Est. Reward
                                        <Tooltip
                                            tipContents={
                                                <>
                                                    This is the tribute value
                                                    that will be paid out to you
                                                    when the round ends if you
                                                    vote for this project. It
                                                    may increase (if the project
                                                    adds to the tribute) or
                                                    decrease (if more voters
                                                    choose this project){" "}
                                                    <span className="whitespace-nowrap">
                                                        over time.
                                                    </span>
                                                </>
                                            }
                                        />
                                    </div>
                                ),
                                isSortable: true,
                                textAlign: "right",
                                propsForCells: {
                                    className:
                                        commonClassNames.classNamesForCells,
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
                                        <Tooltip
                                            classNamesForTooltip="-ml-24"
                                            tipContents={
                                                <>
                                                    This is the percentage of
                                                    votes that this project has
                                                    received so far. It may
                                                    increase or decrease if
                                                    other users decide to switch
                                                    their votes before the round
                                                    ends
                                                </>
                                            }
                                        />
                                    </div>
                                ),
                                isSortable: true,
                                initialSortDirection: "DESC",
                                textAlign: "right",
                                propsForCells: {
                                    className:
                                        commonClassNames.classNamesForCells,
                                },
                                customValueGetter: (row) =>
                                    Number(row._proposal.percentage),
                            },
                        ]}
                        rows={decoratedProposals.map((proposal) => ({
                            _proposal: proposal,

                            hasVoted:
                                hasVoted && proposal.hasVotedOnProp ? (
                                    <div
                                        className={
                                            commonClassNames.hasVotedIcon
                                        }
                                    >
                                        <Icon name="regular:circle-check" />

                                        <div
                                            className={
                                                commonClassNames.hasVotedLabel
                                            }
                                        >
                                            Your Pick
                                        </div>
                                    </div>
                                ) : (
                                    <Icon
                                        className="text-2xl"
                                        name="regular:scroll"
                                    />
                                ),

                            name: (
                                <>
                                    <div className="flex items-center gap-6">
                                        {proposal.projectLogoUrl && (
                                            <div
                                                className={
                                                    commonClassNames.projectLogo
                                                }
                                            >
                                                <Image
                                                    className="object-contain"
                                                    src={
                                                        proposal.projectLogoUrl
                                                    }
                                                    alt={proposal.projectName}
                                                    fill={true}
                                                />
                                            </div>
                                        )}
                                        <p
                                            className={
                                                commonClassNames.projectTitle
                                            }
                                        >
                                            {proposal.title.replace(
                                                /[ ]([^ ]+?)$/gm,
                                                `${String.fromCharCode(160)}$1`
                                            )}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/voting/${proposal.proposal_id}`}
                                        className={commonClassNames.projectLink}
                                    />
                                </>
                            ),

                            yourEstimatedReward: proposal.points ? (
                                <Tooltip
                                    tipContents={
                                        <>
                                            This project is using a point
                                            system. Voters get points instead of
                                            live tokens. In this bid,{" "}
                                            <var className="font-mono font-bold not-italic text-palette-cyan">
                                                {proposal.points[0].toLocaleString(
                                                    "en-US"
                                                )}{" "}
                                                {proposal.points[1]}
                                            </var>{" "}
                                            would be distributed as tribute.{" "}
                                            {proposal.pointProgramUrl && (
                                                <a
                                                    href={
                                                        proposal.pointProgramUrl
                                                    }
                                                    className="inline-flex items-center gap-1 text-palette-green underline"
                                                    target="_blank"
                                                >
                                                    Learn More{" "}
                                                    <Icon name="solid:arrow-up-right" />
                                                </a>
                                            )}
                                        </>
                                    }
                                >
                                    <Icon name="solid:gem" />
                                </Tooltip>
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
                                        ? commonClassNames.hasVotedRow
                                        : undefined
                                }
                                key={row._proposal.proposal_id}
                                {...rowProps}
                            >
                                {children}
                            </TR>
                        )}
                    />
                ) : (
                    <div className={commonClassNames.noBids}>
                        <p>There are no bids available at this moment.</p>
                    </div>
                )}
            </div>

            <WelcomePopup showModal={showWelcomeModal} />
        </>
    )
}

export default ActiveProposals
