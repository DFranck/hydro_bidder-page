import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { bidTypeTooltip } from "@/components/ToolTips"
import { AugmentedBid } from "@/contract-apis/fetchBackendDataAfterWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"
import { groupBy } from "lodash"
import Link from "next/link"
import { twJoin } from "tailwind-merge"

export function BidTributes({
  bid,
  classNamesForValues,
  classNamesForDenoms,
  denomsOnly = false,
  textAlign = "left",
}: {
  bid: AugmentedBid
  classNamesForValues?: string
  classNamesForDenoms?: string
  denomsOnly?: boolean
  textAlign?: "left" | "center" | "right"
}) {
  const { bidDescriptionsByBidId, metricsForPostHydroBids } = useBackendData()
  const bidInfoFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bid.id
  )

  if (!bidInfoFromNumia) {
    return 0
  }

  const { onchainTributeAssets, onchainTributeUsdc, offchainTribute } =
    bidInfoFromNumia

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

  const renderedTributes = Object.entries(tributesByDenom).map(
    ([denomOrType, tributes]) => {
      return tributes.map((tribute, index) => {
        const isTokenBased = tribute.tributeType === "tokens"
        const isPointBased = tribute.tributeType === "points"

        return (
          <Tooltip
            key={index}
            tipContents={bidTypeTooltip({ isTokenBased })}
            className={twJoin(
              "inline-flex flex-col",
              textAlign === "left" && "items-start",
              textAlign === "center" && "items-center",
              textAlign === "right" && "items-end"
            )}
          >
            <div
              className={twJoin(
                "inline-flex items-center gap-1",
                textAlign === "left" && "justify-start",
                textAlign === "center" && "justify-center",
                textAlign === "right" && "justify-end"
              )}
            >
              {isPointBased && <Icon name="solid:gem" />}
              {simplifyBigNumbers(tribute.amount)}{" "}
              <span className="opacity-60">{denomOrType}</span>
            </div>

            {isPointBased &&
              bidDescription &&
              bidDescription.pointProgramUrl && (
                <StyledText
                  as={Link}
                  href={bidDescription.pointProgramUrl}
                  variant="link"
                  className="inline-flex items-center gap-1 text-xs"
                >
                  <span>Learn More</span>
                  <Icon name="arrow-up-right-from-square" />
                </StyledText>
              )}
          </Tooltip>
        )
      })
    }
  )

  return renderedTributes.length > 0 ? renderedTributes : 0
}
