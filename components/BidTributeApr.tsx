import { BidTributes } from "@/components/BidTributes"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { useBackendData } from "@/contract-apis/useBackendData"
import { twJoin } from "tailwind-merge"

export function BidTributeApr({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidsById } = backendData
  const bid = bidsById[bidId]

  if (!bid) return null

  return (
    <Tooltip
      tipContents={
        <div className="flex flex-col">
          <StyledText variant="label">Tribute Size</StyledText>
          <BidTributes bid={bid} textAlign="left" />
        </div>
      }
      className={twJoin(
        "inline-flex items-center gap-1",
        "border-b-2 border-dotted border-white/50 hover:border-white"
      )}
      classNamesForTooltip="w-fit"
    >
      <span>{(bid.tributeApr * 100).toFixed(2)}%</span>
    </Tooltip>
  )
}
