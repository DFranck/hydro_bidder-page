import { AmountAndUnitPair } from "@/components/AmountAndUnitPair"
import { BidDuration } from "@/components/BidDuration"
import { BidLogoAndTitle } from "@/components/BidLogoAndTitle"
import { BidPolApr } from "@/components/BidPolApr"
import { BidPolSize } from "@/components/BidPolSize"
import { BidStatus } from "@/components/BidStatus"
import { BidTributeApr } from "@/components/BidTributeApr"
import { InvisibleLink } from "@/components/InvisibleLink"
import { StyledText } from "@/components/StyledText"
import {
  AugmentedBidFromNumiaSlimmed,
  BidMetaDataSlimmed,
  BidRevampMetrics,
} from "@/contract-apis/types"
import { pluralize } from "@/lib/pluralize"
import Image from "next/image"

export function buildRow(
  numiaBid: BidRevampMetrics | AugmentedBidFromNumiaSlimmed,
  bidMetaData: BidMetaDataSlimmed,
  bidFromContract: BidRevampMetrics,
  requestedPreHydro: boolean
) {
  let rowURL: string, projectLogoUrl: string, projectName: string, title: string

  if (requestedPreHydro) {
    const bid = numiaBid as AugmentedBidFromNumiaSlimmed
    rowURL = `https://www.mintscan.io/cosmos/proposals/${bid.id.replace("#", "")}`
    projectLogoUrl = bid.projectLogoUrl
    projectName = bid.projectName
    title = bid.title
  } else {
    rowURL = `/bids/${numiaBid.id}`
    projectLogoUrl = bidMetaData?.projectLogoUrl ?? ""
    projectName = bidMetaData?.projectName ?? ""
    title = bidMetaData?.title ?? ""
  }

  return {
    _bid: numiaBid,
    _bidFromContract: bidFromContract,
    _bidMetaData: bidMetaData,

    logoAndTitle: (
      <InvisibleLink href={rowURL}>
        {requestedPreHydro ? (
          <div className="flex items-center gap-6">
            <div className="relative size-12 shrink-0 rounded-full border text-[0]">
              {projectLogoUrl ? (
                <Image
                  className="object-contain"
                  src={projectLogoUrl}
                  alt={projectName}
                  fill={true}
                />
              ) : null}
            </div>

            <StyledText variant="h4">{title}</StyledText>
          </div>
        ) : (
          <BidLogoAndTitle bidId={Number(numiaBid.id)} />
        )}
      </InvisibleLink>
    ),

    amount: (
      <InvisibleLink href={rowURL}>
        {requestedPreHydro ? (
          <AmountAndUnitPair
            amount={(
              numiaBid as AugmentedBidFromNumiaSlimmed
            ).requestedAllocationAmount.toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}
            unit="ATOM"
          />
        ) : (
          <BidPolSize bidId={Number(numiaBid.id)} />
        )}
      </InvisibleLink>
    ),

    duration: (
      <InvisibleLink href={rowURL}>
        {requestedPreHydro ? (
          pluralize({
            count: (numiaBid as AugmentedBidFromNumiaSlimmed).durationDays,
            prefixCount: true,
            singular: "day",
          })
        ) : (
          <BidDuration bidId={Number(numiaBid.id)} />
        )}
      </InvisibleLink>
    ),

    polApr: (
      <InvisibleLink href={rowURL}>
        {requestedPreHydro ? (
          <StyledText variant="mathSymbol.container">
            <span>{(numiaBid as AugmentedBidFromNumiaSlimmed).apr}</span>
            <StyledText variant="mathSymbol">%</StyledText>
          </StyledText>
        ) : (
          <BidPolApr bidId={Number(numiaBid.id)} />
        )}
      </InvisibleLink>
    ),

    tributeApr: (
      <InvisibleLink href={rowURL}>
        {requestedPreHydro ? 0 : <BidTributeApr bidId={bidFromContract.id} />}
      </InvisibleLink>
    ),

    status: (
      <InvisibleLink href={rowURL}>
        {requestedPreHydro ? (
          numiaBid.status
        ) : (
          <BidStatus bidId={Number(numiaBid.id)} />
        )}
      </InvisibleLink>
    ),
  }
}
