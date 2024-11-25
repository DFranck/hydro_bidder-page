"use client"

import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import { useContractContext } from "@/contract-apis/useContractContext"
import { sumBy } from "lodash"
import { StatCard } from "../StatCard"

const getRoundEndTextFromEndDate = (endDate: Date) => {
  const now = new Date()
  const diff = endDate.getTime() - now.getTime()

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  const seconds = diff / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const months = days / 30

  if (Math.abs(months) >= 1) {
    return rtf.format(Math.floor(months), "month")
  } else if (Math.abs(days) >= 1) {
    return rtf.format(Math.floor(days), "day")
  } else if (Math.abs(hours) >= 1) {
    return rtf.format(Math.floor(hours), "hour")
  } else {
    return rtf.format(Math.floor(minutes), "minute")
  }
}

export function DaysRemaining() {
  const { bidsByRoundId, currentRoundMetadata, isLoading } =
    useContractContext()
  const { roundEnd, roundId } = currentRoundMetadata
  const percentageOfNonVoters =
    100 - sumBy(bidsByRoundId[roundId], "votingPowerPercentage")

  return (
    <StatCard
      isLoading={isLoading}
      title={
        <div className="flex items-center gap-1">
          Time Left in Pilot Round {roundId + 1}
          <Tooltip
            tipContents={
              <>
                Number of days until the round ends. Users must vote before the
                end of the round to receive tributes.{" "}
                <a
                  href="/docs/users/voting-for-projects"
                  className="inline-flex gap-1 text-palette-green underline"
                  target="_blank"
                >
                  Learn More
                  <Icon name="solid:arrow-up-right" />
                </a>
              </>
            }
          />
        </div>
      }
      subTitle={
        <>
          <strong>{percentageOfNonVoters}%</strong> have not yet voted
        </>
      }
      value={roundEnd ? getRoundEndTextFromEndDate(roundEnd) : "0:00"}
    />
  )
}
