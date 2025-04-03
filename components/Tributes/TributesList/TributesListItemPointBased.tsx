import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { BidMetaDataSlimmed } from "@/contract-apis/types"
import Link from "next/link"

export function TributesListItemPointBased({
  amount,
  denom,
  description,
}: {
  amount: number
  denom: string
  description?: BidMetaDataSlimmed
}) {
  return (
    <div className="grid grid-cols-subgrid">
      <div>
        <StyledText variant="h4" className="flex gap-1 text-palette-green">
          <span>{amount}</span>
          <span>{denom}</span>
        </StyledText>
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
