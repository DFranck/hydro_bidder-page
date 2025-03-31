import { BidRow } from "@/app/(with-backend-data)/bidder-dashboard/page"
import { BidLogoAndTitle } from "@/components/BidLogoAndTitle"
import { BidRewards } from "@/components/BidRewards"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Icon } from "@/components/Icon"
import { InvisibleButton } from "@/components/InvisibleButton"
import { Tooltip } from "@/components/Tooltip"
import { voteThresholdTooltip } from "@/components/ToolTips"
import { AddTributeButton } from "@/components/Tributes/AddTributeButton"
import { TributesList } from "@/components/Tributes/TributesList/TributesList"
import { voteThresholdByTrancheId } from "@/config"
import {
  AugmentedBidAfterWallet,
  BidMetaDataByIdSlimmed,
} from "@/contract-apis/types"

export function getBidDashboardTableRows(
  openedRows: number[],
  onToggleRow: (bidId: number) => void,
  bids?: AugmentedBidAfterWallet[],
  bidDescriptions?: BidMetaDataByIdSlimmed
): { token: BidRow[]; point: BidRow[] } {
  if (!bids || !bids.length) return { token: [], point: [] }

  const rows = bids.map((bid) => {
    const isOpened = openedRows.includes(bid.id)
    const voteThreshold =
      voteThresholdByTrancheId[
        bid.trancheId as keyof typeof voteThresholdByTrancheId
      ]
    return {
      _bid: bid,

      logoAndTitle: (
        <InvisibleButton onClick={() => onToggleRow(bid.id)}>
          <BidLogoAndTitle bidId={bid.id} />
        </InvisibleButton>
      ),

      tribute: (
        <InvisibleButton onClick={() => onToggleRow(bid.id)}>
          <BidRewards bidId={bid.id} />
        </InvisibleButton>
      ),

      currentVoteShare: (
        <InvisibleButton onClick={() => onToggleRow(bid.id)}>
          <ConditionalWrapper
            condition={bid.vote_perc < voteThreshold}
            wrapper={(children) => (
              <Tooltip
                tipContents={voteThresholdTooltip({ trancheId: bid.trancheId })}
                classNamesForTooltip="-ml-24"
              >
                <div className="flex items-center gap-1">
                  {children}
                  <Icon
                    name="circle-info"
                    className="text-xs text-palette-beige"
                  />
                </div>
              </Tooltip>
            )}
          >
            <span>{Math.round(bid.vote_perc * 100)}%</span>
          </ConditionalWrapper>
        </InvisibleButton>
      ),

      actions: (
        <div className="flex items-center justify-end gap-3">
          <AddTributeButton bidId={bid.id} size="small" />
          <InvisibleButton onClick={() => onToggleRow(bid.id)}>
            <span className="sr-only">Tributes Details</span>{" "}
            <Icon name={isOpened ? "chevron-up" : "chevron-down"} />
          </InvisibleButton>
        </div>
      ),

      additional: isOpened && (
        <TributesList
          tokenBasedTributes={bid.tokenBasedTributes}
          pointBasedTributes={bid.points || []}
          bidDescription={bidDescriptions?.[bid.id]}
        />
      ),
    }
  })

  const tokenBasedBids = rows.filter(
    (row) =>
      row._bid.tokenBasedTributes && row._bid.tokenBasedTributes.length > 0
  )

  const pointBasedBids = rows.filter(
    (row) => row._bid.points && row._bid.points.length > 0
  )

  return { token: tokenBasedBids, point: pointBasedBids }
}
