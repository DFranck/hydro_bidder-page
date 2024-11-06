"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { classNames } from "@/app/(with-context)/voting/classNames"
import { Icon } from "@/components/Icon"
import { PrettyTable, TD, TR } from "@/components/PrettyTable"
import { Tooltip } from "@/components/Tooltip"
import { useMyVotes, useUserVotingData } from "@/hooks/hooks"
import { estimatedRewardForPower, sumTributeAmounts } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { sum } from "lodash"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Fragment, useState } from "react"
import { twJoin } from "tailwind-merge"
import { WelcomePopup } from "../WelcomePopup"
import { proposalTotalTribute } from "./proposalTotalTribute"

export const VOTE_SHARE_THRESHOLD = 5

export const voteThresholdTooltip = (
  <>
    Bids below the minimum threshold of{" "}
    <strong>{VOTE_SHARE_THRESHOLD}% total voting power</strong> will not receive
    liquidity, and will not pay out rewards to users.
  </>
)

export const usdDisclaimerTooltip = (
  <>
    USD equivalent values are estimates and may not reflect the actual current
    value.
  </>
)

export function ProposalsTable({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
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
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`, {
      scroll: false,
    })
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

  function renderRow({
    children,
    row,
    rowIndex,
    rowProps,
    sortedColumnKey,
    sortedRows,
  }: {
    children: React.ReactNode
    row: any
    rowIndex: number
    rowProps: React.ComponentPropsWithRef<"tr">
    sortedColumnKey: keyof typeof row
    sortedRows: typeof decoratedProposals
  }) {
    const previousRow = sortedRows?.[rowIndex - 1] as any
    const shouldShowThresholdLine =
      sortedColumnKey === "currentVoteShare" &&
      previousRow &&
      Number(previousRow._proposal.percentage) >= VOTE_SHARE_THRESHOLD &&
      Number(row._proposal.percentage) < VOTE_SHARE_THRESHOLD

    return (
      <Fragment key={row._proposal.proposal_id}>
        {shouldShowThresholdLine && (
          <TR>
            <TD colSpan={99} className="!p-0">
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  whitespace-nowrap
                  text-xs
                  text-palette-beige
                "
              >
                <div
                  className="
                    w-full
                    border-t-2
                    border-palette-beige
                  "
                />

                <div className="flex items-center gap-1">
                  <Icon name="solid:triangle-exclamation" />
                  <span>
                    These bids are below the{" "}
                    <strong>
                      {VOTE_SHARE_THRESHOLD}% vote share threshold
                    </strong>
                  </span>
                  <Tooltip tipContents={voteThresholdTooltip} />
                </div>

                <div
                  className="
                    w-full
                    border-t-2
                    border-palette-beige
                  "
                />
              </div>
            </TD>
          </TR>
        )}
        <TR
          className={
            row._proposal.hasVotedOnProp ? classNames.hasVotedRow : undefined
          }
          key={row._proposal.proposal_id}
          {...rowProps}
        >
          {children}
        </TR>
      </Fragment>
    )
  }

  return (
    <>
      <div className={classNames.container}>
        {decoratedProposals?.length ? (
          <PrettyTable
            initialSortedColumnKey="currentVoteShare"
            contentForFirstRow={
              !!percentageOfNonVoters && (
                <tr>
                  <td colSpan={99}>
                    <div className={classNames.percentageOfNonVoters}>
                      <Icon name="solid:ghost" />
                      <Tooltip
                        tipContents={
                          <span>
                            <strong>{percentageOfNonVoters}%</strong> of total
                            voting power has not been allocated to project bids
                            yet.{" "}
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
                          <strong>{percentageOfNonVoters}%</strong> have not
                          voted yet
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
                    ${classNames.classNamesForCells}
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
                          Bids are submitted by projects. You can only vote once
                          (per bucket per tranche) but you can switch your vote
                          as many times as you want
                        </>
                      }
                    />
                  </div>
                ),
                isSortable: true,
                propsForCells: {
                  className: classNames.classNamesForCells,
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
                          This is the tribute value that will be paid out to you
                          when the round ends if you vote for this project. It
                          may increase (if the project adds to the tribute) or
                          decrease (if more voters choose this project){" "}
                          <span className="whitespace-nowrap">over time.</span>
                        </>
                      }
                    />
                  </div>
                ),
                isSortable: true,
                textAlign: "right",
                propsForCells: {
                  className: classNames.classNamesForCells,
                },
                customValueGetter: (row) =>
                  estimatedRewardForPower(
                    proposalTotalTribute(row._proposal.pricedAndNamedTributes),
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
                          This is the percentage of votes that this project has
                          received so far. It may increase or decrease if other
                          users decide to switch their votes before the round
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
                  className: classNames.classNamesForCells,
                },
                customValueGetter: (row) => Number(row._proposal.percentage),
              },
            ]}
            rows={decoratedProposals.map((proposal, index) => ({
              _proposal: proposal,

              hasVoted:
                hasVoted && proposal.hasVotedOnProp ? (
                  <div className={classNames.hasVotedIcon}>
                    <Icon name="regular:circle-check" />

                    <div className={classNames.hasVotedLabel}>Your Pick</div>
                  </div>
                ) : (
                  <Icon className="text-2xl" name="regular:scroll" />
                ),

              name: (
                <>
                  <div className="flex items-center gap-6">
                    {proposal.projectLogoUrl && (
                      <div className={classNames.projectLogo}>
                        <Image
                          className="object-contain"
                          src={proposal.projectLogoUrl}
                          alt={proposal.projectName}
                          fill={true}
                        />
                      </div>
                    )}
                    <p className={classNames.projectTitle}>
                      {proposal.title.replace(
                        /[ ]([^ ]+?)$/gm,
                        `${String.fromCharCode(160)}$1`
                      )}
                    </p>
                  </div>
                  <Link
                    href={`/voting/${proposal.proposal_id}`}
                    className={classNames.projectLink}
                  />
                </>
              ),

              yourEstimatedReward: proposal.points ? (
                <Tooltip
                  tipContents={
                    <>
                      This project is using a point system. Voters get points
                      instead of live tokens. In this bid,{" "}
                      <var className="font-mono font-bold not-italic text-palette-cyan">
                        {proposal.points[0].toLocaleString("en-US")}{" "}
                        {proposal.points[1]}
                      </var>{" "}
                      would be distributed as tribute.{" "}
                      {proposal.pointProgramUrl && (
                        <a
                          href={proposal.pointProgramUrl}
                          className="inline-flex items-center gap-1 text-palette-green underline"
                          target="_blank"
                        >
                          Learn More <Icon name="solid:arrow-up-right" />
                        </a>
                      )}
                    </>
                  }
                >
                  <Icon name="solid:gem" />
                </Tooltip>
              ) : (
                <Tooltip tipContents={usdDisclaimerTooltip}>
                  <div>
                    {(!isWalletConnected
                      ? 0
                      : estimatedRewardForPower(
                          proposalTotalTribute(proposal.pricedAndNamedTributes),
                          myUserVotingData?.votingPower ?? 0,
                          Number(proposal.power ?? 0)
                        )
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="whitespace-nowrap text-xs opacity-60">
                    of{" "}
                    {proposalTotalTribute(
                      proposal.pricedAndNamedTributes
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </Tooltip>
              ),

              currentVoteShare: (
                <div className="flex flex-row-reverse items-center gap-1">
                  {proposal.percentage}%
                  {Number(proposal.percentage) < VOTE_SHARE_THRESHOLD && (
                    <Tooltip
                      tipContents={voteThresholdTooltip}
                      classNamesForTooltip="-ml-24"
                    >
                      <Icon
                        name="solid:triangle-exclamation"
                        className="text-palette-beige"
                      />
                    </Tooltip>
                  )}
                </div>
              ),
            }))}
            renderRow={({
              children,
              row,
              rowIndex,
              rowProps,
              sortedColumnKey,
              sortedRows,
            }) => {
              const previousRow = sortedRows?.[rowIndex - 1] as any
              const shouldShowThresholdLine =
                sortedColumnKey === "currentVoteShare" &&
                previousRow &&
                Number(previousRow._proposal.percentage) >=
                  VOTE_SHARE_THRESHOLD &&
                Number(row._proposal.percentage) < VOTE_SHARE_THRESHOLD

              return (
                <Fragment key={row._proposal.proposal_id}>
                  {!!shouldShowThresholdLine && (
                    <TR>
                      <TD colSpan={99} className="!p-0">
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            whitespace-nowrap
                            text-xs
                            text-palette-beige
                          "
                        >
                          <div
                            className="
                              w-full
                              border-t-2
                              border-palette-beige
                            "
                          />

                          <div className="flex items-center gap-1">
                            <Icon name="solid:triangle-exclamation" />
                            <span>
                              These bids are below the{" "}
                              <strong>
                                {VOTE_SHARE_THRESHOLD}% vote share threshold
                              </strong>
                            </span>
                            <Tooltip tipContents={voteThresholdTooltip} />
                          </div>

                          <div
                            className="
                              w-full
                              border-t-2
                              border-palette-beige
                            "
                          />
                        </div>
                      </TD>
                    </TR>
                  )}
                  <TR
                    className={
                      row._proposal.hasVotedOnProp
                        ? classNames.hasVotedRow
                        : undefined
                    }
                    key={row._proposal.proposal_id}
                    {...rowProps}
                  >
                    {children}
                  </TR>
                </Fragment>
              )
            }}
          />
        ) : (
          <div className={classNames.noBids}>
            <p>There are no bids available at this moment.</p>
          </div>
        )}
      </div>

      <WelcomePopup showModal={showWelcomeModal} />
    </>
  )
}
