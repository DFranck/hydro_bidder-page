"use client"

import { classNames } from "@/app/(with-context)/voting/classNames"
import { ContentContainer } from "@/components/ContentContainer"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { useDecoratedProposals } from "@/lib/useDecoratedProposals"
import Image from "next/image"
import Link from "next/link"

export default function Page() {
  const decoratedProposals = useDecoratedProposals({ trancheId: 1 }) ?? []

  const rows = decoratedProposals.map((proposal) => {
    const projectLink = `/voting/${proposal.proposal_id}`

    return {
      _proposal: proposal,

      roundNumber: (
        <>
          1
          <Link href={projectLink} className={classNames.projectLink} />
        </>
      ),

      logo: (
        <>
          {proposal.projectLogoUrl ? (
            <div className="relative size-12">
              <Image
                className="object-contain"
                src={proposal.projectLogoUrl}
                alt={proposal.projectName}
                fill={true}
              />
            </div>
          ) : null}
          <Link href={projectLink} className={classNames.projectLink} />
        </>
      ),

      bidTitleAndProjectName: (
        <>
          <div className="flex flex-col">
            <StyledText variant="h4">{proposal.title}</StyledText>
            <StyledText variant="footnote">{proposal.projectName}</StyledText>
          </div>
          <Link href={projectLink} className={classNames.projectLink} />
        </>
      ),

      token: (
        <>
          {proposal.points
            ? proposal.points[1]
            : proposal.pricedAndNamedTributes.map((tribute, index) => (
                <div key={index}>{tribute.symbol || tribute.denom}</div>
              ))}
          <Link href={projectLink} className={classNames.projectLink} />
        </>
      ),

      yieldRewards: (
        <>
          {amountToUSDString(proposal.estimatedRewardForUser ?? 0)}
          <Link href={projectLink} className={classNames.projectLink} />
        </>
      ),

      tributeRewards: (
        <>
          {amountToUSDString(proposal.totalTributeValue)}
          <Link href={projectLink} className={classNames.projectLink} />
        </>
      ),

      actions: (
        <>
          {<StyledText variant="button.primary.small">Claim</StyledText>}
          <Link href={projectLink} className={classNames.projectLink} />
        </>
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
      customValueGetter: (row) => row._proposal.title,
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
        row._proposal.points ? row._proposal.points[1] : "",
    },
    {
      key: "yieldRewards",
      label: "Yield Rewards ($)",
      textAlign: "right",
      isSortable: true,
      propsForCells: {
        className: "whitespace-nowrap",
      },
      customValueGetter: (row) => row._proposal.estimatedRewardForUser ?? 0,
    },
    {
      key: "tributeRewards",
      label: "Tribute Rewards ($)",
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
      isSortable: true,
      customValueGetter: (row) => row._proposal.totalTributeValue ?? 0,
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
          <StyledText variant="h2">Your Rewards</StyledText>

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
