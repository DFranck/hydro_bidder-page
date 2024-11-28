import { Tooltip } from "@/components/Tooltip"
import { bidTypeTooltip } from "@/components/ToolTips"
import { FullyAugmentedBid } from "@/contract-apis/fetchBackendDataWithAddress"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"

export function BidTributes({ bid }: { bid: FullyAugmentedBid }) {
  return bid.tributes.map((tribute, index) => (
    <Tooltip
      key={index}
      tipContents={bidTypeTooltip({ isTokenBasedBid: tribute.isTokenBased })}
    >
      <p className="break-words text-xl font-bold not-italic">
        {tribute.isTokenBased ? (
          <span>
            {simplifyBigNumbers(tribute.amount)}&nbsp;
            {tribute.denom}
          </span>
        ) : (
          <span>
            {simplifyBigNumbers(tribute.amount)}&nbsp;
            {tribute.denom}
          </span>
        )}
      </p>
    </Tooltip>
  ))
}
