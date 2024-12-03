"use client"

import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { useBackendData } from "@/contract-apis/useBackendData"
import Link from "next/link"
import { StatCard } from "../StatCard"

export function HistoricalApr() {
  const { isLoading, metricsGlobal } = useBackendData()
  const { allTimeApr } = metricsGlobal

  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          Historical APR
          <Tooltip
            classNamesForTooltip="flex flex-col gap-2"
            tipContents={
              <>
                <p>Historical APRs based on</p>

                <ul>
                  {allTimeApr.map(({ period, apr }) => (
                    <li
                      key={period}
                      className="flex items-center justify-between"
                    >
                      <span>
                        Last <strong>{period}:</strong>
                      </span>{" "}
                      <span>{Math.round(parseFloat(apr) * 100)}%</span>
                    </li>
                  ))}
                </ul>

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
              </>
            }
          />
        </div>
      }
      subTitle="No historical data yet"
      value="–%"
    />
  )
}
