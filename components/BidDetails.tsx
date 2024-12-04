"use client"

import { BidTributes } from "@/components/BidTributes"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { ErrorBox } from "@/components/ErrorBox"
import { Icon } from "@/components/Icon"
import { MarkdownContainer } from "@/components/MarkdownContainer"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { BID_DESCRIPTIONS_URL } from "@/contract-apis/fetchBidDescriptions"
import { useBackendData } from "@/contract-apis/useBackendData"
import { kebabCase } from "lodash"
import Image from "next/image"
import Link from "next/link"

export function BidDetails({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidDescriptionsByBidId, bidsByRoundId, votes } = backendData

  const bid = Object.values(bidsByRoundId)
    .flat()
    .find((bid) => bid.id === bidId)

  if (!bid) {
    return <ErrorBox>The requested bid could not be found.</ErrorBox>
  }

  const bidDescription = bidDescriptionsByBidId[bidId]

  if (!bidDescription) {
    return (
      <ErrorBox>
        The requested bid is not listed in the official{" "}
        <StyledText
          as={Link}
          href={BID_DESCRIPTIONS_URL}
          target="_blank"
          variant="link"
          className="flex items-center gap-1 whitespace-nowrap"
        >
          <code>bid-descriptions.json</code>
          <Icon name="solid:arrow-up-right-from-square" />
        </StyledText>
      </ErrorBox>
    )
  }

  const {
    committeeComments,
    description,
    projectAbout,
    projectLogoUrl,
    projectName,
    projectUrl,
    requestAmount,
    title,
  } = bidDescription

  const hasVotedForBid = votes.some((vote) => vote.bidId === Number(bidId))

  return (
    <ContentContainer className="py-6">
      <BlurryBackdropBox className="p-12">
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
                  flex
                  size-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-palette-beige/20
                "
              >
                <Icon name="solid:scroll" />
              </div>
              <StyledText as="h2" variant="h2">
                {title}
              </StyledText>
            </div>

            <div className="flex flex-col gap-6 pl-16">
              {projectAbout && (
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
                  <MarkdownContainer content={projectAbout} />
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
            <div className="*:!w-full">
              <VoteButton bidId={bidId} size="large" />
            </div>

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

            <div>
              <StyledText as="h3" variant="label">
                Tribute to Voters
              </StyledText>
              <div className="max-w-64 overflow-x-auto">
                <BidTributes bid={bid} />
              </div>
            </div>

            <div>
              <StyledText as="h3" variant="label">
                Vote Percentage
              </StyledText>
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
                <span>{Math.round(Math.round(bid.percentage * 100))}%</span>
                {bid.percentage < VOTE_SHARE_THRESHOLD && (
                  <Tooltip tipContents={voteThresholdTooltip}>
                    <span
                      className="
                        flex
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
                  bidDescription.projectAbout && "About Project",
                  bidDescription.description && "Bid Description",
                  bidDescription.committeeComments && "Committee Review",
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
