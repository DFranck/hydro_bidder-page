import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import { AmountAndUnitPair } from "./AmountAndUnitPair"
import { sumBy } from "lodash"

export function BidPolSize({ bidId }: { bidId: number }) {
  const { bidsInfo } = useBackendData()
  const bid = bidsInfo[bidId]

  if (!bid) return null

  const { liquidityDeployment } = bid

  if (!liquidityDeployment) return null

  const { deployedFunds } = liquidityDeployment

  const currentAllocationAmount =
    sumBy(deployedFunds, (fund) => Number(fund.amount)) / 1e6

  const isPending = bid.status?.toLowerCase().includes("pending")
  const isVoting = bid.status?.toLowerCase().includes("voting")

  return isPending || isVoting ? (
    <StyledText variant="footnote">Pending</StyledText>
  ) : !!currentAllocationAmount ? (
    <AmountAndUnitPair
      amount={currentAllocationAmount.toLocaleString("en-US", {
        maximumFractionDigits: 4,
      })}
      unit="ATOM"
    />
  ) : (
    <StyledText variant="footnote" className="whitespace-nowrap">
      &mdash;
    </StyledText>
  )
}
