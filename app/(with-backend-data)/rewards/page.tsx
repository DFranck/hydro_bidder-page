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
import { estimatedRewardForPower } from "@/lib/estimatedRewardForPower"
import { useChain } from "@cosmos-kit/react"
import { sumBy } from "lodash"
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
    currentRoundId,
    votes,
    votingPower,
  } = useBackendData()
  const bidsFromPreviousRounds = bids.filter(
    (bid) => bid.roundId < currentRoundId
  )
  const votesFromPreviousRounds = votes.filter(
    (vote) => bidsById[vote.bidId]?.roundId < currentRoundId
  )
  const bidsUserVotedOn = bidsFromPreviousRounds.filter((bid) =>
    votesFromPreviousRounds.find((vote) => vote.bidId === bid.id)
  )
  const bidsWithTokenBasedTributes = bidsUserVotedOn.filter((bid) =>
    bid.tributes.some((t) => t.isTokenBased)
  )
  const [selection, setSelection] = useState<{
    bidId: number
    tributeId: number
  } | null>(null)
  const selectedBid = selection ? bidsById[selection.bidId] : null
  const selectedTribute = selection
    ? (selectedBid?.tributes.find(
        (t) => (t as SanitizedTokenBasedTribute).id === selection.tributeId
      ) as SanitizedTokenBasedTribute)
    : null

  const rows = bidsWithTokenBasedTributes
    .map((bid) => {
      const bidUrl = `/bids/${bid.id}`
      const bidDescription = bidDescriptionsByBidId[bid.id]
      const { projectLogoUrl, projectName, title } = bidDescription
      const tokenBasedTributes = bid.tributes.filter(
        (tribute) => tribute.isTokenBased
      )

      return tokenBasedTributes.map((tribute) => ({
        _bid: bid,

        _tribute: tribute,

        roundNumber: (
          <InvisibleLink href={bidUrl}>{bid.roundId + 1}</InvisibleLink>
        ),

        logo: (
          <InvisibleLink href={bidUrl}>
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
          </InvisibleLink>
        ),

        bidTitleAndProjectName: (
          <InvisibleLink href={bidUrl}>
            <div className="flex flex-col">
              <StyledText variant="h4">{title}</StyledText>
              <StyledText variant="footnote">{projectName}</StyledText>
            </div>
          </InvisibleLink>
        ),

        token: (
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
              <span>
                {amountToUSDString(
                  estimatedRewardForPower({
                    proposalTotalTribute: tribute.valueInUsd,
                    myVotingPower: votingPower,
                    proposalPower: Number(bid.power),
                  })
                )}
              </span>
              <Icon name="circle-info" />
            </Tooltip>
          </InvisibleLink>
        ),

        actions: (
          <InvisibleLink href={bidUrl}>
            <StyledText
              as="button"
              variant="button.primary.small"
              onClick={handleClickClaimRewards.bind(null, {
                bidId: bid.id,
                tributeId: tribute.id,
              })}
            >
              Claim
            </StyledText>
          </InvisibleLink>
        ),
      }))
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
      key: "logo",
      label: "",
      propsForCells: {
        className: "w-min",
      },
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
      key: "token",
      label: "Token",
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

  function handleClickClaimRewards({
    bidId,
    tributeId,
  }: {
    bidId: number
    tributeId: number
  }) {
    setSelection({ bidId, tributeId })
  }

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
        <StatCards.YourAprCurrentRound />
        <StatCards.YourAprHistorical />
        <StatCards.YourTotalRewardsAllTime />
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
