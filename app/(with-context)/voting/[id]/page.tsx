"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { MarkdownContainer } from "@/components/MarkdownContainer"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ToolTips"
import { VoteButton } from "@/components/VoteButton"
import { useContractContext } from "@/contract-apis/useContractContext"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { kebabCase } from "lodash"
import Image from "next/image"
import Link from "next/link"

export default function DetailsPage({ params }: { params: { id: string } }) {
  const { bidsByRoundId } = useContractContext()

  const bid = Object.values(bidsByRoundId)
    .flat()
    .find((bid) => bid.id === Number(params.id))

  if (!bid) {
    return <>The requested proposal could not be found.</>
  }

  return (
    <ContentContainer className="py-6">
      <BlurryBackdropBox className="p-12">
        {bid.hasVotedForBid && (
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
              as={Link}
              href="/voting"
              variant="button.secondary.small"
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
                {bid.title}
              </StyledText>
            </div>

            <div className="flex flex-col gap-6 pl-16">
              {/* {bid.aboutProject && (
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
                  <MarkdownContainer content={bid.aboutProject} />
                </div>
              )} */}
              {bid.description && (
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
                  <MarkdownContainer content={bid.description} />
                </div>
              )}
              {bid.comments && (
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
                  <MarkdownContainer content={bid.comments} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="*:!w-full">
              <VoteButton bidId={bid.id} size="large" />
            </div>

            <div className="flex flex-col gap-2">
              <StyledText as="h3" variant="label">
                Project Name
              </StyledText>

              <div className="flex flex-row items-center gap-3">
                {bid.projectLogoUrl && (
                  <div className="relative size-12">
                    <Image
                      className="object-contain"
                      src={bid.projectLogoUrl}
                      alt={bid.title}
                      fill={true}
                    />
                  </div>
                )}
                <StyledText className="text-xl font-bold not-italic">
                  {bid.project}
                </StyledText>
              </div>
            </div>

            <div>
              <StyledText as="h3" variant="label">
                Tribute to Voters
              </StyledText>
              <div className="max-w-64 overflow-x-auto">
                {bid.onchainTributeAssets.length > 0 ? (
                  <>
                    {bid.onchainTributeAssets.map((tribute, index) => (
                      <p
                        key={index}
                        className="break-words text-xl font-bold not-italic"
                      >
                        {tribute.amount.toLocaleString()}&nbsp;{tribute.asset}
                      </p>
                    ))}
                    <p>≈ {amountToUSDString(bid.onchainTributeUsdc)}</p>
                  </>
                ) : bid.offchainTribute.length > 0 ? (
                  <>
                    {bid.offchainTribute.map((tribute, index) => (
                      <p
                        key={index}
                        className="font-mono text-xl font-bold not-italic text-palette-cyan"
                      >
                        {tribute.amount.toLocaleString()}&nbsp;{tribute.type}
                      </p>
                    ))}
                    <p>
                      <StyledText
                        variant="link"
                        as="a"
                        href={bid.offchainTributeInfo}
                        target="_blank"
                      >
                        Learn More <Icon name="solid:arrow-up-right" />
                      </StyledText>
                    </p>
                  </>
                ) : (
                  "None"
                )}
              </div>
            </div>

            <div>
              <StyledText as="h3" variant="label">
                Current Vote Percentage
              </StyledText>
              <p
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
                <span>{Math.round(bid.votingPowerPercentage * 100)}%</span>
                {bid.votingPowerPercentage < VOTE_SHARE_THRESHOLD && (
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
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <StyledText as="h3" variant="label">
                Jump To
              </StyledText>
              <div className="flex flex-col items-start gap-2">
                {[
                  // bid.aboutProject && "About Project",
                  bid.description && "Bid Description",
                  bid.comments && "Committee Comments",
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
                {bid.projectUrl && (
                  <StyledText
                    as={Link}
                    href={bid.projectUrl}
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
