import { AmountAndUnitPair } from "@/components/AmountAndUnitPair"
import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { bidTypeTooltip } from "@/components/ToolTips"
import { AugmentedBid } from "@/contract-apis/fetchBackendDataAfterWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"
import { groupBy } from "lodash"
import { twJoin } from "tailwind-merge"

export function BidTributes({
  bid,
  textAlign = "left",
}: {
  bid: AugmentedBid
  textAlign?: "left" | "center" | "right"
}) {
  const { bidDescriptionsByBidId, metricsForPostHydroBids } = useBackendData()
  const bidInfoFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bid.id
  )

  if (!bidInfoFromNumia) {
    return 0
  }

  const { onchainTributeAssets, offchainTribute } = bidInfoFromNumia

  const tributesByDenom = {
    ...groupBy(
      onchainTributeAssets.map((v) => ({ ...v, tributeType: "tokens" })),
      "denom"
    ),
    ...groupBy(
      offchainTribute.map((v) => ({ ...v, tributeType: "points" })),
      "type"
    ),
  }

  const bidDescription = bidDescriptionsByBidId[bid.id]

  const { pointProgramUrl } = bidDescription ?? {}

  const renderedTributes = Object.entries(tributesByDenom).map(
    ([denomOrType, tributes], index) => {
      return (
        <div
          className={twJoin(
            "flex flex-col",
            textAlign === "left" && "items-start",
            textAlign === "center" && "items-center",
            textAlign === "right" && "items-end"
          )}
          key={index}
        >
          {tributes.map((tribute, index) => {
            const isTokenBased = tribute.tributeType === "tokens"
            const isPointBased = tribute.tributeType === "points"

            return (
              <Tooltip
                key={index}
                tipContents={bidTypeTooltip({
                  isTokenBased,
                  pointProgramUrl,
                })}
              >
                <AmountAndUnitPair
                  amount={
                    <>
                      {isPointBased && <Icon name="solid:gem" />}{" "}
                      {simplifyBigNumbers(tribute.amount)}
                    </>
                  }
                  unit={
                    <>
                      {denomOrType}
                      {isPointBased && <Icon name="circle-info" />}
                    </>
                  }
                  textAlign={textAlign}
                />
              </Tooltip>
            )
          })}
        </div>
      )
    }
  )

  return renderedTributes.length > 0 ? renderedTributes : 0
}
