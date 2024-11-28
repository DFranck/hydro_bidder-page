"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { useBackendData } from "@/contract-apis/useBackendData"
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
                  <a
                    href="/docs/users/calculating-staking-apr"
                    className="inline-flex gap-1 text-palette-green underline"
                    target="_blank"
                  >
                    Learn More
                    <Icon name="solid:arrow-up-right" />
                  </a>
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
