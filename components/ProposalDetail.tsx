"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { Proposal } from "@/app/ts_types/HydroBase.types"
import { Card } from "@/components/Card"
import { Confetti } from "@/components/Confetti"
import { Icon } from "@/components/Icon"
import { MarkdownContainer } from "@/components/MarkdownContainer"
import { ModalWindow } from "@/components/ModalWindow"
import {
  VOTE_SHARE_THRESHOLD,
  voteThresholdTooltip,
} from "@/components/ProposalsTable/ProposalsTable"
import { proposalTotalTribute } from "@/components/ProposalsTable/proposalTotalTribute"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts/Toasts"
import { Tooltip } from "@/components/Tooltip"
import { Wallet } from "@/components/wallet/Wallet"
import { executeVote, fetchMyVotes, useUserVotingData } from "@/hooks/hooks"
import { formatAmount, sumTributeAmounts } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import kebabCase from "lodash/kebabCase"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

export function ProposalDetail({
  proposal,
  deployed,
}: {
  proposal: Proposal
  deployed: boolean
}) {
  const {
    globalState,
    currentProposalTributes,
    currentProposalTranches,
    assetListWithPrices,
  } = useAppContext()
  const [hasVoted, setHasVoted] = useState(false)
  const [hasVotedThisProposal, setHasVotedThisProposal] = useState(false)
  const [openChangeVoteModal, setOpenChangeVoteModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { isWalletConnected, address, getSigningCosmWasmClient } =
    useChain("neutron")
  const [isLoading, setIsLoading] = useState(false)
  const tributes = currentProposalTributes.get(proposal.proposal_id)!
  const [isCelebrating, setIsCelebrating] = useState(false)
  const { setToasts } = useToasts()

  const fetchVoteStatus = useCallback(async () => {
    if (!address) {
      return
    }

    setIsLoading(true)

    const voteMap = await fetchMyVotes(
      address || "",
      globalState.currentRound,
      Array.from(currentProposalTranches.keys())
    )

    setIsLoading(false)

    if (voteMap && voteMap.size < 1) {
      setHasVoted(false)
      return
    }

    let voted = Array.from(voteMap.values())
      .flat()
      .find((vote) => vote?.prop_id === Number(proposal.proposal_id))

    setHasVoted(true)
    setHasVotedThisProposal(!!voted)
  }, [
    address,
    globalState.currentRound,
    proposal.proposal_id,
    currentProposalTranches,
  ])

  useEffect(() => {
    fetchVoteStatus()
  }, [fetchVoteStatus])

  const { data: userVotingData } = useUserVotingData(address || "")

  async function onVote() {
    if (!proposal) {
      return
    }
    try {
      setSubmitting(true)
      setToasts([
        {
          variant: "working",
          message: "Processing your vote...",
        },
      ])

      await executeVote(
        getSigningCosmWasmClient,
        address!,
        proposal.proposal_id,
        proposal.tranche_id
      )

      setToasts([
        {
          variant: "success",
          message: "Vote submitted",
        },
      ])
    } catch (err: any) {
      if (err && err?.message && err.message.includes("Request rejected")) {
        setToasts([
          {
            variant: "error",
            message: "Vote rejected",
          },
        ])
        return
      }
      setToasts([
        {
          variant: "error",
          message: "Vote rejected",
        },
      ])
    } finally {
      setSubmitting(false)
      setOpenChangeVoteModal(false)
      setIsCelebrating(true)
      fetchVoteStatus()
    }
  }

  function PrimaryActionButton() {
    if (deployed) {
      return null
    }

    if (!isWalletConnected) {
      return (
        <Wallet variant="button.primary.large" notifyConnectedCB={() => null} />
      )
    }

    if (isLoading) {
      return (
        <StyledText variant="button.secondary.large" as="button" disabled>
          Loading...
        </StyledText>
      )
    }

    if (submitting) {
      return (
        <StyledText as="button" disabled variant="button.secondary.large">
          Submitting...
        </StyledText>
      )
    }

    if (userVotingData?.votingPower === 0) {
      return (
        <StyledText as={Link} href="/lock-atom" variant="button.primary.large">
          Lock ATOM to vote
        </StyledText>
      )
    }

    if (hasVotedThisProposal) {
      return (
        <StyledText as="button" disabled variant="button.secondary.large">
          <Icon name="solid:circle-check" />
          <span>Voted!</span>
        </StyledText>
      )
    }

    const hasVotedElsewhere = hasVoted && !hasVotedThisProposal

    return (
      <StyledText
        as="button"
        onClick={() => {
          if (hasVotedElsewhere) {
            setOpenChangeVoteModal(true)
          } else {
            onVote()
          }
        }}
        variant="button.primary.large"
      >
        <Icon name="solid:ballot-check" />
        <span>Vote for Proposal</span>
      </StyledText>
    )
  }

  const renderedProposal = {
    ...proposal,
    ...(globalState.bidDescriptions[proposal.proposal_id] ?? {}),
  }

  const summedTributes = sumTributeAmounts(tributes)

  const pricedAndNamedTributes = summedTributes.map((tribute) => {
    console.log(
      `Getting price for ${tribute.denom} from ${assetListWithPrices.size} assets`,
      assetListWithPrices.entries()
    )
    const assetInfo = assetListWithPrices.get(tribute.denom)
    return {
      ...tribute,
      priceUsd: assetInfo?.priceUsd,
      symbol: assetInfo?.symbol,
      decimals: assetInfo?.decimals,
    }
  })

  return (
    <>
      <ModalWindow
        isOpen={openChangeVoteModal}
        onClose={() => setOpenChangeVoteModal(false)}
      >
        <Card>
          <Card.Header title="Change your vote?" />
          <Card.Body>
            Changing your vote will reallocate your total voting power to the
            new project.
          </Card.Body>
          <Card.Footer>
            <StyledText as="button" onClick={onVote} variant="button.primary">
              Change Vote to This Proposal
            </StyledText>
            <StyledText
              as="button"
              variant="button.secondary"
              onClick={() => setOpenChangeVoteModal(false)}
            >
              Don&rsquo;t change my vote
            </StyledText>
          </Card.Footer>
        </Card>
      </ModalWindow>

      <Confetti
        trigger={isCelebrating}
        onComplete={() => setIsCelebrating(false)}
      />

      <div
        className="
          relative
          overflow-hidden
          rounded-[10px]
          bg-palette-text/20
          p-12
          backdrop-blur-md
        "
      >
        {hasVotedThisProposal && (
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
                {renderedProposal.title}
              </StyledText>
            </div>

            <div className="flex flex-col gap-6 pl-16">
              {renderedProposal.description && (
                <div className="flex flex-col gap-3">
                  <StyledText
                    variant="superHeading"
                    as="h2"
                    id="bid-description"
                    className={`
                      [body:has(a[href='#bid-description']:focus)_&]:rounded-sm
                      [body:has(a[href='#bid-description']:focus)_&]:outline
                      [body:has(a[href='#bid-description']:focus)_&]:outline-2
                      [body:has(a[href='#bid-description']:focus)_&]:outline-offset-4
                      [body:has(a[href='#bid-description']:focus)_&]:outline-palette-green
                    `}
                  >
                    Bid Description
                  </StyledText>
                  <MarkdownContainer content={renderedProposal.description} />
                </div>
              )}
              {renderedProposal.committeeComments && (
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
                  <MarkdownContainer
                    content={renderedProposal.committeeComments}
                  />
                </div>
              )}
              {renderedProposal.appendix && (
                <div className="flex flex-col gap-3">
                  <StyledText
                    variant="superHeading"
                    as="h2"
                    id="appendix"
                    className="
                      [body:has(a[href='#appendix']:focus)_&]:rounded-sm
                      [body:has(a[href='#appendix']:focus)_&]:outline
                      [body:has(a[href='#appendix']:focus)_&]:outline-2
                      [body:has(a[href='#appendix']:focus)_&]:outline-offset-4
                      [body:has(a[href='#appendix']:focus)_&]:outline-palette-green
                    "
                  >
                    Appendix
                  </StyledText>
                  <MarkdownContainer content={renderedProposal.appendix} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="*:!w-full">
              <PrimaryActionButton />
            </div>

            <div className="flex flex-col gap-2">
              <StyledText as="h3" variant="label">
                Project Name
              </StyledText>

              <div className="flex flex-row items-center gap-3">
                {renderedProposal.projectLogoUrl && (
                  <div className="relative size-12">
                    <Image
                      className="object-contain"
                      src={renderedProposal.projectLogoUrl}
                      alt={renderedProposal.projectName}
                      fill={true}
                    />
                  </div>
                )}
                <StyledText className="text-xl font-bold not-italic">
                  {renderedProposal.projectName.trim()}
                </StyledText>
              </div>
            </div>

            {renderedProposal.projectType && (
              <div>
                <StyledText as="h3" variant="label">
                  Project Type
                </StyledText>
                <p className="text-xl font-bold not-italic">
                  {renderedProposal.projectType}
                </p>
              </div>
            )}

            <div>
              <StyledText as="h3" variant="label">
                Tribute to Voters
              </StyledText>
              <div className="max-w-64 overflow-x-auto">
                {pricedAndNamedTributes.length > 0 ? (
                  <>
                    {pricedAndNamedTributes.map((tribute, index) => (
                      <p
                        key={index}
                        className="break-words text-xl font-bold not-italic"
                      >
                        {formatAmount(tribute.amount)}{" "}
                        {tribute.symbol || tribute.denom}
                      </p>
                    ))}
                    <p>
                      ≈{" "}
                      {proposalTotalTribute(
                        pricedAndNamedTributes
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      USD
                    </p>
                  </>
                ) : renderedProposal.points ? (
                  <>
                    <p className="font-mono text-xl font-bold not-italic text-palette-cyan">
                      {renderedProposal.points[0].toLocaleString("en-US")}{" "}
                      {renderedProposal.points[1]}
                    </p>
                    {renderedProposal.pointProgramUrl && (
                      <p>
                        <StyledText
                          variant="link"
                          as="a"
                          href={renderedProposal.pointProgramUrl}
                          target="_blank"
                        >
                          Learn More <Icon name="solid:arrow-up-right" />
                        </StyledText>
                      </p>
                    )}
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
                <span>{proposal.percentage}%</span>
                {Number(proposal.percentage) < VOTE_SHARE_THRESHOLD && (
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
                  renderedProposal.description && "Bid Description",
                  renderedProposal.committeeComments && "Committee Review",
                  renderedProposal.appendix && "Appendix",
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
                <StyledText
                  as={Link}
                  href={renderedProposal.projectUrl}
                  target="_blank"
                  variant="link"
                  className={`
                    flex
                    items-center
                    gap-2
                    border-t
                    border-white/20
                    pt-2
                  `}
                >
                  <Icon name="solid:arrow-up-right" />
                  Project Website
                </StyledText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
