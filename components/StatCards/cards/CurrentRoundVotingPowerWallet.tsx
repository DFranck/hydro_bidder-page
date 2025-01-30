"use client"

import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import Link from "next/link"
import { Fragment } from "react"
import { twJoin } from "tailwind-merge"
import { StatCard } from "../StatCard"

export function CurrentRoundVotingPowerWallet() {
  const {
    isLoading,
    votingPowerAvailable,
    votingPowerSpent,
    votingPowerTotal,
  } = useBackendData()

  const hasVotingPowerOfAnyKind = votingPowerTotal > 0

  const hasVotingPowerAvailable = votingPowerAvailable > 0

  const hasVotingPowerButNoneAvailable =
    hasVotingPowerOfAnyKind && votingPowerSpent === votingPowerTotal

  const hasAllVotingPowerAvailable =
    hasVotingPowerOfAnyKind && votingPowerAvailable === votingPowerTotal

  const hasVotingPowerAvailableButNotAll =
    hasVotingPowerAvailable && !hasAllVotingPowerAvailable

  const yourVotingPowerTooltipRevised = (
    <div className="flex flex-col gap-2">
      <div
        className={twJoin(
          "grid grid-cols-[1fr_min-content] gap-x-6 gap-y-1",
          "whitespace-nowrap border-b pb-2"
        )}
      >
        <StyledText variant="label" className="col-span-2">
          Voting Power Breakdown
        </StyledText>

        {[
          ["Spent Voting Power", formatAmount(votingPowerSpent, 0, 4)],
          [
            "Available Voting Power",
            <span className="text-palette-green" key="available-voting-power">
              {formatAmount(votingPowerAvailable, 0, 4)}
            </span>,
          ],
          [
            <strong key="total-voting-power">Total Voting Power</strong>,
            formatAmount(votingPowerTotal, 0, 4),
          ],
        ].map(([label, value], index) => (
          <Fragment key={index}>
            <div>{label}</div>
            <div className="text-right">
              <strong>{value}</strong>
            </div>
          </Fragment>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {!hasVotingPowerOfAnyKind && (
          <p>
            <StyledText variant="link" as={Link} href="/lock-atom">
              Create a lockup
            </StyledText>{" "}
            to start voting.
          </p>
        )}

        {hasAllVotingPowerAvailable && (
          <p>
            <strong className="text-palette-green">All</strong> of your voting
            power is available.
          </p>
        )}

        {hasVotingPowerButNoneAvailable && (
          <p>
            <strong className="text-palette-red">None</strong> of your voting
            power is available because it is currently tied to one or more
            active deployments.{" "}
            <StyledText variant="link" as={Link} href="/lock-atom">
              Create a lockup
            </StyledText>{" "}
            to start voting.
          </p>
        )}

        {hasVotingPowerAvailableButNotAll && (
          <>
            <p>
              <strong className="text-palette-green">
                {formatAmount(votingPowerAvailable, 0, 4)}
              </strong>{" "}
              of <strong>{formatAmount(votingPowerTotal, 0, 4)} total</strong>{" "}
              voting power is available.
            </p>

            <p>
              The rest of your voting power is tied to one or more active
              deployments.{" "}
              <StyledText variant="link" as={Link} href="/lock-atom">
                Create a new lockup
              </StyledText>{" "}
              for more voting power.
            </p>
          </>
        )}
      </div>
    </div>
  )

  return (
    <StatCard
      isLoading={isLoading}
      value={formatAmount(votingPowerAvailable, 0, 4)}
      title={
        <Tooltip
          tipContents={yourVotingPowerTooltipRevised}
          classNamesForTooltip="w-fit"
        >
          <div className="flex items-center gap-1">
            <span>Available Voting Power</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      }
      subTitle={<span>{formatAmount(votingPowerTotal, 0, 4)} Total</span>}
    />
  )
}
