import { AmountAndUnitPair } from "@/components/AmountAndUnitPair"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { useBackendData } from "@/contract-apis/useBackendData"
import { twJoin } from "tailwind-merge"

export function BidPolApr({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidsById, metricsForPostHydroBids } = backendData
  const bid = bidsById[bidId]

  if (!bid) return null

  const bidInfoFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bid.id
  )

  if (!bidInfoFromNumia) return null

  const {
    apr,
    isOngoing,
    isPending,
    isRejected,
    currentAllocationAmount,
    initialAllocationAmount,
  } = bidInfoFromNumia

  const isPendingOrOngoing = isPending || (isOngoing && !apr)

  return isRejected ? null : (
    <Tooltip
      tipContents={
        isPendingOrOngoing ? (
          "This deployment is still active or has not been withdrawn. PoL APR will be updated once the deployment is fully concluded."
        ) : (
          <div className="flex flex-col">
            <StyledText variant="label">PoL Rewards</StyledText>
            {"currentAllocationAmount" in bid &&
            "initialAllocationAmount" in bid ? (
              <AmountAndUnitPair
                amount={(
                  currentAllocationAmount - initialAllocationAmount
                ).toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })}
                unit="ATOM"
                textAlign="left"
              />
            ) : (
              0
            )}
          </div>
        )
      }
      className={twJoin(
        "border-b-2 border-dotted border-white/50 hover:border-white"
      )}
    >
      {isPendingOrOngoing ? (
        <StyledText variant="footnote">Pending</StyledText>
      ) : (
        <span>{`${apr}%`}</span>
      )}
    </Tooltip>
  )
}
