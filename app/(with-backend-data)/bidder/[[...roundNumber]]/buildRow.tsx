import { AmountAndUnitPair } from "@/components/AmountAndUnitPair"
import { BidDuration } from "@/components/BidDuration"
import {
  BidLogoAndTitle,
  BidLogoAndTitleLayout,
} from "@/components/BidLogoAndTitle"
import { BidPolApr } from "@/components/BidPolApr"
import { BidPolSize } from "@/components/BidPolSize"
import { BidTributeApr } from "@/components/BidTributeApr"
import { InvisibleLink } from "@/components/InvisibleLink"
import { StyledText } from "@/components/StyledText"
import { BidRevampMetrics, PreHydroBid } from "@/contract-apis/types"
import { pluralize } from "@/lib/pluralize"

export function buildRow(
  passedBid: BidRevampMetrics | PreHydroBid,
  requestedPreHydro: boolean
) {
  let rowURL: string, projectLogoUrl: string, projectName: string, title: string

  if (requestedPreHydro) {
    const bid = passedBid as PreHydroBid
    rowURL = `https://www.mintscan.io/cosmos/proposals/${bid.id.replace("#", "")}`
    projectLogoUrl = bid.project_logo_url
    projectName = bid.project
    title = bid.title
  } else {
    const regularBid = passedBid as BidRevampMetrics
    rowURL = `/bids/${passedBid.id}`
    projectLogoUrl = regularBid?.projectLogoUrl ?? ""
    projectName = regularBid?.projectName ?? ""
    title = regularBid?.projectTitle ?? ""
  }

  return {
    _bid: passedBid,

    logoAndTitle: (
      <InvisibleLink href={rowURL}>
        {requestedPreHydro ? (
          <BidLogoAndTitleLayout
            projectLogoUrl={projectLogoUrl}
            projectName={projectName}
            title={title}
          />
        ) : (
          <BidLogoAndTitle bidId={Number(passedBid.id)} />
        )}
      </InvisibleLink>
    ),

    amount: (
      <InvisibleLink href={rowURL}>
        {requestedPreHydro ? (
          <AmountAndUnitPair
            amount={(
              passedBid as PreHydroBid
            ).requested_allocation_amount.toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}
            unit="ATOM"
          />
        ) : (
          <BidPolSize bidId={Number(passedBid.id)} />
        )}
      </InvisibleLink>
    ),

    duration: (
      <InvisibleLink href={rowURL}>
        {requestedPreHydro ? (
          pluralize({
            count: (passedBid as PreHydroBid).duration_days ?? 0,
            prefixCount: true,
            singular: "day",
          })
        ) : (
          <BidDuration bidId={Number(passedBid.id)} />
        )}
      </InvisibleLink>
    ),

    polApr: (
      <InvisibleLink href={rowURL}>
        {requestedPreHydro ? (
          <StyledText variant="mathSymbol.container">
            <span>{(passedBid as PreHydroBid).apr}</span>
            <StyledText variant="mathSymbol">%</StyledText>
          </StyledText>
        ) : (
          <BidPolApr />
        )}
      </InvisibleLink>
    ),

    tributeApr: (
      <InvisibleLink href={rowURL}>
        {requestedPreHydro ? 0 : <BidTributeApr bidId={Number(passedBid.id)} />}
      </InvisibleLink>
    ),

    status: <InvisibleLink href={rowURL}>{passedBid.status}</InvisibleLink>,
  }
}
