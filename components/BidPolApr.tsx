import { StyledText } from "@/components/StyledText"
import { Tooltip } from "./Tooltip"
import { bidPolAprTooltip } from "./ToolTips"
import { twJoin } from "tailwind-merge"

export function BidPolApr({ bidId }: { bidId: number }) {
   return <Tooltip className={twJoin(
           "inline-flex items-center gap-1",
           "border-b-2 border-dotted border-white/50 hover:border-white"
         )} tipContents={bidPolAprTooltip}>
    <StyledText variant="footnote" className="text-center">—%</StyledText>
   </Tooltip>
}
