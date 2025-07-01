"use client"

import Loading from "@/app/loading"
import { BidDuration } from "@/components/BidDuration"
import { BidPolApr } from "@/components/BidPolApr"
import { BidPolSize } from "@/components/BidPolSize"
import { BidTributeApr } from "@/components/BidTributeApr"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { ErrorBox } from "@/components/ErrorBox"
import { Icon } from "@/components/Icon"
import { MarkdownContainer } from "@/components/MarkdownContainer"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  bidDetailsMaxDeploymentAmountTooltip,
  bidDetailsPolSizeTooltip,
  bidDetailsStatusTooltip,
  bidDetailsVoteReceivedTooltip,
  liveBidTributeAprColumnTooltip,
  metricsDurationColumnTooltip,
  metricsPolAprColumnTooltip,
  metricsTributeColumnTooltip,
  pastBidTributeAprBidsPageColumnTooltip,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { voteThresholdByTrancheId } from "@/config"
import { BidMetaData } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import kebabCase from "lodash/kebabCase"
import sumBy from "lodash/sumBy"
import Image from "next/image"
import Link from "next/link"

export function BidDetails({
  bidId,
  bidMetaData,
}: {
  bidId: number
  bidMetaData: BidMetaData
}) {
  const backendData = useBackendData()

  const { atomPrice, bidsInfo, currentRoundId, votes, minTributeFactor } =
    backendData

  const {
    aboutProject,
    committeeComments,
    description,
    points = [],
    projectLogoUrl,
    projectName,
    projectUrl,
    title,
  } = bidMetaData ?? {}

  if (Object.keys(bidsInfo).length === 0) {
    return <Loading />
  }

  const bid = bidsInfo[bidId]

  if (!bid) {
    return <ErrorBox>The requested bid could not be found.</ErrorBox>
  }

  if (!bid.isWhitelisted && process.env.NODE_ENV !== "development") {
    return (
      <ErrorBox>
        This bid is active on the Hydro smart contract but has not yet been
        whitelisted for the front-end by the Hydro Team. Check back later or
        contact the Hydro Team in the{" "}
        <StyledText
          as={Link}
          href="https://t.me/+xUzNOTZjUNw5Mzhk"
          variant="link"
          className="relative z-10 inline-flex items-center gap-1"
          target="_blank"
        >
          Hydro Telegram Group.
          <Icon name="solid:arrow-up-right" />
        </StyledText>
      </ErrorBox>
    )
  }

  const hasVotedForBid = votes.some((vote) => vote.bidId === bidId)

  const totalTributeValueInAtom = bid.totalTokenBasedTributeValue / atomPrice

  const maxDeploymentAmountInAtom = totalTributeValueInAtom / minTributeFactor

  const isTokenBased = points.length === 0

  const bidsInRound = Object.values(bidsInfo).filter(
    (bid) => bid.roundId === bid.roundId
  )

  const totalPowerInRound = sumBy(bidsInRound, "power")

  const votingStats = {
    bidPower: formatAmount(bid.power, 6, 0),
    totalPower: formatAmount(totalPowerInRound, 6, 0),
    percentage: formatAmount(bid.vote_perc * 100, 0, 2),
  }

  const voteThreshold =
    voteThresholdByTrancheId[
      bid.trancheId as keyof typeof voteThresholdByTrancheId
    ]

  return (
    <ContentContainer className="py-6">
      <BlurryBackdropBox className="p-4 md:p-12">
        {hasVotedForBid && (
          <div
            className="
              pointer-events-none
              absolute
              left-0
              right-0
              top-0
              -z-10
              h-96
              rounded-md
              bg-gradient-to-bl
              from-palette-green/30
              via-palette-green/0
              to-palette-green/0
            "
          />
        )}

        <div
          className="
            grid
            grid-cols-1
            gap-12
            md:grid-cols-[3fr_1fr]
          "
        >
          {/* Main Content */}
          <div className="flex flex-col gap-12">
            <StyledText
              as="button"
              variant="button.secondary.small"
              onClick={() => window.history.back()}
            >
              <Icon name="solid:chevron-left" />
              Back
            </StyledText>

            <div className="flex flex-row items-center gap-4">
              <div
                className="
                  hidden
                  size-12
                  rounded-full
                  bg-palette-beige/20
                  md:flex
                  md:shrink-0
                  md:items-center
                  md:justify-center
                "
              >
                <Icon name="solid:scroll" />
              </div>
              <StyledText as="h2" variant="h2" className="text-2xl sm:text-4xl">
                {title}
              </StyledText>
            </div>

            <div className="flex flex-col gap-6 p-0 md:pl-16">
              {aboutProject && (
                <div className="flex flex-col gap-3">
                  <StyledText
                    variant="superHeading"
                    as="h2"
                    id="about-project"
                    className="
                      [body:has(a[href='#about-project']:focus)_&]:rounded-sm
                      [body:has(a[href='#about-project']:focus)_&]:outline
                      [body:has(a[href='#about-project']:focus)_&]:outline-2
                      [body:has(a[href='#about-project']:focus)_&]:outline-offset-4
                      [body:has(a[href='#about-project']:focus)_&]:outline-palette-green
                    "
                  >
                    About Project
                  </StyledText>
                  <MarkdownContainer content={aboutProject} />
                </div>
              )}
              {description && (
                <div className="flex flex-col gap-3">
                  <StyledText
                    variant="superHeading"
                    as="h2"
                    id="bid-description"
                    className="
                      [body:has(a[href='#bid-description']:focus)_&]:rounded-sm
                      [body:has(a[href='#bid-description']:focus)_&]:outline
                      [body:has(a[href='#bid-description']:focus)_&]:outline-2
                      [body:has(a[href='#bid-description']:focus)_&]:outline-offset-4
                      [body:has(a[href='#bid-description']:focus)_&]:outline-palette-green
                    "
                  >
                    Bid Description
                  </StyledText>
                  <MarkdownContainer content={description} />
                </div>
              )}
              {committeeComments && (
                <div className="flex flex-col gap-3">
                  <StyledText
                    variant="superHeading"
                    as="h2"
                    id="committee-review"
                    className="
                      [body:has(a[href='#committee-review']:focus)_&]:rounded-sm
                      [body:has(a[href='#committee-review']:focus)_&]:outline
                      [body:has(a[href='#committee-review']:focus)_&]:outline-2
                      [body:has(a[href='#committee-review']:focus)_&]:outline-offset-4
                      [body:has(a[href='#committee-review']:focus)_&]:outline-palette-green
                    "
                  >
                    Committee Review
                  </StyledText>
                  <MarkdownContainer content={committeeComments} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {bid.roundId === currentRoundId && (
              <div className="*:!w-full">
                <VoteButton bidId={bidId} size="large" />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <StyledText as="h3" variant="label">
                Project Name
              </StyledText>

              <div className="flex flex-row items-center gap-3">
                {projectLogoUrl && (
                  <div className="relative size-12">
                    <Image
                      className="object-contain"
                      src={projectLogoUrl}
                      alt={projectName}
                      fill={true}
                    />
                  </div>
                )}
                <StyledText className="text-xl font-bold not-italic">
                  {projectName}
                </StyledText>
              </div>
            </div>

            <div className="max-w-64 overflow-x-auto text-xl font-bold">
              Round {bid.roundId + 1}
            </div>
            {(bid.liquidityDeployment?.totalRounds ?? 0) > 0 && (
              <div>
                <Tooltip tipContents={bidDetailsPolSizeTooltip}>
                  <StyledText
                    as="h3"
                    variant="label"
                    className="flex cursor-default items-center gap-1 text-palette-green"
                  >
                    <span>Amount</span>
                    <Icon name="circle-info" />
                  </StyledText>
                </Tooltip>
                <div className="max-w-64 overflow-x-auto text-xl font-bold text-palette-green">
                  <BidPolSize bidId={bidId} />
                </div>
              </div>
            )}

            <div>
              <Tooltip tipContents={bidDetailsStatusTooltip}>
                <StyledText
                  as="h3"
                  variant="label"
                  className="flex cursor-default items-center gap-1 text-palette-green"
                >
                  <span>Status</span>
                  <Icon name="circle-info" />
                </StyledText>
              </Tooltip>

              <div className="max-w-64 overflow-x-auto text-xl font-bold capitalize text-palette-green">
                {bid.status}
              </div>
            </div>

            {["ongoing", "completed"].includes(bid.status?.toLowerCase()) && (
              <>
                <div>
                  <Tooltip tipContents={metricsDurationColumnTooltip}>
                    <StyledText
                      as="h3"
                      variant="label"
                      className="flex cursor-default items-center gap-1"
                    >
                      <span>Duration</span>
                      <Icon name="circle-info" />
                    </StyledText>
                  </Tooltip>

                  <div className="max-w-64 overflow-x-auto text-xl font-bold">
                    <BidDuration bidId={bidId} />
                  </div>
                </div>

                {isTokenBased && (
                  <div>
                    <Tooltip tipContents={metricsPolAprColumnTooltip}>
                      <StyledText
                        as="h3"
                        variant="label"
                        className="flex cursor-default items-center gap-1"
                      >
                        <span>Total APR</span>
                        <Icon name="circle-info" />
                      </StyledText>
                    </Tooltip>
                    <div className="max-w-64 overflow-x-auto text-xl font-bold">
                      <BidPolApr />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <Tooltip
                tipContents={
                  !isTokenBased
                    ? metricsTributeColumnTooltip
                    : bid.roundId === currentRoundId
                      ? liveBidTributeAprColumnTooltip
                      : pastBidTributeAprBidsPageColumnTooltip
                }
              >
                <StyledText
                  as="h3"
                  variant="label"
                  className="flex cursor-default items-center gap-1"
                >
                  <span>Voter APR</span>
                  <Icon name="circle-info" />
                </StyledText>
              </Tooltip>

              <div className="flex max-w-64 flex-col overflow-x-auto text-xl font-bold">
                <BidTributeApr bidId={bidId} />
              </div>
            </div>

            {/* Only relevant from round 3 onwards; rounds are 0-indexed */}
            {/* And if there are any point-based tribute amounts, we can't show this */}
            {bid.roundId >= 2 && !bid.points?.length && (
              <Tooltip tipContents={bidDetailsMaxDeploymentAmountTooltip}>
                <StyledText
                  as="h3"
                  variant="label"
                  className="flex cursor-default items-center gap-1"
                >
                  <span>Max Deployment Amount</span>
                  <Icon name="circle-info" />
                </StyledText>
                <div className="max-w-64 overflow-x-auto text-xl font-bold">
                  ~{formatAmount(maxDeploymentAmountInAtom * 1e6, undefined, 0)}{" "}
                  ATOM
                </div>
              </Tooltip>
            )}

            <div>
              <Tooltip
                tipContents={bidDetailsVoteReceivedTooltip(votingStats)}
                classNamesForTooltip="w-72"
              >
                <StyledText
                  as="h3"
                  variant="label"
                  className="flex cursor-default items-center gap-1"
                >
                  <span>% Vote Received</span>
                  <Icon name="circle-info" />
                </StyledText>
              </Tooltip>
              <div
                className="
                  flex
                  flex-row
                  items-center
                  gap-2
                  text-xl
                  font-bold
                  not-italic
                "
              >
                <StyledText variant="mathSymbol.container">
                  <span>{Math.round(bid.vote_perc * 100)}</span>
                  <StyledText variant="mathSymbol">%</StyledText>
                </StyledText>
                {bid.vote_perc < voteThreshold && (
                  <Tooltip
                    tipContents={voteThresholdTooltip({
                      trancheId: bid.trancheId,
                    })}
                  >
                    <span
                      className="
                        flex
                        cursor-default
                        items-center
                        gap-1
                        whitespace-nowrap
                        text-xs
                        font-normal
                        text-palette-beige
                      "
                    >
                      <Icon
                        name="solid:circle"
                        className="text-palette-beige"
                      />
                      <span>Below Threshold</span>
                    </span>
                  </Tooltip>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <StyledText as="h3" variant="label">
                Jump To
              </StyledText>
              <div className="flex flex-col items-start gap-2">
                {[
                  aboutProject && "About Project",
                  description && "Bid Description",
                  committeeComments && "Committee Review",
                ]
                  .filter(Boolean)
                  .map((section, index) => (
                    <StyledText
                      as={Link}
                      className="flex flex-row items-center gap-2"
                      key={index}
                      href={`#${kebabCase(section)}`}
                      variant="link"
                    >
                      <Icon name="solid:link" />
                      <span>{section}</span>
                    </StyledText>
                  ))}
                {projectUrl && (
                  <StyledText
                    as={Link}
                    href={projectUrl}
                    target="_blank"
                    variant="link"
                    className="
                      flex
                      items-center
                      gap-2
                      border-t
                      border-white/20
                      pt-2
                    "
                  >
                    <Icon name="solid:arrow-up-right" />
                    Project Website
                  </StyledText>
                )}
              </div>
            </div>
          </div>
        </div>
      </BlurryBackdropBox>
    </ContentContainer>
  )
}
