"use client"

import { BidTribute } from "@/components/BidTribute"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Confetti } from "@/components/Confetti"
import { ContentContainer } from "@/components/ContentContainer"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { InvisibleLink } from "@/components/InvisibleLink"
import { ModalWindow } from "@/components/ModalWindow"
import { AllTimeAprWallet } from "@/components/StatCards/cards/AllTimeAprWallet"
import { AllTimeRewardsWallet } from "@/components/StatCards/cards/AllTimeRewardsWallet"
import { CurrentRoundAprWallet } from "@/components/StatCards/cards/CurrentRoundAprWallet"
import { StatCardsContainer } from "@/components/StatCards/StatCardsContainer"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  rewardsTotalTributeColumnTooltip,
  rewardsYourTributeColumnTooltip,
  rewardsYourTributeTooltip,
} from "@/components/ToolTips"
import { AugmentedClaim, TokenBasedTribute } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import sumBy from "lodash/sumBy"
import Image from "next/image"
import { MouseEvent, useState } from "react"
import ClaimRewardsStepper from "./ClaimRewardsStepper"
import { ClaimStakingRewards } from "./ClaimStakingRewards"

export default function RewardsPage() {
  const [isCelebrating, setIsCelebrating] = useState(false)

  const {
    bidMetaDataById,
    bidsInfo,
    claimsHistorical,
    claimsOutstanding,
    currentRoundId,
    votes,
  } = useBackendData()
  const bids = Object.values(bidsInfo)

  const votesFromPreviousRounds = votes.filter(
    (vote) => bidsInfo[vote.bidId]?.roundId < currentRoundId,
  )

  const bidsToRender = bids.filter(
    (bid) =>
      votesFromPreviousRounds.some((vote) => vote.bidId === bid.id) && // user voted
      bid.roundId < currentRoundId && // previous rounds
      bid.tokenBasedTributes.length > 0, // has token-based tribute
  )

  const [selectedTribute, setSelectedTribute] =
    useState<TokenBasedTribute | null>(null)

  const selectedBid = selectedTribute ? bidsInfo[selectedTribute.bidId] : null

  const findClaimAmountForTribute = (
    claimsArray: AugmentedClaim[],
    tribute: TokenBasedTribute,
  ) => {
    return claimsArray.find(
      (claim) =>
        claim.bidId === tribute.bidId &&
        claim.tributeId === tribute.id &&
        claim.roundId === tribute.roundId &&
        claim.trancheId === tribute.trancheId,
    )?.amount
  }

  const claimAmount = selectedTribute
    ? (findClaimAmountForTribute(claimsOutstanding, selectedTribute) ??
      findClaimAmountForTribute(claimsHistorical, selectedTribute))
    : null

  // Bids can have multiple tributes, so this turns each into a row
  const rows = bidsToRender
    .map((bid) => {
      const bidUrl = `/bids/${bid.id}`
      const bidDescriptionFromGithub = bidMetaDataById[bid.id]
      const { projectLogoUrl, projectName, title } = bidDescriptionFromGithub
      return bid.tokenBasedTributes.map((tribute) => {
        const findClaimForBid = (claim: (typeof claimsOutstanding)[number]) =>
          claim.bidId === bid.id &&
          claim.tributeId === tribute.id &&
          claim.roundId === bid.roundId &&
          claim.trancheId === bid.trancheId
        const matchingOutstandingClaim = claimsOutstanding.find(findClaimForBid)
        const matchingHistoricalClaim = claimsHistorical.find(findClaimForBid)
        const matchingClaim =
          matchingOutstandingClaim ?? matchingHistoricalClaim
        const matchingClaimAmount = matchingClaim?.amount
        const rewardsInUsd = matchingClaimAmount?.valueUsd ?? 0
        const totalDeployedFunds = sumBy(
          bid.liquidityDeployment?.deployedFunds,
          "amount",
        )

        const canClaim = Boolean(matchingOutstandingClaim)
        const isClaimed = Boolean(matchingHistoricalClaim)
        const hasDeployment = Boolean(bid.liquidityDeployment)
        const isFunded = hasDeployment && totalDeployedFunds > 0
        const isRefundable = hasDeployment && totalDeployedFunds === 0

        return {
          _bid: bid,

          _tribute: tribute,

          roundNumber: (
            <InvisibleLink href={bidUrl}>{bid.roundId + 1}</InvisibleLink>
          ),

          bidTitleAndProjectName: (
            <InvisibleLink href={bidUrl}>
              <div className="flex items-center gap-6">
                {projectLogoUrl ? (
                  <div className="relative size-12">
                    <Image
                      className="object-contain"
                      src={projectLogoUrl}
                      alt={projectName}
                      fill={true}
                    />
                  </div>
                ) : null}
                <div className="flex flex-col">
                  <StyledText variant="h4">{title}</StyledText>
                  <StyledText variant="footnote">{projectName}</StyledText>
                </div>
              </div>
            </InvisibleLink>
          ),

          totalTribute: (
            <InvisibleLink href={bidUrl}>
              <BidTribute bidId={bid.id} textAlign="right" />
            </InvisibleLink>
          ),

          yourTribute: (
            <InvisibleLink href={bidUrl}>
              {!matchingClaimAmount ? (
                <div>&ndash;</div>
              ) : (
                <ConditionalWrapper
                  condition={rewardsInUsd > 0}
                  wrapper={(children) => (
                    <Tooltip tipContents={rewardsYourTributeTooltip}>
                      <div>{children}</div>
                      <StyledText variant="footnote">
                        (
                        {amountToUSDString(rewardsInUsd, {
                          appendUsd: false,
                          numberOfDecimals: 2,
                          removeTrailingZeros: true,
                        })}{" "}
                        <Icon name="circle-info" />)
                      </StyledText>
                    </Tooltip>
                  )}
                >
                  {matchingClaimAmount?.printableAmount.toLocaleString(
                    "en-US",
                    {
                      maximumFractionDigits: 3,
                      trailingZeroDisplay: "stripIfInteger",
                    },
                  )}
                  &nbsp;
                  {matchingClaimAmount?.humanReadableDenom?.slice(0, 12) ??
                    tribute.denom?.slice(0, 12)}
                </ConditionalWrapper>
              )}
            </InvisibleLink>
          ),

          claimStatus: (
            <InvisibleLink href={bidUrl}>
              <div className="flex items-center justify-end gap-2">
                {canClaim ? (
                  <StyledText
                    as="button"
                    variant="button.primary.small"
                    onClick={() => setSelectedTribute(tribute)}
                  >
                    Claim
                  </StyledText>
                ) : isClaimed ? (
                  <div className="flex items-center gap-1">
                    Claimed <Icon name="check" />
                  </div>
                ) : isRefundable ? (
                  <>Refundable</>
                ) : !hasDeployment ? (
                  <div className="flex items-center gap-1">
                    Pending Deployment <Icon name="clock" />
                  </div>
                ) : isFunded ? (
                  <div className="flex items-center gap-1">None</div>
                ) : null}
              </div>
            </InvisibleLink>
          ),
        }
      })
    })
    .flat()

  type Row = (typeof rows)[number]

  const columns: ColumnObject<Row, keyof Row>[] = [
    {
      key: "roundNumber",
      label: "Round",
      textAlign: "center",
      isSortable: true,
      propsForCells: {
        className: "relative",
      },
      customValueGetter: () => 1,
    },
    {
      key: "bidTitleAndProjectName",
      label: "Bid Title / Project Name",
      isSortable: true,
      propsForCells: {
        className: "relative",
      },
      customValueGetter: (row) => row._bid.title,
    },
    {
      key: "totalTribute",
      label: (
        <Tooltip tipContents={rewardsTotalTributeColumnTooltip}>
          <div className="flex items-center gap-1">
            <span>Total Tribute</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "center",
      isSortable: true,
      propsForCells: {
        className: "relative whitespace-nowrap",
      },
      customValueGetter: (row) =>
        row._bid.tokenBasedTributes
          .map((t) => t.denom)
          .sort()
          .join(", "),
    },
    {
      key: "yourTribute",
      label: (
        <Tooltip tipContents={rewardsYourTributeColumnTooltip}>
          <div className="flex items-center gap-1">
            <span>Your Tribute</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
      isSortable: true,
      customValueGetter: (row) => row._bid.totalTokenBasedTributeValue,
    },
    {
      key: "claimStatus",
      label: "Claim Status",
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
    },
  ]

  function closeClaimRewardsModal(event?: MouseEvent<HTMLButtonElement>) {
    event?.preventDefault()
    setSelectedTribute(null)
  }

  function claimRewardsFinished(isSuccess?: boolean) {
    if (isSuccess) {
      setIsCelebrating(true)
    }
    closeClaimRewardsModal()
  }

  return (
    <>
      <StatCardsContainer>
        <CurrentRoundAprWallet />
        <AllTimeAprWallet />
        <AllTimeRewardsWallet />
      </StatCardsContainer>

      <ContentContainer className="gap-12 py-6">
        <div
          className="
            flex
            flex-col
            items-center
            justify-end
            gap-3
            lg:flex-row
          "
        >
          <ClaimStakingRewards />
        </div>
        <BlurryBackdropBox>
          {rows.length > 0 ? (
            <StyledTable columns={columns} rows={rows} />
          ) : (
            <EmptyBox>
              Stake to lock. Lock to vote. Vote to earn. Connect your wallet to
              get started!
            </EmptyBox>
          )}
        </BlurryBackdropBox>
      </ContentContainer>

      <ModalWindow isOpen={!!selectedTribute} onClose={closeClaimRewardsModal}>
        <ClaimRewardsStepper
          bid={selectedBid}
          tribute={selectedTribute}
          claimAmount={claimAmount}
          onExit={claimRewardsFinished}
        />
      </ModalWindow>

      <Confetti
        trigger={isCelebrating}
        onComplete={() => setIsCelebrating(false)}
      />
    </>
  )
}
