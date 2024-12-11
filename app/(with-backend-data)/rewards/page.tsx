"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { Card } from "@/components/Card"
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
  rewardsTributeRewardsColumnTooltip,
  rewardsTributeRewardsTooltip,
} from "@/components/ToolTips"
import { executeWalletClaimRewards } from "@/contract-apis/executeWalletClaimRewards"
import { SanitizedTokenBasedTribute } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { useChain } from "@cosmos-kit/react"
import { keyBy, sumBy } from "lodash"
import Image from "next/image"
import { MouseEvent, useState } from "react"

export default function RewardsPage() {
  const { setToasts } = useToasts()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const {
    address,
    bidDescriptionsByBidId,
    bids,
    bidsById,
    claims,
    claimsOutstanding,
    currentRoundId,
    votes,
    votingPower,
  } = useBackendData()
  const votesFromPreviousRounds = votes.filter(
    (vote) => bidsById[vote.bidId]?.roundId < currentRoundId
  )
  const bidsToRender = bids.filter(
    (bid) =>
      votesFromPreviousRounds.some((vote) => vote.bidId === bid.id) && // user voted
      bid.roundId < currentRoundId && // previous rounds
      bid.tributes.some((t) => t.isTokenBased) // has token-based tributes
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
        const matchingOutstandingClaim = claimsOutstanding.find(
          (claim) =>
            claim.bidId === bid.id &&
            claim.tributeId === tribute.id &&
            claim.roundId === bid.roundId &&
            claim.trancheId === bid.trancheId
        )
        const matchingHistoricalClaim = claims.find(
          (claim) =>
            claim.bidId === bid.id &&
            claim.tributeId === tribute.id &&
            claim.roundId === bid.roundId &&
            claim.trancheId === bid.trancheId
        )
        const matchingClaim =
          matchingOutstandingClaim ?? matchingHistoricalClaim
        const rewardInNativeToken = matchingClaim?.amount.amount ?? 0
        const rewardsInUsd = matchingClaim?.amount.valueInUsd ?? 0
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
              {tribute.amount}&nbsp;{tribute.denom}
            </InvisibleLink>
          ),

          polRewards: (
            <InvisibleLink href={bidUrl}>
              {amountToUSDString(tribute.valueInUsd)}
            </InvisibleLink>
          ),

          tributeRewards: (
            <InvisibleLink href={bidUrl}>
              <Tooltip tipContents={rewardsTributeRewardsTooltip}>
                <div>
                  <div>
                    {rewardInNativeToken}
                    &nbsp;{matchingClaim?.amount.denom ?? tribute.denom}
                  </div>
                  <StyledText variant="footnote">
                    ({amountToUSDString(rewardsInUsd)}{" "}
                    <Icon name="circle-info" />)
                  </StyledText>
                </div>
              </Tooltip>
            </InvisibleLink>
          ),

          actions: (
            <InvisibleLink href={bidUrl}>
              <div className="flex items-center justify-end gap-2">
                {canClaim ? (
                  <StyledText
                    as="button"
                    variant="button.primary.small"
                    onClick={() =>
                      setSelection({
                        tributeId: tribute.id,
                      })
                    }
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
                    Unresolved <Icon name="clock" />
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
      label: "Total Tribute",
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
      key: "tributeRewards",
      label: (
        <Tooltip tipContents={rewardsTributeRewardsColumnTooltip}>
          <div className="flex items-center gap-1">
            <span>Tribute Rewards</span>
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
      key: "actions",
      label: "Actions",
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
          message: `Claiming rewards...`,
          variant: "working",
        },
      ])

      await executeWalletClaimRewards({
        address,
        roundId: selectedBid.roundId,
        trancheId: selectedBid.trancheId,
        tributeId: selectedTribute.id,
        getSigningCosmWasmClient,
      })

      setToasts([
        {
          message: `Rewards claimed successfully`,
          variant: "success",
        },
      ])
    } catch (error) {
      console.error(error)
      setToasts([
        {
          message: `Error claiming rewards: ${error}`,
          variant: "error",
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

      <ContentContainer className="gap-12 py-12">
        <BlurryBackdropBox>
          {rows.length > 0 ? (
            <StyledTable columns={columns} rows={rows} />
          ) : (
            <EmptyBox>Stake to lock. Lock to vote. Vote to earn.</EmptyBox>
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
                  {selectedBid &&
                    amountToUSDString(selectedBid.usersEstimatedRewards)}
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
    </>
  )
}
