import { AmountAndUnitPair } from "@/components/AmountAndUnitPair"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  pointBasedTributeAmountTooltip,
  tokenBasedTributeAmountTooltip,
} from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"
import groupBy from "lodash/groupBy"
import { twJoin } from "tailwind-merge"

export function BidTribute({
  bidId,
  textAlign = "left",
}: {
  bidId: number
  textAlign?: "left" | "center" | "right"
}) {
  const { bidMetaDataById, metricsForPostHydroBids } = useBackendData()

  const bidDescription = bidDescriptionsByBidId[bidId] ?? {}

  const { points = [] } = bidDescription

  const bidInfoFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bidId
  )

  if (!bidInfoFromNumia && points.length === 0) {
    return (
      <StyledText variant="footnote" className="whitespace-nowrap">
        No data yet
      </StyledText>
    )
  }

  const { onchainTributeAssets = [], offchainTribute = [] } =
    bidInfoFromNumia ?? {}

  let offchainTributeWithPoints = offchainTribute

  if (points.length && !onchainTributeAssets.length) {
    offchainTributeWithPoints = [
      {
        amount: points[0],
        type: points[1],
      },
    ]
  }

  const tributesByDenom = {
    ...groupBy(
      onchainTributeAssets.map((v) => ({ ...v, tributeType: "tokens" })),
      "denom"
    ),
    ...groupBy(
      offchainTributeWithPoints.map((v) => ({ ...v, tributeType: "points" })),
      "type"
    ),
  }

  const bidInfoFromGithub = bidMetaDataById[bidId]

  const { pointProgramUrl } = bidInfoFromGithub ?? {}

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
            const isPointBased = tribute.tributeType === "points"

            return (
              <Tooltip
                key={index}
                tipContents={
                  isPointBased
                    ? pointBasedTributeAmountTooltip({
                        pointProgramUrl,
                      })
                    : tokenBasedTributeAmountTooltip
                }
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
