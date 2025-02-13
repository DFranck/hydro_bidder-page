import { BidTribute } from "@/components/BidTribute"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { useBackendData } from "@/contract-apis/useBackendData"
import { twJoin } from "tailwind-merge"

export function BidTributeAprRange({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidsById } = backendData
  const bid = bidsById[bidId]

  if (!bid) return null

  const formattedTributeAprMin = (bid.tributeAprMin * 100).toFixed(0)
  const formattedTributeAprMax = (bid.tributeAprMax * 100).toFixed(0)

  return (
    <Tooltip
      tipContents={
        <div className="flex flex-col">
          <StyledText variant="label">Tribute Size</StyledText>
          <BidTribute bid={bid} textAlign="left" />
        </div>
      }
      className={twJoin(
        "inline-flex items-center gap-1 whitespace-nowrap",
        "border-b-2 border-dotted border-white/50 hover:border-white"
      )}
      classNamesForTooltip="w-fit"
    >
      {bid.tributeAprMin === bid.tributeAprMax
        ? `${formattedTributeAprMin}%`
        : `${formattedTributeAprMin}%\u2009–\u2009${formattedTributeAprMax}%`}
    </Tooltip>
  )
}
