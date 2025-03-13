import { Icon } from "@/components/Icon"
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
    <div className="grid grid-cols-subgrid">
      <div>
        <StyledText variant="h4" className="flex gap-1 text-palette-green">
          <span>{tribute.amount}</span>
          <span>{tribute.denom}</span>
        </StyledText>

        {tribute.valueUsd > 0 && <span>(${tribute.valueUsd.toFixed(2)})</span>}
      </div>

      {description && description.pointProgramUrl && (
        <StyledText
          variant="link"
          href={description.pointProgramUrl}
          as={Link}
          target="_blank"
          className="flex items-center gap-1"
        >
          <span>Learn More</span>
          <Icon name="arrow-up-right-from-square" />
        </StyledText>
      )}
    </div>
  )
}
