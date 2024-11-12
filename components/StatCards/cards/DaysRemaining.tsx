"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { Timestamp } from "@/app/ts_types/HydroBase.types"
import { Icon } from "@/components/Icon"
import { StatCard } from "@/components/StatCards/StatCard"
import { Tooltip } from "@/components/Tooltip"
import { sum } from "lodash"

const getRoundEndText = (roundEnd: Timestamp) => {
  const now = new Date()
  const end = new Date(parseInt(roundEnd) / 1e6)
  const diff = end.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) {
    return `${days} d`
  } else {
    return `${hours} h`
  }
}

export function DaysRemaining() {
  const {
    globalState: { currentRound },
    currentProposalTranches,
    currentRoundEnd,
  } = useAppContext()

  const percentageOfNonVoters =
    100 -
    sum(
      currentProposalTranches
        .get(1) // TODO: make this dynamic
        ?.map((proposal) => Number(proposal.percentage)) ?? []
    )

  return (
    <StatCard
      title={
        <div className="flex items-center gap-1">
          {/* TODO: make this dynamic */}
          Time Left in Pilot Round 1
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
      value={currentRoundEnd ? getRoundEndText(currentRoundEnd) : "0:00"}
    />
  )
}
