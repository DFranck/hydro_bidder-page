"use client"

import { BidTribute } from "@/components/BidTribute"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { Card } from "@/components/Card"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Confetti } from "@/components/Confetti"
import { ContentContainer } from "@/components/ContentContainer"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { InvisibleLink } from "@/components/InvisibleLink"
import { ModalWindow } from "@/components/ModalWindow"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import {
  rewardsTotalTributeColumnTooltip,
  rewardsYourTributeColumnTooltip,
  rewardsYourTributeTooltip,
} from "@/components/ToolTips"
import { executeWalletClaimRewards } from "@/contract-apis/executeWalletClaimRewards"
import { SanitizedTokenBasedTribute } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { formatAmount } from "@/lib/formatAmount"
import { revalidateTag } from "@/lib/revalidateTag"
import { useChain } from "@cosmos-kit/react"
import { keyBy, sumBy } from "lodash"
import Image from "next/image"
import { MouseEvent, useState } from "react"

export default function RewardsPage() {
  const [isCelebrating, setIsCelebrating] = useState(false)
  const { setToasts } = useToasts()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const {
    address,
    bidDescriptionsByBidId,
    bids,
    bidsById,
    claimsHistorical,
    claimsOutstanding,
    currentRoundId,
    isWalletConnected,
    votes,
  } = useBackendData()
  const votesFromPreviousRounds = votes.filter(
    (vote) => bidsById[vote.bidId]?.roundId < currentRoundId
  )
  const bidsToRender = bids.filter(
    (bid) =>
      votesFromPreviousRounds.some((vote) => vote.bidId === bid.id) && // user voted
      bid.roundId < currentRoundId && // previous rounds
      bid.tributes.some((t) => t.isTokenBased) // has token-based tribute
  )
  const tributesById = keyBy(
    bidsToRender.flatMap((bid) => bid.tributes),
    "id"
  )

  // "Claim" button sets selection and triggers confirmation modal
  const [selection, setSelection] = useState<{
    tributeId: number
  } | null>(null)
  const selectedTribute = selection
    ? (tributesById[selection.tributeId] as SanitizedTokenBasedTribute)
    : null
  const selectedBid =
    selection && selectedTribute
      ? bidsById[tributesById[selection.tributeId].bidId]
      : null

  // Bids can have multiple tributes, so this turns each into a row
  const rows = bidsToRender
    .map((bid) => {
      const bidUrl = `/bids/${bid.id}`
      const bidDescription = bidDescriptionsByBidId[bid.id]
      const { projectLogoUrl, projectName, title } = bidDescription
      const tokenBasedTributes = bid.tributes.filter(
        (tribute) => tribute.isTokenBased
      )

      return tokenBasedTributes.map((tribute) => {
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
        const rewardsInUsd = matchingClaimAmount?.valueInUsd ?? 0
        const totalDeployedFunds = sumBy(
          bid.liquidityDeployment?.deployedFunds,
          "amount"
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
              <BidTribute bid={bid} textAlign="right" />
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
                  {matchingClaimAmount?.printableAmount}
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
                  <Tooltip tipContents="Claiming will be enabled soon!">
                    <StyledText
                      as="button"
                      variant="button.primary.small"
                      className="pointer-events-none opacity-50"
                      onClick={() =>
                        setSelection({
                          tributeId: tribute.id,
                        })
                      }
                    >
                      Claim
                    </StyledText>
                  </Tooltip>
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
        row._bid.tributes
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
      customValueGetter: (row) => sumBy(row._bid.tributes, "valueInUsd"),
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

  function handleClickCloseClaimRewardsModal(
    event?: MouseEvent<HTMLButtonElement>
  ) {
    event?.preventDefault()
    setSelection(null)
  }

  async function handleClickClaimNow(event: MouseEvent<HTMLButtonElement>) {
    if (!selectedBid || !selectedTribute || !address) return

    event.preventDefault()

    try {
      setToasts([
        {
          variant: "working",
          message: "Claiming rewards...",
        },
      ])

      await executeWalletClaimRewards({
        address,
        roundId: selectedBid.roundId,
        trancheId: selectedBid.trancheId,
        tributeId: selectedTribute.id,
        getSigningCosmWasmClient,
      })

      await revalidateTag("backendData")

      setSelection(null)

      setIsCelebrating(true)

      setToasts([
        {
          variant: "success",
          message: "Reward claimed! Reload to see changes",
          isDismissible: false,
          actionButtonPrimary: {
            label: "Reload",
            onClick: () => window.location.reload(),
          },
        },
      ])
    } catch (error) {
      console.error(error)
      setToasts([
        {
          variant: "error",
          message: `Error claiming rewards: ${error}`,
        },
      ])
    }
  }

  return (
    <>
      <StatCards>
        <StatCards.CurrentRoundAprWallet />
        <StatCards.AllTimeAprWallet />
        <StatCards.AllTimeRewardsWallet />
      </StatCards>

      <ContentContainer className="gap-12 py-6">
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

      <ModalWindow
        isOpen={!!selection}
        onClose={handleClickCloseClaimRewardsModal}
      >
        <form>
          <Card>
            <Card.Header
              className="flex flex-col gap-3"
              title="Claim Your Hydro Rewards"
            >
              <StyledText variant="footnote">
                You can claim your rewards in the native token offered as
                tribute or convert them to ATOM before sending them to your
                wallet.
              </StyledText>
            </Card.Header>

            <Card.Body className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <StyledText
                  as="label"
                  variant="label"
                  className="flex items-center gap-2"
                >
                  <StyledText
                    variant="input.radio"
                    as="input"
                    type="radio"
                    name="claimType"
                    value="native"
                    defaultChecked={true}
                  />
                  Claim rewards in native token
                </StyledText>

                <Tooltip tipContents="Coming soon!">
                  <div className="flex items-center gap-1">
                    <StyledText
                      as="label"
                      variant="label"
                      className="pointer-events-none flex items-center gap-2 opacity-60"
                    >
                      <StyledText
                        variant="input.radio"
                        disabled
                        as="input"
                        type="radio"
                        name="claimType"
                        value="convert"
                      />
                      Convert rewards to ATOM
                    </StyledText>
                    <Icon name="circle-info" />
                  </div>
                </Tooltip>
              </div>

              <div className="flex flex-col gap-2">
                <StyledText as="label" variant="label">
                  Rewards to be Claimed:
                </StyledText>

                <div>
                  {selectedTribute && (
                    <>
                      {formatAmount(selectedTribute.amount)}
                      &nbsp;{selectedTribute.denom}
                    </>
                  )}
                </div>
              </div>
            </Card.Body>

            <Card.Footer>
              <StyledText
                as="button"
                variant="button.primary"
                onClick={handleClickClaimNow}
              >
                Claim Rewards
              </StyledText>

              <StyledText
                as="button"
                variant="button.secondary"
                onClick={handleClickCloseClaimRewardsModal}
              >
                Cancel
              </StyledText>
            </Card.Footer>
          </Card>
        </form>
      </ModalWindow>

      <Confetti
        trigger={isCelebrating}
        onComplete={() => setIsCelebrating(false)}
      />
    </>
  )
}
