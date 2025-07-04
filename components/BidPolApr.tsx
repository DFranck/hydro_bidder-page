import { StyledText } from "@/components/StyledText"
import { twJoin } from "tailwind-merge"
import { Tooltip } from "./Tooltip"
import { bidPolAprTooltip } from "./ToolTips"

export function BidPolApr() {
  return (
    <Tooltip
      className={twJoin(
        "inline-flex items-center gap-1",
        "border-b-2 border-dotted border-white/50 hover:border-white"
      )}
      tipContents={bidPolAprTooltip}
    >
      <StyledText variant="footnote" className="text-center">
        —%
      </StyledText>
    </Tooltip>
  )
}
