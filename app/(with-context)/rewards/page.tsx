"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { Card } from "@/components/Card"
import { ContentContainer } from "@/components/ContentContainer"
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
import { claimRewards } from "@/contract-apis/claimRewards"
import { useContractContext } from "@/contract-apis/useContractContext"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { useChain } from "@cosmos-kit/react"
import { startCase } from "lodash"
import Image from "next/image"
import { MouseEvent, useState } from "react"

export default function RewardsPage() {
  const [claimType, setClaimType] = useState<"native" | "convert">("native")
  const [isShowingClaimRewardsModal, setIsShowingClaimRewardsModal] =
    useState(false)
  const { isLoading, currentRoundMetadata, bidsByRoundId } =
    useContractContext()

  const allBidIds =
    bidsByRoundId[currentRoundMetadata.roundId]?.map((bid) => bid.id) ?? []
  const [selectedBidIds, setSelectedBidIds] = useState<string[]>(allBidIds)
  const { setToasts } = useToasts()
  const { address, getSigningCosmWasmClient } = useChain("neutron")

  const rows = Object.values(bidsByRoundId)
    .flat()
    .map((bid) => {
      const bidUrl = `/bids/${bid.id}`

      return {
        _bid: bid,

        roundNumber: <InvisibleLink href={bidUrl}>1</InvisibleLink>,

        logo: (
          <InvisibleLink href={bidUrl}>
            {bid.projectLogoUrl ? (
              <div className="relative size-12">
                <Image
                  className="object-contain"
                  src={bid.projectLogoUrl}
                  alt={bid.project}
                  fill={true}
                />
              </div>
            ) : null}
          </InvisibleLink>
        ),

        bidTitleAndProjectName: (
          <InvisibleLink href={bidUrl}>
            <div className="flex flex-col">
              <StyledText variant="h4">{bid.title}</StyledText>
              <StyledText variant="footnote">{bid.project}</StyledText>
            </div>
          </InvisibleLink>
        ),

        token: (
          <InvisibleLink href={bidUrl}>
            <div className="flex flex-col items-center justify-center gap-1">
              {bid.offchainTribute.map((tribute, index) => (
                <div key={index} className="flex items-center gap-1">
                  <Icon name="solid:gem" />
                  {startCase(tribute.type.toLowerCase())}
                </div>
              ))}
              {bid.onchainTributeAssets.map((tribute, index) => (
                <div key={index}>{tribute.asset.slice(0, 12)}</div>
              ))}
            </div>
          </InvisibleLink>
        ),

        polRewards: (
          <InvisibleLink href={bidUrl}>
            {amountToUSDString(bid.estimatedRewardForUser ?? 0)}
          </InvisibleLink>
        ),

        tributeRewards: (
          <InvisibleLink href={bidUrl}>
            {amountToUSDString(bid.onchainTributeUsdc)}
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
        [
          ...row._bid.onchainTributeAssets.map((asset) => asset.asset),
          ...row._bid.offchainTribute.map((tribute) => tribute.type),
        ]
          .sort()
          .join(", "),
    },
    // TODO: Uncomment this
    // {
    //   key: "polRewards",
    //   label: (
    //     <Tooltip tipContents={rewardsPolRewardsColumnTooltip}>
    //       <div className="flex items-center gap-1">
    //         <span>PoL Rewards ($)</span>
    //         <Icon name="circle-info" />
    //       </div>
    //     </Tooltip>
    //   ),
    //   textAlign: "right",
    //   isSortable: true,
    //   propsForCells: {
    //     className: "whitespace-nowrap",
    //   },
    //   customValueGetter: (row) => row._proposal.estimatedRewardForUser ?? 0,
    // },
    {
      key: "tributeRewards",
      label: (
        <Tooltip tipContents={rewardsTributeRewardsColumnTooltip}>
          <div className="flex items-center gap-1">
            <span>Tribute Rewards ($)</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
      isSortable: true,
      customValueGetter: (row) => row._bid.onchainTributeUsdc ?? 0,
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

  function handleClickClaimRewards({ bidIds }: { bidIds?: string[] } = {}) {
    setIsShowingClaimRewardsModal(true)
    setSelectedBidIds(bidIds ?? allBidIds)
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
        const bid = bidsByRoundId[currentRoundMetadata.roundId].find(
          (bid) => bid.id === bidId
        )

        if (!bid) return

        await claimRewards(
          getSigningCosmWasmClient,
          address!,
          Number(bid.round),
          bid.tranche,
          Number(bid.id)
        )
      })
    )

    setToasts([])
  }

  return (
    <>
      <StatCards>
        <StatCards.YourAPRCurrentRound />
        <StatCards.YourAPRHistorical />
        <StatCards.YourTotalRewardsValue />
      </StatCards>

      <ContentContainer className="gap-12 py-12">
        <div className="flex items-center justify-between">
          <StyledText variant="h2">Your Rewards</StyledText>

          <div className="flex items-center gap-6">
            <div className="text-palette-beige">You have unclaimed rewards</div>

            <StyledText
              as="button"
              variant="button.primary"
              onClick={handleClickClaimRewards.bind(null, {
                bidIds: allBidIds,
              })}
            >
              Claim All Rewards
            </StyledText>
          </div>
        </div>

        <BlurryBackdropBox>
          <StyledTable columns={columns} rows={rows} />
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
                        row._bid?.estimatedRewardForUser ?? 0,
                    },
                  ]}
                  rows={selectedBidIds.map((bidId) => {
                    const bid = bidsByRoundId[
                      currentRoundMetadata.roundId
                    ].find((bid) => bid.id === bidId)!

                    return {
                      _bid: bid,

                      token: [
                        ...bid.onchainTributeAssets.map((asset) => asset.asset),
                        bid.offchainTribute.map((tribute) => tribute.type),
                      ]
                        .sort()
                        .join(", "),
                      amount: amountToUSDString(
                        bid.estimatedRewardForUser ?? 0
                      ),
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
