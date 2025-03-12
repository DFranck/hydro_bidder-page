import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  bidDetailsTributesListTooltip,
  pointBasedTributeAmountTooltip,
  tokenBasedTributeAmountTooltip,
} from "@/components/ToolTips"
import {
  SanitizedPointBasedTribute,
  SanitizedTokenBasedTribute,
} from "@/contract-apis/fetchBackendDataBeforeWallet"
import { BidDescriptionFromGithub } from "@/contract-apis/fetchBidDescriptions"

export function TributesListSidebar({
  tributes,
  bidDescription,
}: {
  tributes: (SanitizedTokenBasedTribute | SanitizedPointBasedTribute)[]
  bidDescription?: BidDescriptionFromGithub
}) {
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
          <Tooltip
            key={index}
            tipContents={
              tribute.isTokenBased
                ? tokenBasedTributeAmountTooltip
                : pointBasedTributeAmountTooltip({
                    pointProgramUrl: bidDescription?.pointProgramUrl,
                  })
            }
          >
            <StyledText className="text-nowrap text-xl font-bold">
              <span>
                {tribute.amount} {tribute.denom}
              </span>
              <span className="mb-1 text-nowrap text-xs">
                {" "}
                (${tribute.valueUsd.toFixed(2)})
              </span>
            </StyledText>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
