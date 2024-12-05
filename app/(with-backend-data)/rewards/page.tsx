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
import { rewardsTributeRewardsColumnTooltip } from "@/components/ToolTips"
import { executeWalletClaimRewards } from "@/contract-apis/executeWalletClaimRewards"
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { useChain } from "@cosmos-kit/react"
import { sumBy } from "lodash"
import Image from "next/image"
import { MouseEvent, useState } from "react"
import { twMerge } from "tailwind-merge"

export default function RewardsPage() {
  const { setToasts } = useToasts()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const [isShowingClaimRewardsModal, setIsShowingClaimRewardsModal] =
    useState(false)
  const {
    address,
    bidDescriptionsByBidId,
    bidsByRoundId,
    currentRoundId,
    votes,
  } = useBackendData()

  const allBidIdsFromPreviousRounds =
    Object.values(bidsByRoundId)
      .flat()
      .filter((bid) => bid.roundId < currentRoundId)
      .map((bid) => bid.id) ?? []
  const [selectedBidIds, setSelectedBidIds] = useState<number[]>(
    allBidIdsFromPreviousRounds
  )
  const bidsUserVotedOn = Object.values(bidsByRoundId)
    .flat()
    .filter(
      (bid) =>
        bid.roundId < currentRoundId &&
        votes.find((vote) => vote.bidId === bid.id)
    )

  const rows = bidsUserVotedOn.map((bid) => {
    const bidUrl = `/bids/${bid.id}`
    const bidDescription = bidDescriptionsByBidId[bid.id]
    const { projectLogoUrl, projectName, title } = bidDescription

    return {
      _bid: bid,

      roundNumber: <InvisibleLink href={bidUrl}>1</InvisibleLink>,

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
          {bid.tributes
            .map((t) => (t.isTokenBased ? t.denom.toUpperCase() : t.denom))
            .sort()
            .join(", ")}
        </InvisibleLink>
      ),

      polRewards: (
        <InvisibleLink href={bidUrl}>
          {amountToUSDString(sumBy(bid.tributes, "valueInUsd"))}
        </InvisibleLink>
      ),

      tributeRewards: (
        <InvisibleLink href={bidUrl}>
          <Tooltip tipContents={rewardsTributeRewardsColumnTooltip}>
            <span>{amountToUSDString(bid.usersEstimatedRewards)}</span>
            <Icon name="circle-info" />
          </Tooltip>
        </InvisibleLink>
      ),

      actions: (
        <InvisibleLink href={bidUrl}>
          <StyledText
            as="button"
            variant="button.primary.small"
            onClick={() => handleClickClaimRewards({ bidIds: [bid.id] })}
          >
            Claim
          </StyledText>
        </InvisibleLink>
      ),
    }
  })

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

  function handleClickClaimRewards({ bidIds }: { bidIds?: number[] } = {}) {
    setIsShowingClaimRewardsModal(true)
    setSelectedBidIds(bidIds ?? allBidIdsFromPreviousRounds)
  }

  function handleClickCloseClaimRewardsModal(
    event?: MouseEvent<HTMLButtonElement>
  ) {
    event?.preventDefault()
    setIsShowingClaimRewardsModal(false)
  }

  async function handleClickClaimNow(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    setToasts([
      {
        message: "Claiming rewards...",
        variant: "working",
      },
    ])

    await Promise.all(
      selectedBidIds.map(async (bidId) => {
        const bid = bidsByRoundId[currentRoundId].find(
          (bid) => bid.id === bidId
        )

        if (!bid) return

        await executeWalletClaimRewards(
          getSigningCosmWasmClient,
          address!,
          Number(bid.roundId),
          bid.trancheId,
          Number(bid.id)
        )
      })
    )

    setToasts([])
  }

  return (
    <>
      <StatCards>
        <StatCards.YourAprCurrentRound />
        <StatCards.YourAprHistorical />
        <StatCards.YourTotalRewardsAllTime />
      </StatCards>

      <ContentContainer className="gap-12 py-12">
        <div
          className={twMerge(
            "flex items-center justify-end",
            rows.length > 0 ? "" : "hidden"
          )}
        >
          <h2 className="sr-only">Your Rewards</h2>

          <div className="flex items-center gap-6">
            <StyledText
              as="button"
              variant="button.primary"
              onClick={handleClickClaimRewards.bind(null, {
                bidIds: allBidIdsFromPreviousRounds,
              })}
            >
              Claim All Rewards
            </StyledText>
          </div>
        </div>

        <BlurryBackdropBox>
          {rows.length > 0 ? (
            <StyledTable columns={columns} rows={rows} />
          ) : (
            <EmptyBox>Stake to lock. Lock to vote. Vote to earn.</EmptyBox>
          )}
        </BlurryBackdropBox>
      </ContentContainer>

      <ModalWindow
        isOpen={isShowingClaimRewardsModal}
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

                <StyledTable
                  initialSortedColumnKey="amount"
                  columns={[
                    {
                      key: "token",
                      label: "Token",
                      isSortable: true,
                      propsForCells: {
                        className: "!py-1",
                      },
                    },
                    {
                      key: "amount",
                      label: "Amount",
                      textAlign: "right",
                      isSortable: true,
                      initialSortDirection: "DESC",
                      propsForCells: {
                        className: "!py-1",
                      },
                      customValueGetter: (row) =>
                        row._bid?.usersEstimatedRewards ?? 0,
                    },
                  ]}
                  rows={selectedBidIds.map((bidId) => {
                    const bid = Object.values(bidsByRoundId)
                      .flat()
                      .find((bid) => bid.id === bidId)!

                    return {
                      _bid: bid,
                      token: bid.tributes
                        .map((t) => t.denom)
                        .sort()
                        .join(", "),
                      amount: amountToUSDString(bid.usersEstimatedRewards),
                    }
                  })}
                />
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
