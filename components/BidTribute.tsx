import { AmountAndUnitPair } from "@/components/AmountAndUnitPair"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  pointBasedTributeAmountTooltip,
  tokenBasedTributeAmountTooltip,
} from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"
import { twJoin } from "tailwind-merge"

export function BidTribute({
  bidId,
  textAlign = "left",
}: {
  bidId: number
  textAlign?: "left" | "center" | "right"
}) {
  const { bidsInfo } = useBackendData()

  const bid = bidsInfo[bidId]

  if (!bid) {
    return (
      <StyledText variant="footnote" className="whitespace-nowrap">
        No data yet
      </StyledText>
    )
  }

  const { pointProgramUrl, tokenBasedTributes, points = [] } = bid

  const tributeAmountByDenom = tokenBasedTributes.reduce(
    (acc, currTribute) => {
      if (!acc[currTribute.denom]) {
        acc[currTribute.denom] = { amount: 0 }
      }
      acc[currTribute.denom].amount += currTribute.amount
      return acc
    },
    {} as { [denom: string]: { amount: number } }
  )

  const renderedTokenBasedTributes = Object.keys(tributeAmountByDenom).map(
    (denom, index) => (
      <Tooltip key={index} tipContents={tokenBasedTributeAmountTooltip}>
        <AmountAndUnitPair
          amount={simplifyBigNumbers(tributeAmountByDenom[denom].amount || 0)}
          unit={denom}
          textAlign={textAlign}
        />
      </Tooltip>
    )
  )

  const renderedPointBasedTributes = !points.length ? null : (
    <Tooltip tipContents={pointBasedTributeAmountTooltip({ pointProgramUrl })}>
      <div className="flex items-center gap-1">
        <Icon name="solid:gem" />
        <AmountAndUnitPair
          amount={simplifyBigNumbers(points[0])}
          unit={points[1]}
          textAlign={textAlign}
        />
        <Icon name="circle-info" />
      </div>
    </Tooltip>
  )

  return tokenBasedTributes.length + points.length > 0 ? (
    <div
      className={twJoin(
        "flex flex-col",
        textAlign === "left" && "items-start",
        textAlign === "center" && "items-center",
        textAlign === "right" && "items-end"
      )}
    >
      {renderedTokenBasedTributes}
      {renderedPointBasedTributes}
    </div>
  ) : (
    0
  )
}
