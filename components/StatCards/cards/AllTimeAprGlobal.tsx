"use client"

import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { useBackendData } from "@/contract-apis/useBackendData"
import Link from "next/link"
import { StatCard } from "../StatCard"

export function AllTimeAprGlobal() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { allTimePolApr } = metricsGlobal

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <div className="flex items-center gap-1">
          Historical APR
          <Tooltip
            classNamesForTooltip="flex flex-col gap-2"
            tipContents={
              <p>
                <StyledText
                  as={Link}
                  variant="link"
                  href="/docs/users/calculating-staking-apr"
                  target="_blank"
                >
                  Learn More
                  <Icon name="solid:arrow-up-right" />
                </StyledText>
              </p>
            }
          />
        </div>
      }
      subTitle="No historical data yet"
      value={`${allTimePolApr}%`}
    />
  )
}
