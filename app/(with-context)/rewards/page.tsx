"use client"

import { ContentContainer } from "@/components/ContentContainer"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { useDecoratedProposals } from "@/lib/useDecoratedProposals"

export default function Page() {
  const decoratedProposals = useDecoratedProposals({ trancheId: 1 }) ?? []

  const rows = decoratedProposals.map((proposal) => ({
    _proposal: proposal,

    votingRound: 1,

    bidTitleAndProjectName: (
      <div className="flex flex-col">
        <StyledText variant="h4">{proposal.title}</StyledText>
        <StyledText variant="footnote">{proposal.projectName}</StyledText>
      </div>
    ),

    token: proposal.points
      ? proposal.points[1]
      : proposal.pricedAndNamedTributes.map((tribute, index) => (
          <div key={index}>{tribute.symbol || tribute.denom}</div>
        )),

    yieldRewards: `${proposal.estimatedRewardForUser?.toLocaleString(
      undefined,
      { maximumFractionDigits: 4 }
    )} ATOM`,

    tributeRewards: amountToUSDString(proposal.totalTributeValue),

    actions: <StyledText variant="button.primary.small">Claim</StyledText>,
  }))

  type Row = (typeof rows)[number]

  const columns: ColumnObject<Row, keyof Row>[] = [
    {
      key: "votingRound",
      label: "Voting Round",
      textAlign: "center",
    },
    {
      key: "bidTitleAndProjectName",
      label: "Bid Title / Project Name",
    },
    {
      key: "token",
      label: "Token",
      textAlign: "center",
    },
    {
      key: "yieldRewards",
      label: "Yield Rewards ($)",
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
    },
    {
      key: "tributeRewards",
      label: "Tribute Rewards ($)",
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
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

  return (
    <>
      <StatCards>
        <StatCards.YourAPRCurrentRound />
        <StatCards.YourAPRHistorical />
        <StatCards.YourTotalRewardsValue />
      </StatCards>

      <ContentContainer className="gap-12 py-12">
        <div className="flex items-center justify-between">
          <StyledText variant="h2">Rewards</StyledText>

          <div className="flex items-center gap-6">
            <div className="text-palette-beige">You have unclaimed rewards</div>

            <StyledText as="button" variant="button.primary">
              Claim All Rewards
            </StyledText>
          </div>
        </div>

        <div
          className="
            -mx-3
            rounded-xl
            bg-palette-text/20
            p-3
            backdrop-blur-md
          "
        >
          <StyledTable columns={columns} rows={rows} />
        </div>
      </ContentContainer>
    </>
  )
}
