import { AmountAndUnitPair } from "@/components/AmountAndUnitPair"
import { BidDuration } from "@/components/BidDuration"
import { BidLogoAndTitle } from "@/components/BidLogoAndTitle"
import { BidPolApr } from "@/components/BidPolApr"
import { BidPolSize } from "@/components/BidPolSize"
import { BidStatus } from "@/components/BidStatus"
import { BidTributeAprOrPoints } from "@/components/BidTributeAprOrPoints"
import { InvisibleLink } from "@/components/InvisibleLink"
import { StyledText } from "@/components/StyledText"
import {
  AugmentedBidFromNumiaSlimmed,
  BidMetaDataByIdSlimmed,
  BidRevampMetrics,
} from "@/contract-apis/types"
import { pluralize } from "@/lib/pluralize"
import Image from "next/image"

export function getMetricsTableRows(
  numiaBids: BidRevampMetrics[] | AugmentedBidFromNumiaSlimmed[],
  bidsInfo: Record<number, BidRevampMetrics>,
  bidMetaDataById: BidMetaDataByIdSlimmed,
  requestedPreHydro: boolean
) {
  return numiaBids.map((bidFromNumia) => {
    const bidMetaData = bidMetaDataById[Number(bidFromNumia.id)] ?? null
    const bidFromContract = bidsInfo[Number(bidFromNumia.id)] ?? null

    let rowURL: string,
      projectLogoUrl: string,
      projectName: string,
      title: string

    if (requestedPreHydro) {
      const bid = bidFromNumia as AugmentedBidFromNumiaSlimmed
      rowURL = `https://www.mintscan.io/cosmos/proposals/${bid.id.replace("#", "")}`
      projectLogoUrl = bid.projectLogoUrl
      projectName = bid.projectName
      title = bid.title
    } else {
      rowURL = `/bids/${bidFromNumia.id}`
      projectLogoUrl = bidMetaData?.projectLogoUrl ?? ""
      projectName = bidMetaData?.projectName ?? ""
      title = bidMetaData?.title ?? ""
    }

    return {
      _bid: bidFromNumia,
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
            <BidLogoAndTitle bidId={Number(bidFromNumia.id)} />
          )}
        </InvisibleLink>
      ),

      amount: (
        <InvisibleLink href={rowURL}>
          {requestedPreHydro ? (
            <AmountAndUnitPair
              amount={(
                bidFromNumia as AugmentedBidFromNumiaSlimmed
              ).requestedAllocationAmount.toLocaleString(undefined, {
                maximumFractionDigits: 4,
              })}
              unit="ATOM"
            />
          ) : (
            <BidPolSize bidId={Number(bidFromNumia.id)} />
          )}
        </InvisibleLink>
      ),

      duration: (
        <InvisibleLink href={rowURL}>
          {requestedPreHydro ? (
            pluralize({
              count: (bidFromNumia as AugmentedBidFromNumiaSlimmed)
                .durationDays,
              prefixCount: true,
              singular: "day",
            })
          ) : (
            <BidDuration bidId={Number(bidFromNumia.id)} />
          )}
        </InvisibleLink>
      ),

      polApr: (
        <InvisibleLink href={rowURL}>
          {requestedPreHydro ? (
            <StyledText variant="mathSymbol.container">
              <span>{(bidFromNumia as AugmentedBidFromNumiaSlimmed).apr}</span>
              <StyledText variant="mathSymbol">%</StyledText>
            </StyledText>
          ) : (
            <BidPolApr bidId={Number(bidFromNumia.id)} />
          )}
        </InvisibleLink>
      ),

      tributeApr: (
        <InvisibleLink href={rowURL}>
          {requestedPreHydro ? (
            0
          ) : (
            <BidTributeAprOrPoints bidId={bidFromContract.id} />
          )}
        </InvisibleLink>
      ),

      status: (
        <InvisibleLink href={rowURL}>
          {requestedPreHydro ? (
            bidFromNumia.status
          ) : (
            <BidStatus bidId={Number(bidFromNumia.id)} />
          )}
        </InvisibleLink>
      ),
    }
  })
}
