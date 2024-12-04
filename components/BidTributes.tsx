import { Tooltip } from "@/components/Tooltip"
import { bidTypeTooltip } from "@/components/ToolTips"
import { FullyAugmentedBid } from "@/contract-apis/fetchBackendDataWithWallet"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"
import { groupBy, sumBy } from "lodash"

export function BidTributes({
  bid,
  denomsOnly = false,
}: {
  bid: FullyAugmentedBid
  denomsOnly?: boolean
}) {
  const groupedTributes = groupBy(bid.tributes, "denom")

  return Object.entries(groupedTributes).map(([denom, tributes]) => {
    const totalAmount = sumBy(tributes, "amount")
    const isTokenBased = tributes[0].isTokenBased

    return (
      <Tooltip
        key={denom}
        tipContents={bidTypeTooltip({ isTokenBasedBid: isTokenBased })}
      >
        <p className="break-words text-xl font-bold not-italic">
          <span>
            {simplifyBigNumbers(totalAmount)}&nbsp;
            {denom}
          </span>
        </p>
      </Tooltip>
    )
  })
}
