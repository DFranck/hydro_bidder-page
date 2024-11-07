"use client"

import { Icon } from "@/components/Icon"
import { StatCard } from "@/components/StatCards/StatCard"
import { Tooltip } from "@/components/Tooltip"

export function HistoricalAPR() {
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
                  {[1, 3, 12].map((months) => (
                    <li
                      key={months}
                      className="flex items-center justify-between"
                    >
                      <span>
                        Last{" "}
                        <strong>
                          {months} month
                          {months > 1 ? "s" : ""}:
                        </strong>
                      </span>{" "}
                      <span>-%</span>
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
