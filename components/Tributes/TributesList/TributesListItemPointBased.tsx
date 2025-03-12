import { StyledText } from "@/components/StyledText"
import { SanitizedPointBasedTribute } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { BidDescriptionFromGithub } from "@/contract-apis/fetchBidDescriptions"
import Link from "next/link"

export function TributesListItemPointBased({
  tribute,
  description,
}: {
  tribute: SanitizedPointBasedTribute
  description?: BidDescriptionFromGithub
}) {
  return (
    <div className="flex flex-col">
      {description && (
        <div className="flex flex-row items-end gap-2 not-italic">
          <StyledText
            variant="link"
            href={description.pointProgramUrl!}
            as={Link}
          >
            {description.projectName}
          </StyledText>
          <StyledText>- {description.title}</StyledText>
        </div>
      )}
      <div className="flex flex-row items-end gap-2 text-xl font-bold text-palette-green">
        <span>{tribute.amount}</span>
        <span>{tribute.denom}</span>
        {tribute.valueUsd > 0 && <span>(${tribute.valueUsd.toFixed(2)})</span>}
      </div>
    </div>
  )
}
