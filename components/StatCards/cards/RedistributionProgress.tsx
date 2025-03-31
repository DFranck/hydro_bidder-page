"use client"

import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { polDeployedTooltip } from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import sumBy from "lodash/sumBy"
import { StatCard } from "../StatCard"

export function RedistributionProgress() {
  const { isLoading, bidsInfo } = useBackendData()
  const totalTributePaidUsd = sumBy(
    Object.values(bidsInfo),
    (bid) => bid.totalTokenBasedTributeValue,
  )
  const totalTributeOwedUsd = 667_500
  const percentRedistributed = (
    (totalTributePaidUsd / totalTributeOwedUsd) *
    100
  ).toFixed(2)

  return (
    <StatCard
      isLoading={isLoading}
      value={`${percentRedistributed}%`}
      title={
        <Tooltip tipContents={polDeployedTooltip}>
          <div className="flex items-center gap-1">
            <span>Redistributed to ATOM stakers</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={
        <div className="mt-1 flex flex-col gap-1">
          <StyledText variant="progressBar.container" className="w-full">
            <StyledText
              variant="progressBar"
              style={{
                minWidth: `${percentRedistributed}%`,
              }}
            />
          </StyledText>

          <div className="font-light text-white">
            <span className="font-bold text-palette-beige">
              ${Math.round(totalTributePaidUsd).toLocaleString()}
            </span>{" "}
            of{" "}
            <span className="font-bold">
              ${totalTributeOwedUsd.toLocaleString()}
            </span>{" "}
          </div>
        </div>
      }
    />
  )
}
