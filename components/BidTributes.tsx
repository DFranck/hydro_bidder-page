import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { bidTypeTooltip } from "@/components/ToolTips"
import { AugmentedBid } from "@/contract-apis/fetchBackendDataAfterWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"
import { groupBy, startCase, sumBy } from "lodash"
import Link from "next/link"

export function BidTributes({
  bid,
  denomsOnly = false,
}: {
  bid: AugmentedBid
  denomsOnly?: boolean
}) {
  const { bidDescriptionsByBidId } = useBackendData()
  const tributesByDenom = groupBy(bid.tributes, "denom")
  const renderedTributes = Object.entries(tributesByDenom).map(
    ([denom, tributes]) => {
      const totalAmount = sumBy(tributes, "amount")
      const isTokenBasedBid = tributes.every((tribute) => tribute.isTokenBased)
      const isPointBasedBid = !isTokenBasedBid
      const bidDescription = bidDescriptionsByBidId[bid.id]

      return (
        <Tooltip key={denom} tipContents={bidTypeTooltip({ isTokenBasedBid })}>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1 text-xl font-bold">
              {!isTokenBasedBid && <Icon name="solid:gem" />}
              <div>{simplifyBigNumbers(totalAmount)}</div>
              <div>{isTokenBasedBid ? denom : startCase(denom)}</div>
            </div>

            {isPointBasedBid &&
              bidDescription &&
              bidDescription.pointProgramUrl && (
                <div className="text-sm">
                  <StyledText
                    as={Link}
                    href={bidDescription.pointProgramUrl}
                    variant="link"
                    className="flex items-center gap-1"
                  >
                    <span>Learn More</span>
                    <Icon name="arrow-up-right-from-square" />
                  </StyledText>
                </div>
              )}
          </div>
        </Tooltip>
      )
    }
  )

  return renderedTributes.length > 0 ? renderedTributes : "–"
}
