import { SanitizedPointBasedTribute, SanitizedTokenBasedTribute } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { BidDescriptionFromGithub } from "@/contract-apis/fetchBidDescriptions"
import { StyledText } from "@/components/StyledText"
import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import {
  bidDetailsTributesListTooltip,
  pointBasedTributeAmountTooltip,
  tokenBasedTributeAmountTooltip,
} from "@/components/ToolTips"

interface TributesListSidebarProps {
  tributes: (SanitizedTokenBasedTribute | SanitizedPointBasedTribute)[]
  bidDescription?: BidDescriptionFromGithub
}

export function TributesListSidebar({ tributes, bidDescription }: TributesListSidebarProps) {
  return (
    <div>
      <Tooltip tipContents={bidDetailsTributesListTooltip}>
        <StyledText
          as="h3"
          variant="label"
          className="flex cursor-default items-center gap-1"
        >
          <span>Tributes</span>
          <Icon name="circle-info" />
        </StyledText>
      </Tooltip>
      <div className="flex flex-col gap-2">
        {tributes.map((tribute, index) => (
          <Tooltip key={index} tipContents={
            tribute.isTokenBased
              ? tokenBasedTributeAmountTooltip
              : pointBasedTributeAmountTooltip({
                pointProgramUrl: bidDescription?.pointProgramUrl,
              })
          }>
            <StyledText className="text-xl font-bold text-nowrap">
              <span>{tribute.amount} {tribute.denom}</span>
              <span className="text-xs text-nowrap mb-1"> (${tribute.valueUsd.toFixed(2)})</span>
            </StyledText>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}